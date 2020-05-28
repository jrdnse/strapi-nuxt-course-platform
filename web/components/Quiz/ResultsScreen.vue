<template>
  <div class="mt-0">
    <v-row no-gutters class="mb-4">
      <v-col align="left" class="px-12 py-6" style="height: 420px;">
        <h1>
          <v-icon
            size="44"
            class="zmdi zmdi-assignment-check green--text"
          ></v-icon>

          Quiz complete!
        </h1>
        <h3>Score:</h3>
        <h2>{{ score }} / {{ numberOfQuestions }}</h2>
      </v-col></v-row
    >
    <v-row no-gutters class="px-10 py-3" style="background: #ececec;">
      <v-col align="start">
        <v-btn @click="resetQuiz">Retake Quiz</v-btn>
      </v-col>
      <v-col align="end">
        <v-btn @click="nextSlug">Next Lesson</v-btn>
      </v-col>
    </v-row>
  </div></template
>

<script>
export default {
  props: ['score', 'numberOfQuestions', 'resetQuiz', 'nextSlug'],
}
</script>

<style></style>
