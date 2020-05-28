<template>
  <div class="mt-0">
    <v-row no-gutters class="mb-4" style="height: 350px;">
      <v-col align="left" class="px-12 py-6 my-12">
        <h2>{{ question }}</h2>
        <v-radio-group v-model="selected">
          <v-radio
            v-for="(answer, i) in answers"
            :key="i"
            :label="answer.answer"
            :value="i"
          ></v-radio>
        </v-radio-group> </v-col
    ></v-row>
    <v-row no-gutters class="px-10 py-3" style="background: #ececec;">
      <v-col align="end">
        <v-btn
          :disabled="selected === null"
          :loading="submitting"
          @click="check(correct, selectedId)"
          >{{ finalQuestion && isExam ? 'Submit exam' : 'Next' }}</v-btn
        >
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  props: [
    'question',
    'answers',
    'check',
    'submitting',
    'finalQuestion',
    'isExam',
  ],
  data() {
    return {
      selected: null,
      correct: null,
      selectedId: null,
    }
  },
  watch: {
    selected: 'checkAnswer',
  },
  methods: {
    checkAnswer(selection) {
      const correctAnswer = this.answers.findIndex((answer) => {
        return answer.correct === true
      })
      this.selectedId = this.answers[selection].id
      if (selection === correctAnswer) {
        this.correct = true
      } else {
        this.correct = false
      }
    },
  },
}
</script>

<style></style>
