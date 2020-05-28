<template>
  <Loading v-if="loading" />
  <v-container v-else class="fill-height" fluid style="max-width: 70%;">
    <v-row style="margin-top: -40px;">
      <v-col class="text-left pa-0" align="center" justify="center">
        <h1>{{ quizData.title }}</h1>
      </v-col>
    </v-row>

    <v-row>
      <v-row>
        <v-col class="pa-0" align="start" justify="start">
          <v-container
            style="background: #fafafa; height: 500px; max-height: 600px;"
          >
            <Header
              v-if="
                isExamResults === null &&
                isResults === null &&
                isCooldown === null
              "
              class="px-12 py-6"
              :numberOfQuestions="quizData.questions.length"
              :index="index"
              :nextSlug="nextSlug"
              :isExam="quizData.exam"
              :timeLimit="timer"
              :quizTitle="quizData.title"
            />
            <QuestionBox
              :key="Math.random()"
              :isExamIndexPage="quizData.exam && index === -1"
              :success="isSuccess"
              :results="isResults"
              :isExamResults="isExamResults"
              :currentQuestion="quizData.questions[index]"
              :check="check"
              :next="next"
              :nextSlug="nextSlug"
              :tryAgain="tryAgain"
              :score="score"
              :numberOfQuestions="quizData.questions.length"
              :resetQuiz="resetQuiz"
              :isExam="quizData.exam"
              :startExam="startExam"
              :submitExam="submitExam"
              :quizData="quizData"
              :submitting="submitting"
              :finalQuestion="quizData.questions.length === index + 1"
              :examResults="examResults"
              :index="index"
              :timer="timer"
            />
          </v-container>
        </v-col>
      </v-row>
    </v-row>
  </v-container>
</template>

<script>
import QuestionBox from '~/components/Quiz/QuestionBox'
import checkExamQuestion from '~/apollo/mutations/checkExamQuestion'
import startExamMutation from '~/apollo/mutations/startExam'
import submitExamMutation from '~/apollo/mutations/submitExam'
import checkExamTimeLeftQuery from '~/apollo/queries/examTimeLeft'
import checkExamCooldownQuery from '~/apollo/queries/examCooldown'
import updateSelfQuizzes from '~/apollo/mutations/updateSelfQuizzes'
import Loading from '~/components/Utils/Loading.vue'
import Header from '~/components/Quiz/Header'

export default {
  components: {
    QuestionBox,
    Loading,
    Header,
  },
  props: ['quizData', 'loading', 'nextSlug'],
  data() {
    return {
      index: 0,
      isSuccess: null,
      isResults: null,
      isExamResults: null,
      score: 0,
      timer: 0,
      submitting: false,
      examResults: null,
      isCooldown: null,
      completedQuizzes: [],
      updatedQuizzes: [],
    }
  },
  async mounted() {
    if (this.quizData?.exam) {
      if (this.$auth.user?.currentExam && !this.$auth.user.examCooldown) {
        await this.checkExamCooldown()
        this.index = this.$auth.user?.currentExam?.currentQuestionIndex
        this.checkExamTimeLeft()
      } else if (this.$auth.user.completedQuizzes.includes(this.quizData.id)) {
        this.examResults = {
          score: this.$auth.user.examScore,
          passed: true,
          certificate: this.$auth.user.certificate,
        }
        this.isExamResults = true
      } else if (this.$auth.user.examCooldown) {
        this.examResults = {
          score: 0,
          passed: false,
          cooldown: this.isCooldown,
        }
        this.isExamResults = true
      } else {
        this.index = -1
      }
    } else {
      this.completedQuizzes = this.$auth.user.completedQuizzes
      if (this.completedQuizzes.includes(this.quizData?.id)) {
        this.isResults = true
      }
    }
  },
  methods: {
    async check(isCorrect, selection) {
      if (this.quizData?.exam) {
        this.submitting = true
        try {
          await this.$apollo.mutate({
            mutation: checkExamQuestion,
            variables: {
              answers: selection,
            },
          })
          if (this.quizData.questions.length === this.index + 1) {
            this.submitExam()
          }
        } catch (error) {
          this.$toast.error(error)
        }
        this.submitting = false
        this.$auth.fetchUser()
        this.next()
      } else if (isCorrect !== true && this.quizData?.exam) {
        this.next()
      } else if (isCorrect) {
        this.isSuccess = true
        this.score++
      } else if (isCorrect !== true) {
        this.isSuccess = false
      }
    },
    async next() {
      if (
        this.quizData?.exam &&
        this.quizData.questions.length === this.index + 1
      ) {
        this.submitExam()
        this.isExamResults = true
      } else if (this.index + 1 === this.quizData.questions.length) {
        await this.$auth.fetchUser()
        this.completedQuizzes = this.$auth.user.completedQuizzes
        const updatedQuizzes = [...this.completedQuizzes]

        if (!this.completedQuizzes.includes(this.quizData.id)) {
          updatedQuizzes.push(this.quizData.id)
          this.updateSelfQuizzes(updatedQuizzes)
        }
        this.isResults = true
      } else if (this.index + 1 < this.quizData.questions.length) {
        this.index++
        this.isSuccess = null
      } else if (!this.quizData?.exam) {
        this.isResults = true
      } else {
        this.isExamResults = true
      }
    },
    async startExam() {
      try {
        await this.$apollo.mutate({
          mutation: startExamMutation,
          variables: {
            examId: this.quizData.id,
          },
        })
        await this.checkExamTimeLeft()
        await this.$auth.fetchUser()
        this.next()
      } catch (error) {
        this.$toast.error(error)
      }
    },
    async checkExamTimeLeft() {
      try {
        const res = await this.$apollo.query({
          query: checkExamTimeLeftQuery,
        })
        this.timer = res?.data.examTimeLeft
      } catch (error) {
        this.$toast.error(error)
      }
    },
    async checkExamCooldown() {
      try {
        const res = await this.$apollo.query({
          query: checkExamCooldownQuery,
        })
        this.isCooldown = res.data.checkExamCooldown
      } catch (error) {
        this.$toast.error(error)
      }
    },
    async submitExam() {
      this.submitting = true
      try {
        const res = await this.$apollo.mutate({
          mutation: submitExamMutation,
          variables: {
            examId: this.quizData.id,
          },
        })
        this.examResults = res?.data?.submitExam
        this.submitting = false
        this.isExamResults = true
      } catch (error) {
        this.$toast.error(error)
      }
    },
    async updateSelfQuizzes(updatedQuizzes) {
      try {
        await this.$apollo.mutate({
          mutation: updateSelfQuizzes,
          variables: {
            quizzes: updatedQuizzes,
          },
        })
      } catch (error) {
        this.$toast.error(error)
      }
    },
    tryAgain() {
      this.isSuccess = null
    },
    resetQuiz() {
      this.index = 0
      this.isSuccess = null
      this.isResults = null
      this.score = 0
      this.isExamResults = null
      this.timer = 0
      this.submitting = false
      this.examResults = null
    },
  },
}
</script>

<style scoped>
.quizBg {
  background: #f5f5f5;
}
</style>
