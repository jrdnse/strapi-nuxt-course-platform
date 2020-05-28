<template>
  <div></div>
</template>
<script>
export default {
  layout: 'course',
  middleware({ redirect, $auth }) {
    if ($auth.user.invitee === '' || $auth.user.invitee === null) {
      return redirect('/')
    }
  },
}
</script>

<style></style>
