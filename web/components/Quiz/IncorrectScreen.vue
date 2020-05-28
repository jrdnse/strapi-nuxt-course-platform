<template>
  <div class="mt-0">
    <v-row no-gutters class="mb-4">
      <v-col align="left" class="px-12 py-6" style="height: 350px;">
        <h1>
          <v-icon size="44" class="zmdi zmdi-alert-circle red--text"></v-icon>
          Incorrect!
        </h1>
        {{ text }}
      </v-col></v-row
    >
    <v-row no-gutters class="px-10 py-3" style="background: #ececec;">
      <v-col align="start">
        <v-btn
          :disabled="selected === null"
          :loading="submitting"
          @click="tryAgain"
          >Try again</v-btn
        >
      </v-col>
      <v-col align="end">
        <v-btn :disabled="selected === null" :loading="submitting" @click="next"
          >Next</v-btn
        >
      </v-col>
    </v-row>
  </div></template
>

<script>
export default {
  props: ['text', 'next', 'tryAgain'],
}
</script>

<style></style>
