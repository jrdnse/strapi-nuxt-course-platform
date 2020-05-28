<template>
  <Loading v-if="submitting" />
  <div v-else-if="passed || false" class="mt-0">
    <v-row no-gutters class="mb-4">
      <v-col align="left" class="px-12 py-6" style="height: 350px;">
        <h1>
          <v-icon
            size="44"
            class="zmdi zmdi-assignment-check green--text"
          ></v-icon>
          Congratulations!
        </h1>
        <h2>
          You passed and have received the Candidate Experience Certificate!
        </h2>
        <h3>You got a score of {{ score }}</h3>
        <a @click="goToCertificate">
          <h3>View your certificate</h3>
        </a>
        <a
          href="https://www.linkedin.com/profile/add"
          rel="nofollow"
          target="_blank"
          >Add to LinkedIn</a
        >
      </v-col></v-row
    >
  </div>

  <div v-else-if="!passed || false" class="mt-0">
    <v-row no-gutters class="mb-4">
      <v-col align="left" class="px-12 py-6" style="height: 350px;">
        <h1>
          <v-icon
            size="44"
            class="zmdi zmdi-assignment-alert red--text"
          ></v-icon>
          Better luck next time!
        </h1>
        <h2>
          Failing an exam even happens to the best. Go and study some more and
          retake the exam in
          <span class="font-weight-bold">{{ cooldown }}</span> 💪!
        </h2>
        <h3>You got a score of {{ score }}</h3>
      </v-col></v-row
    >
  </div>
</template>

<script>
import Loading from '~/components/Utils/Loading'
export default {
  components: {
    Loading,
  },
  props: ['examResults', 'submitting'],
  data() {
    return {
      passed: null,
      score: null,
      cooldown: 0,
    }
  },
  mounted() {
    this.passed = this.examResults?.passed
    this.score = this.examResults?.score
    this.cooldown = this.convertTime(
      720 - Math.floor((Date.now() - this.$auth.user.failedExamAt) / 60000)
    )
  },
  methods: {
    goToCertificate() {
      this.$router.push({
        name: 'certificate-certificate',
        params: {
          certificate: this.examResults.certificate,
        },
      })
    },
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
