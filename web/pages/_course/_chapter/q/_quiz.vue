<template>
  <v-content>
    <Quiz
      :key="Math.random()"
      :quizData="quizzes"
      :loading="$apollo.queries.quizzes.loading"
      :nextSlug="next"
    />
  </v-content>
</template>
<script>
import quizQuery from '~/apollo/queries/quiz'
import Quiz from '~/components/Quiz/Quiz.vue'
import courseQuery from '~/apollo/queries/course'

export default {
  layout: 'course',
  components: {
    Quiz,
  },
  middleware({ redirect, $auth }) {
    if ($auth.user.invitee === '' || $auth.user.invitee === null) {
      return redirect('/')
    }
  },
  methods: {
    next() {
      const currentIndex = this.courses.findIndex((el) =>
        el?.lessonSlug
          ? el?.chapterSlug === this.$route.params.chapter &&
            el?.lessonSlug === this.$route.params.lesson
          : el?.chapterSlug === this.$route.params.chapter &&
            el?.quizSlug === this.$route.params.quiz
      )
      const nextIndex = currentIndex + 1
      if (nextIndex + 1 <= this.courses.length) {
        if (this.courses[nextIndex]?.lessonSlug) {
          this.$router.push({
            name: 'course-chapter-l-lesson',
            params: {
              course: this.$route.params.course,
              chapter: this.courses[nextIndex].chapterSlug,
              lesson: this.courses[nextIndex].lessonSlug,
            },
          })
        } else {
          this.$router.push({
            name: 'course-chapter-q-quiz',
            params: {
              course: this.$route.params.course,
              chapter: this.courses[nextIndex].chapterSlug,
              quiz: this.courses[nextIndex].quizSlug,
            },
          })
        }
      }
    },
  },
  apollo: {
    quizzes: {
      query: quizQuery,
      variables() {
        return { slug: this.$route.params.quiz }
      },
      update: (data) => data.quizzes[0],
    },
    courses: {
      query: courseQuery,
      variables() {
        return { slug: this.$route.params.course }
      },
      update: (data) => {
        const fixedArray = []
        data.courses[0].chapters.forEach((el) => {
          const chapterSlug = el.slug
          el.lessons.map((el) =>
            fixedArray.push({ chapterSlug, lessonSlug: el.slug })
          )
          el.quizzes.map((el) =>
            fixedArray.push({ chapterSlug, quizSlug: el.slug })
          )
        })
        return fixedArray
      },
    },
  },
}
</script>

<style></style>
