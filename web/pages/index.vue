<template>
  <div>
    <v-card
      v-if="
        $auth.user.invitee === '' ||
        $auth.user.invitee === null ||
        $auth.user.invitee === undefined
      "
      style="max-width: 300px; margin: 0 auto;"
    >
      <v-card-title>
        <span class="headline">Invite a friend</span>
      </v-card-title>
      <v-card-text>
        <v-container>
          <v-row>
            <v-col style="padding: 0;">
              <form autocomplete="off" @submit.prevent="inviteFriend">
                <v-text-field
                  v-model="inviteEmail"
                  v-model.lazy="inviteEmail"
                  v-model.trim="inviteEmail"
                  placeholder="Invitee's email"
                  autocomplete="false"
                  type="email"
                  style="font-family: 'Roboto', sans-serif;"
                ></v-text-field>
                <v-btn class="inviteBtn btn-link" type="submit">
                  Invite
                </v-btn>
              </form>
            </v-col>
          </v-row>
        </v-container></v-card-text
      >
    </v-card>
    <nuxt-child />
  </div>
</template>

<script>
import courseQuery from '~/apollo/queries/course'

export default {
  data() {
    return {
      inviteEmail: '',
    }
  },
  mounted() {
    history.replaceState({}, document.title, '/')
    this.$auth.fetchUser()
  },
  methods: {
    async inviteFriend() {
      const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

      if (!this.inviteEmail) {
        this.$toast.error('Invitee email is required!')
      } else if (!emailRegex.test(this.inviteEmail)) {
        this.$toast.error('Incorrect email!')
      } else {
        const config = {
          headers: {
            Authorization: this.$auth.getToken('local'),
          },
        }
        try {
          await this.$axios.$put(
            '/myself',
            {
              invitee: this.inviteEmail,
            },
            config
          )
          await this.$auth.fetchUser()
          this.$toast.success('Invitation sent!')
        } catch (error) {
          this.$toast.error(`An error occured: ${error}`)
        }
      }
    },
    async logout() {
      await this.$auth.logout().then(() => {
        this.$axios.setHeader('Authorization', null)
        this.$apollo.provider.defaultClient.resetStore()
        this.$apolloHelpers.onLogout()
        this.$toast.success('Logged out')
      })
    },
    goToCourse() {
      if (this.$auth.user.completedLessons.length === 0) {
        this.$router.push({
          name: 'course-chapter-l-lesson',
          params: {
            course: 'example-course-1',
            chapter: 'chapter-1',
            lesson: 'lesson-1',
          },
        })
      } else {
        const completedLessons = this.$auth.user.completedLessons
        const lastLessonId = completedLessons.slice(-1).toString()
        const currentLesson = this.courses.filter(
          (el) => el.id === lastLessonId
        )
        this.$router.push({
          name: 'course-chapter-l-lesson',
          params: {
            course: 'example-course-1',
            chapter: currentLesson[0].chapterSlug,
            lesson: currentLesson[0].lessonSlug,
          },
        })
      }
    },
  },
  apollo: {
    courses: {
      query: courseQuery,
      variables() {
        return { slug: 'example-course-1' }
      },
      update: (data) => {
        const fixedArray = []
        data.courses[0].chapters.forEach((el) => {
          const chapterSlug = el.slug
          el.lessons.map((el) =>
            fixedArray.push({ id: el.id, chapterSlug, lessonSlug: el.slug })
          )
          el.quizzes.map((el) =>
            fixedArray.push({ id: el.id, chapterSlug, quizSlug: el.slug })
          )
        })
        return fixedArray
      },
    },
  },
}
</script>

<style scoped>
.inviteCol {
  max-width: 600px;
}

.inviteBtn {
  user-select: none;
  text-align: center;
  white-space: nowrap;
  display: inline-block;
  transition: all 0.1s linear;
  line-height: 1.715;
  padding: 5px 16px;
  background-color: #e0f1f1;
  border-radius: 2px;
  border: 1px solid rgba(0, 0, 0, 0.05);
  color: #088;
  min-width: 64px;
  cursor: pointer;
  font-family: 'Roboto', sans-serif;
  font-weight: 400;
  font-weight: 600;
  font-size: 14px;
  text-transform: uppercase;
  letter-spacing: 0.075em;
}
</style>
