<template>
  <v-content>
    <Lesson
      :lessonData="lessons"
      :loading="$apollo.queries.lessons.loading"
      :next="next"
    />
  </v-content>
</template>
<script>
import Lesson from '~/components/Course/Lesson'
import lessonQuery from '~/apollo/queries/lesson'
import courseQuery from '~/apollo/queries/course'
import updateSelfLessonsMutation from '~/apollo/mutations/updateSelfLessons'

export default {
  layout: 'course',
  components: {
    Lesson,
  },
  methods: {
    async next() {
      await this.$auth.fetchUser()
      const completedLessons = this.$auth.user.completedLessons
      const updatedLessons = [...completedLessons]

      if (!completedLessons.includes(this.lessons.id)) {
        updatedLessons.push(this.lessons.id)
        this.updateSelfLessons(updatedLessons)
      }

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
    async updateSelfLessons(updatedLessons) {
      try {
        await this.$apollo.mutate({
          mutation: updateSelfLessonsMutation,
          variables: {
            lessons: updatedLessons,
          },
        })
      } catch (error) {
        this.$toast.error(error)
      }
    },
  },
  apollo: {
    lessons: {
      query: lessonQuery,
      variables() {
        return { slug: this.$route.params.lesson }
      },
      update: (data) => data.lessons[0],
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
