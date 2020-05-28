<template>
  <v-content>
    <v-container class="fill-height" fluid>
      <v-row>
        <v-col class="text-center ma-12" align="center" justify="center">
          <v-progress-circular
            indeterminate
            rotate="0"
            size="128"
            value="0"
            width="10"
            color="#028888"
            >Signing in</v-progress-circular
          >
        </v-col>
      </v-row>
    </v-container>
  </v-content>
</template>

<script>
export default {
  watch: {
    $route: 'fetchData',
  },
  created() {
    this.fetchData()
  },
  methods: {
    async fetchData() {
      try {
        const response = await this.$axios.$get(
          `http://localhost:1337/auth/linkedin2/callback?code=${this.$route.query.access_token}`
        )
        const { user, jwt } = response
        await this.$auth.setUser(user)
        await this.$auth.setToken('local', 'Bearer ' + jwt)
        await this.$apolloHelpers.onLogin(jwt)
        this.$toast.success('Logged in!')
      } catch (error) {
        this.$toast.error(`An error occured: ${error}`)
      }
    },
  },
}
</script>

<style></style>
