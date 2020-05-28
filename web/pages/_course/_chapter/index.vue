<template>
  <div></div>
</template>
<script>
export default {
  middleware({ redirect, $auth }) {
    if ($auth.user.invitee === '' || $auth.user.invitee === null) {
      return redirect('/')
    } else {
      return redirect('/example-course-1')
    }
  },
}
</script>

<style></style>
