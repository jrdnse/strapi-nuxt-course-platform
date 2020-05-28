<template>
  <div class="mt-0">
    <v-row no-gutters>
      <v-col align="left" class="px-12 py-6" style="height: 365px;">
        <h2>{{ question }}</h2>
        <v-checkbox
          v-for="(answer, i) in answers"
          :key="i"
          v-model="checkboxes[i]"
          :label="answer.answer"
          :value="answer.answer"
        ></v-checkbox> </v-col
    ></v-row>
    <v-row no-gutters class="px-10 py-3" style="background: #ececec;">
      <v-col align="end">
        <v-btn
          :disabled="checkboxes.length === 0 || checkboxes === null"
          :loading="submitting"
          @click="check(correct, selectedIds)"
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
      checkboxes: [],
      correct: null,
      selectedIds: [],
    }
  },
  watch: {
    checkboxes: 'checkAnswer',
  },
  methods: {
    checkAnswer(selection) {
      const correctAnswers = this.answers.filter((answer) => {
        return answer.correct === true
      })
      const selected = this.answers.filter(
        (el, i) => el.answer === selection[i]
      )
      this.selectedIds = selected.map((el) => el.id)
      const filtered = correctAnswers.map((el) => el.answer)
      const intersection = filtered.filter((el) => selection.includes(el))
      if (intersection.length === filtered.length) {
        this.correct = true
      } else {
        this.correct = null
      }
    },
  },
}
</script>

<style></style>
