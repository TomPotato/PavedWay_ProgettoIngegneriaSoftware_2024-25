<template>
  <div>
    <h1>EVENTI</h1>

    <div>
      <h2>Elenco Cantieri</h2>
      <button @click="loadSites">Carica Cantieri</button>

      <ul v-if="sites.length">
        <li v-for="site in sites" :key="site.id">
          {{ site.name }} - {{ site.location }}
        </li>
      </ul>
      <p v-if="loadingSites">Caricamento cantieri in corso...</p>
      <p v-if="errorSites">{{ errorSites }}</p>
    </div>  
    
    <div>
      <h2>Elenco Segnalazioni</h2>
      <button @click="loadReports">Carica Segnalazioni</button>

      <ul v-if="reports.length">
        <li v-for="report in reports" :key="report.id">
          {{ report.name }} - {{ report.information }}
        </li>
      </ul>
      <p v-if="loadingReports">Caricamento segnalazioni in corso...</p>
      <p v-if="errorReports">{{ errorReports }}</p>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios';

const sites = ref([]);
const loadingSites = ref(false);
const errorSites = ref('');
const reports = ref([]);
const loadingReports = ref(false);
const errorReports = ref('');

async function loadSites() {
  loadingSites.value = true;
  errorSites.value = '';
  try {
    const response = await axios.get('http://localhost:3000/api/v1/sites');
    sites.value = response.data;
  } catch (err) {
    errorSites.value = err;
    console.error(err);
  } finally {
    loadingSites.value = false;
  }
}

async function loadReports() {
  loadingReports.value = true;
  errorReports.value = '';
  try {
    const response = await axios.get('http://localhost:3000/api/v1/reports');
    reports.value = response.data;
  } catch (err) {
    errorReports.value = err;
    console.error(err);
  } finally {
    loadingReports.value = false;
  }
}
</script>
