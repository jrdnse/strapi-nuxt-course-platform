<template>
  <v-card style="max-width: 300px; margin: 0 auto;">
    <v-card-title>
      <span class="headline">Log In</span>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col style="padding: 0;">
            <p style="margin:0 padding:0">
              <a
                href="http://localhost:1337/connect/linkedin2"
                class="btn-linkedin"
              >
                <i class="zmdi zmdi-linkedin" />
                <span>Log in with LinkedIn</span>
              </a>
            </p>
          </v-col>
        </v-row>
      </v-container></v-card-text
    >
  </v-card>
</template>

<script>
export default {
  layout: 'basic',
  mounted() {
    history.replaceState({}, document.title, '/auth/login')
  },
}
</script>

<style lang="scss" scoped>
.headline {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.btn-linkedin {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
  user-select: none;
  text-align: center;
  white-space: nowrap;
  display: inline-block;
  transition: all 0.1s linear;
  background-color: #0077b5;
  border-color: #066094;
  color: white !important;
  max-width: 100%;
  padding: 0 10px 0 0;
  overflow: hidden;
  cursor: pointer;
  text-decoration: none;

  &:hover,
  &:focus {
    color: white;
    background-color: #0369a0;
  }

  .zmdi {
    display: inline-block;
    border-right: 1px solid rgba(0, 0, 0, 0.1);
    border-top-left-radius: 5;
    border-bottom-left-radius: 5;
    padding: 14px 14px;
    margin-right: 12px;
    margin-left: 0;
    font-size: 16px;
    line-height: 1;
    background-color: #0077b5; // linkedin blue
  }
}
</style>
