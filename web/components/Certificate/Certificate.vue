<template>
  <div class="cert--container">
    <div class="cert--title">
      <div>
        <img src="/company-logo.png" alt="company logo" />
      </div>
      <h1 class="title">Example Skill Certified</h1>
      <hr class="separator" />
    </div>
    <div class="cert--details">
      <h1 class="name">
        {{ certificateData.firstName }} {{ certificateData.lastName }}
      </h1>
      <p class="description">
        The bearer of this certificate is hereby deemed capable and skilled in
        the methodology of an example skill. They have been tested on best
        practices and are capable of applying them to create a a better example.
      </p>
      <p class="certifiedAt">Certified: {{ date }}</p>
      <hr class="separator" />
    </div>
    <div class="cert--footer">
      <p class="certId">Certification: {{ certificateData.id }}</p>
      <div class="cert--footer--flex">
        <div class="cert--footer--flex--child">
          <img src="logo-footer" alt="footer logo" />
        </div>
        <div class="cert--footer--flex--child"></div>
        <div class="cert--footer--flex--child">
          <img
            src="/signature.png"
            style="height: 80px; width: 250px;"
            alt="signature"
          />
          <h3>
            John Doe <br />
            CEO Example
          </h3>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  auth: false,
  props: {
    certificateData: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      date: null,
    }
  },
  mounted() {
    const currDate = new Date(this.certificateData.certifiedAt)
    const year = currDate.getFullYear()
    const month = currDate.toLocaleString('default', { month: 'long' })
    const day = currDate.getDate()
    this.date = `${month} ${day} ${year}`
  },
}
</script>

<style lang="scss" scoped>
.cert--container {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  grid-template-rows: 1fr 1fr 1fr;
  gap: 1px 1px;
  grid-template-areas: '. cert--title cert--title cert--title .' '. cert--details cert--details cert--details .' '. cert--footer cert--footer cert--footer .';
  padding: 50px;
  color: black;
  background: white;
  height: 100vh;
  width: 100vw;
}

.title {
  font-family: 'Roboto', sans-serif;
  font-weight: 500;
}

.separator {
  border: 1px solid #e8e8e8;
}

.cert--title {
  grid-area: cert--title;
  align-items: center;
  text-align: center;

  img {
    width: 100px;
    height: 100px;
    margin-bottom: 25px;
  }
}

.cert--details {
  grid-area: cert--details;
  align-items: center;
  text-align: center;
}

.name {
  font-family: 'Roboto', sans-serif;
  margin-top: 25px;
  margin-bottom: 15px;
  font-weight: 300;
}

.description {
  color: #525252;
}

.certifiedAt {
  font-size: 20px;
  margin-bottom: 41px;
}

.cert--footer {
  grid-area: cert--footer;
}

.certId {
  text-align: center;
  font-size: 12px;
}

.cert--footer--flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

.cert--footer--flex--child {
  flex: 1;
}
</style>
