<template>
  <v-row>
    <v-col align="start" justify="start" class="pa-0">
      <ResultsScreen
        v-if="results"
        :score="score"
        :numberOfQuestions="numberOfQuestions"
        :resetQuiz="resetQuiz"
        :nextSlug="nextSlug"
      />

      <ExamIndex
        v-else-if="isExamIndexPage"
        :startExam="startExam"
        :quizData="quizData"
      />

      <!-- <ExamCooldown v-else-if="isCooldown" /> -->

      <ExamResults
        v-else-if="isExamResults"
        :examResults="examResults"
        :submitting="submitting"
      />

      <CorrectScreen
        v-else-if="success && isExam !== true"
        :next="next"
        :text="currentQuestion.successText"
      />

      <IncorrectScreen
        v-else-if="success === false && isExam !== true"
        :tryAgain="tryAgain"
        :next="next"
        :text="currentQuestion.failText"
      />

      <RadioQuestion
        v-else-if="currentQuestion && currentQuestion.type === 'radio'"
        :question="currentQuestion.question"
        :answers="currentQuestion.answers"
        :check="check"
        :submitting="submitting"
        :finalQuestion="finalQuestion"
        :isExam="isExam"
      />

      <MultipleQuestion
        v-else-if="currentQuestion && currentQuestion.type === 'multiple'"
        :question="currentQuestion.question"
        :answers="currentQuestion.answers"
        :check="check"
        :submitting="submitting"
        :finalQuestion="finalQuestion"
        :isExam="isExam"
      />
    </v-col>
  </v-row>
</template>

<script>
import CorrectScreen from '~/components/Quiz/CorrectScreen'
import IncorrectScreen from '~/components/Quiz/IncorrectScreen'
import ResultsScreen from '~/components/Quiz/ResultsScreen'
import RadioQuestion from '~/components/Quiz/RadioQuestion'
import MultipleQuestion from '~/components/Quiz/MultipleQuestion'
import ExamIndex from '~/components/Quiz/ExamIndex'
import ExamResults from '~/components/Quiz/ExamResults'

export default {
  components: {
    CorrectScreen,
    IncorrectScreen,
    ResultsScreen,
    RadioQuestion,
    MultipleQuestion,
    ExamIndex,
    ExamResults,
  },
  props: [
    'timer',
    'index',
    'examResults',
    'finalQuestion',
    'submitting',
    'quizData',
    'startExam',
    'submitExam',
    'nextSlug',
    'currentQuestion',
    'check',
    'success',
    'next',
    'tryAgain',
    'score',
    'results',
    'numberOfQuestions',
    'resetQuiz',
    'isExam',
    'isExamIndexPage',
    'isExamResults',
  ],
}
</script>

<style></style>
