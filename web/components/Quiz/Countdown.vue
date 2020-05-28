<template>
  <p>
    Time remaining: <span class="font-weight-bold">{{ formattedTime }}</span>
  </p>
</template>

<script>
export default {
  props: ['timer', 'quizTitle'],
  data() {
    return {
      countdown: this.timer,
      hours: null,
      minutes: null,
      seconds: null,
      formattedTime: '0',
      runningTimer: null,
    }
  },
  created() {
    this.countdownTimer()
  },
  methods: {
    countdownTimer() {
      if (this.countdown > 0) {
        this.runningTimer = setTimeout(() => {
          this.countdown -= 1
          this.countdownTimer()
          this.hours = Math.floor(this.countdown / 60 / 60)
          this.minutes = Math.floor(this.countdown / 60) - this.hours * 60
          this.seconds = this.countdown % 60
          this.formattedTime =
            this.hours.toString().padStart(2, '0') +
            ':' +
            this.minutes.toString().padStart(2, '0') +
            ':' +
            this.seconds.toString().padStart(2, '0')
          localStorage.setItem(this.quizTitle, this.countdown)
        }, 1000)
      }
    },
  },
}
</script>

<style></style>
