<template>
  <div class="cert">
    <Loading v-if="$apollo.queries.certificates.loading" />
    <Certificate v-else :certificateData="certificates" />
  </div>
</template>
<script>
import Certificate from '~/components/Certificate/Certificate'
import Loading from '~/components/Utils/Loading'
import certificateQuery from '~/apollo/queries/certificate'

export default {
  auth: false,
  components: {
    Certificate,
    Loading,
  },
  apollo: {
    certificates: {
      query: certificateQuery,
      variables() {
        return { id: this.$route.params.certificate }
      },
      update: (data) => data.certificates[0],
    },
  },

  // validate({ params }) {
  //   // const rgx = new RegExp('^[a-z](-?[a-z])*$')
  //   // return rgx.test(params.course)
  // },
}
</script>

<style scoped>
.cert {
  height: 100vh;
  width: 100vw;
}
</style>
