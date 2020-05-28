<template>
  <div class="app">
    <v-app id="inspire">
      <v-app-bar app color="indigo" dark dense clipped-left>
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" />
        <v-toolbar-title
          >Test {{ course.title }} {{ course.slug }}</v-toolbar-title
        >
      </v-app-bar>

      <Sidebar
        v-bind:chapters="course.chapters"
        v-bind:courseSlug="course.slug"
        v-bind:drawer="drawer"
      />

      <v-content>
        <v-container class="fill-height" fluid>
          <v-row>
            <v-col class="text-center" align="center" justify="center">
              <nuxt />
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </div>
</template>

<script>
import courseQuery from '~/apollo/queries/course'
import Sidebar from '~/components/Course/Sidebar'

export default {
  components: {
    Sidebar,
  },
  props: {
    source: String,
  },
  data: () => ({
    drawer: null,
    course: [],
  }),
  apollo: {
    course: {
      prefetch: true,
      query: courseQuery,
    },
  },
}
</script>
