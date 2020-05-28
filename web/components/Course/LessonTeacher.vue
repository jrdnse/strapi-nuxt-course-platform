<template>
  <v-row no-gutters>
    <v-col cols="2" justify="center">
      <v-avatar size="88">
        <img
          :src="'http://localhost:1337' + data.profilePicture.url"
          :alt="data.profilePicture.alternativeText"
        />
      </v-avatar>
    </v-col>
    <v-col>
      <h3>{{ data.fullName }}</h3>
      <h4>{{ data.company }}</h4>
      <p class="mt-4 body-2">{{ data.biography }}</p>
      <a :href="data.linkedInURL" target="_blank">
        <i class="zmdi zmdi-linkedin-box"></i>
        <span>LinkedIn</span>
      </a>
    </v-col>
  </v-row>
</template>

<script>
export default {
  props: ['data'],
}
</script>

<style></style>
