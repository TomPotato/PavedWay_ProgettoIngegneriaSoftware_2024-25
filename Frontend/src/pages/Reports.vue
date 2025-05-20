<template>
  <RedirectMessage />
  <h1>Example Reports</h1>
  <p>Click the button to fetch data with an HTTP request.</p>
  <p>Each click generates an object with a random user from the API.</p>
  <p>The robot avatars are lovingly delivered by <a href="http://Robohash.org" target="_blank">RoboHash</a>.</p>
  <button @click="getReports">Get Reports</button>
  <pre v-if="data">{{ data }}</pre>
  <p v-else>Click the button to fetch data.</p>
</template>

<script>
import RedirectMessage from '@/components/RedirectMessage.vue';

export default {
  data() {
    return {
      data: null,
    };
  },
  methods: {
    async getReports() {
      const response = await fetch(`${VUE_APP_API_URL}/reports`);
      this.data = await response.json();
      console.log(this.data);
    }
  }
};
</script>