<template>
  <nuxt-link
    id="quizLink"
    :to="{
      name: 'course-chapter-q-quiz',
      params: { course: courseSlug, chapter: chapterSlug, quiz: slug },
    }"
    append
  >
    <div>
      <h4>{{ title }}</h4>
      <small>{{ numberOfQuestions }} questions</small>
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: ['title', 'slug', 'courseSlug', 'chapterSlug', 'numberOfQuestions'],
}
</script>

<style scoped>
#quizLink {
  display: block;
  padding: 1em 2em;
}
</style>
