<template>
  <nuxt-link
    id="lessonLink"
    :to="{
      name: 'course-chapter-l-lesson',
      params: { course: courseSlug, chapter: chapterSlug, lesson: slug },
    }"
    append
  >
    <div>
      <h4>{{ title }}</h4>
      <small>{{ duration }} minutes</small>
      {{ nextSlug }}
    </div>
  </nuxt-link>
</template>

<script>
export default {
  props: ['title', 'duration', 'slug', 'courseSlug', 'chapterSlug', 'nextSlug'],
}
</script>

<style scoped>
#lessonLink {
  display: block;
  padding: 1em 2em;
}
</style>
