<template>
  <div class="app">
    <v-app id="inspire">
      <v-app-bar
        app
        dense
        light
        color="#028888"
        clipped-left
        class="white--text"
      >
        <v-app-bar-nav-icon
          class="white--text"
          @click.stop="drawer = !drawer"
        />
        <v-toolbar-title>{{ courses.title }} </v-toolbar-title>
        <v-spacer></v-spacer>
        <a class="white--text" @click="logout">Logout</a>
      </v-app-bar>

      <Sidebar
        :chapters="courses.chapters"
        :drawer="drawer"
        :courseSlug="courses.slug"
      />

      <nuxt-child />
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
  data() {
    return {
      drawer: true,
      slug: this.$route.params.course,
      courses: [],
    }
  },
  methods: {
    async logout() {
      await this.$auth.logout().then(() => {
        this.$axios.setHeader('Authorization', null)
        this.$apollo.provider.defaultClient.resetStore()
        this.$apolloHelpers.onLogout()
        this.$toast.success('Logged out')
      })
    },
  },
  apollo: {
    courses: {
      query: courseQuery,
      variables() {
        return { slug: this.$route.params.course }
      },
      update: (data) => data.courses[0],
    },
  },
  // validate({ params }) {
  //   // const rgx = new RegExp('^[a-z](-?[a-z])*$')
  //   // return rgx.test(params.course)
  // },
}
</script>
