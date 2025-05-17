<template>
  <div>
    <h1>Elenco Cantieri</h1>
    <button @click="loadSites">Carica Cantieri</button>

    <ul v-if="sites.length">
      <li v-for="site in sites" :key="site.id">
        {{ site.name }} - {{ site.location }}
      </li>
    </ul>

    <p v-if="loading">Caricamento in corso...</p>
    <p v-if="error">{{ error }}</p>

    <h1>Elenco Segnalazioni</h1>
    <button @click="loadReports">Carica Segnalazioni</button>

    <ul v-if="reports.length">
      <li v-for="report in reports" :key="report.id">
        {{ report.name }} - {{ report.status }} - {{ report.info }}
      </li>
    </ul>

    <p v-if="loading">Caricamento in corso...</p>
    <p v-if="error">{{ error }}</p>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const sites = ref([]);
const loading = ref(false);
const error = ref('');

async function loadSites() {
  loading.value = true;
  error.value = '';
  try {
    const response = await axios.get('http://localhost:3000/api/v1/sites');
    sites.value = response.data;
  } catch (err) {
    error.value = err;
    console.error(err);
  } finally {
    loading.value = false;
  }
}
</script>
