<template>
  <Loading v-if="loading" />
  <v-container v-else class="fill-height" fluid style="max-width: 70%;">
    <v-row>
      <v-col class="text-left pa-0" align="center" justify="center">
        <h1 class="mb-6">{{ lessonData.title }}</h1>
      </v-col>
    </v-row>

    <v-row
      v-if="lessonData.video.url"
      align="center"
      justify="center"
      class="mb-8"
    >
      <v-col class="topRowContainer pa-0">
        <PlyrVideo
          :key="lessonData.id"
          :videoUrl="lessonData.video.url"
          :subtitlesUrl="lessonData.videoSubtitles.url"
          :posterUrl="lessonData.poster.url"
        />
        <v-row no-gutters class="px-4 py-3" style="background: #ececec;">
          <v-col align="end">
            <v-btn @click="next">Next lesson</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="lessonData.overview">
      <v-col class="text-left pa-0" align="center" justify="center">
        <h2 class="mb-3 mt-12">Lesson overview</h2>
        <p v-html="$md.render(lessonData.overview)"></p>
      </v-col>
    </v-row>

    <v-row v-if="lessonData.teacher">
      <v-col class="text-left" align="center" justify="center">
        <h2 class="mb-3 mt-12">Lesson teacher</h2>
        <LessonTeacher :data="lessonData.teacher"></LessonTeacher>
      </v-col>
    </v-row>

    <v-row
      v-if="lessonData.slides || lessonData.transcript"
      align="center"
      justify="center"
    >
      <v-col class="text-left">
        <h2 class="mb-3 mt-12">Lesson resources</h2>
        <v-icon class="zmdi zmdi-file-text"></v-icon>
        <a
          :href="'http://localhost:1337' + lessonData.slides.url"
          target="_blank"
        >
          <span>Slides</span>
          <i class="zmdi zmdi-link"></i>
        </a>
        <br />
        <v-icon class="zmdi zmdi-file-text"></v-icon>
        <a
          :href="'http://localhost:1337' + lessonData.transcript.url"
          target="_blank"
        >
          <span>Transcript</span>
          <i class="zmdi zmdi-link"></i>
        </a>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import LessonTeacher from '~/components/Course/LessonTeacher.vue'
import PlyrVideo from '~/components/Course/PlyrVideo.vue'
import Loading from '~/components/Utils/Loading.vue'

export default {
  components: {
    PlyrVideo,
    LessonTeacher,
    Loading,
  },
  props: ['lessonData', 'loading', 'next'],
}
</script>

<style>
.topRowContainer {
  background: #ececec;
}
</style>
