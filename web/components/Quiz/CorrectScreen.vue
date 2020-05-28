<template>
  <div class="mt-0">
    <v-row no-gutters class="mb-4">
      <v-col align="left" class="px-12 py-6" style="height: 350px;">
        <h1>
          <v-icon size="44" class="zmdi zmdi-check-circle green--text"></v-icon>
          Correct!
        </h1>
        {{ text }}
      </v-col></v-row
    >
    <v-row no-gutters class="px-10 py-3" style="background: #ececec;">
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
  props: ['text', 'next'],
}
</script>

<style></style>
