<template>
  <div class="mt-0">
    <v-row no-gutters class="mb-4">
      <v-col align="left" class="px-12 py-6" style="height: 440px;">
        <h2>Before taking this exam</h2>
        <ul>
          <li>There are {{ questions }} questions.</li>
          <li>
            You must get a total score of
            {{ pointsToPass }} to pass.
          </li>
          <li>
            You must wait 12 hours between attempts.
          </li>
          <li>You have {{ time }} hours to finish the exam.</li>
          <li>
            Take your time. You can't go back and change your answers once
            they're submitted.
          </li>
        </ul>
        <h3>Good luck!</h3>
      </v-col>
    </v-row>
    <v-row no-gutters class="px-10 py-3" style="background: #ececec;">
      <v-col align="end">
        <v-btn @click="startExam">Begin exam</v-btn>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: ['quizData', 'startExam'],
  data() {
    return {
      time: 0,
      questions: 0,
      pointsToPass: 0,
      cooldown: 0,
    }
  },
  mounted() {
    this.time = this.convertTime(this.quizData.examTimeLimit)
    this.questions = this.quizData.questions.length
    this.pointsToPass = this.quizData.pointsToPassExam
    this.cooldown = this.convertTime(
      720 - Math.floor((Date.now() - this.$auth.user.failedExamAt) / 60000)
    )
  },
  methods: {
    convertTime(min) {
      const hours = Math.floor(min / 60)
      const minutes = min % 60
      return (
        hours.toString().padStart(2, '0') +
        ' hours and ' +
        minutes.toString().padStart(2, '0') +
        ' minutes'
      )
    },
  },
}
</script>

<style></style>
