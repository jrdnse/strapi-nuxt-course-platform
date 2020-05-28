<template>
  <v-row v-if="!isExam">
    <v-col class="text-left pa-0" align="start" justify="start">
      <p class="ma-0">
        <span class="font-weight-bold">Question {{ index + 1 }} </span> of
        {{ numberOfQuestions }}
      </p>
    </v-col>
    <v-col class="text-right ma-0 pa-0" align="center" justify="center">
      <a @click="nextSlug">Skip quiz</a>
    </v-col>
  </v-row>
  <v-row v-else-if="isExam && index >= 0">
    <v-col class="text-left pa-0" align="start" justify="start">
      <p class="ma-0">
        <span class="font-weight-bold">Question {{ index + 1 }} </span> of
        {{ numberOfQuestions }}
      </p>
    </v-col>
    <v-col class="text-right ma-0 pa-0" align="center" justify="center">
      <Countdown :timer="timeLimit" :quizTitle="quizTitle" />
    </v-col>
  </v-row>
</template>

<script>
import Countdown from '~/components/Quiz/Countdown'
export default {
  components: {
    Countdown,
  },
  props: [
    'index',
    'numberOfQuestions',
    'nextSlug',
    'isExam',
    'timeLimit',
    'quizTitle',
  ],
  data() {
    return {}
  },
  mounted() {},
}
</script>

<style scoped></style>
