<template>
  <h1>Example</h1>
  <p>Click the button to fetch data with an HTTP request.</p>
  <p>Each click generates an object with a random user from the API.</p>
  <p>The robot avatars are lovingly delivered by <a href="http://Robohash.org" target="_blank">RoboHash</a>.</p>
  <button @click="getSites">Get Sites</button>
  <pre v-if="data">{{ data }}</pre>
  <p v-else>Click the button to fetch data.</p>
</template>

<script>
  export default {
    data() {
      return {
        data: null,
      };
    },
    methods: {
      async getSites() {      
        const response = await fetch(`${VUE_APP_API_URL}/sites`);
        this.data = await response.json();
        console.log(this.data);
      }   
    }
  };
</script>