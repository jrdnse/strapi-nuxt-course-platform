<template>
  <v-navigation-drawer v-model="drawer" app clipped left width="25vw">
    <v-expansion-panels accordion multiple>
      <v-expansion-panel v-for="(chapter, i) in chapters" :key="i">
        <v-expansion-panel-header
          ><h3>
            {{ chapter.title }}
          </h3></v-expansion-panel-header
        >
        <v-expansion-panel-content>
          <LessonLink
            v-for="(lesson, j) in chapter.lessons"
            :key="j"
            :title="lesson.title"
            :duration="lesson.duration"
            :courseSlug="courseSlug"
            :chapterSlug="chapter.slug"
            :slug="lesson.slug"
          />
          <QuizLink
            v-for="(quiz, k) in chapter.quizzes"
            :key="k"
            :title="quiz.title"
            :numberOfQuestions="quiz.questions.length"
            :courseSlug="courseSlug"
            :chapterSlug="chapter.slug"
            :slug="quiz.slug"
          />
        </v-expansion-panel-content>
      </v-expansion-panel>
    </v-expansion-panels>
  </v-navigation-drawer>
</template>

<script>
import LessonLink from '~/components/Course/LessonLink'
import QuizLink from '~/components/Course/QuizLink'

export default {
  components: {
    LessonLink,
    QuizLink,
  },
  props: ['chapters', 'drawer', 'courseSlug'],
}
</script>

<style></style>
