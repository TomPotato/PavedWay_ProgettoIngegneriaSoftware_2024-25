<template>
  <div style = "float: left; width:25%; margin-left: 2%;">
      <fieldset class="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend class="fieldset-legend">Crea un Cantiere!</legend>

          <label class="label">Titolo del Cantiere</label>
          <input v-model="NameSite" type="text" class="input" placeholder="Titolo Cantiere" required />

          <label class="label">Informazioni sul Cantiere</label>
          <input v-model="InfoSite" type="text" class="input" placeholder="Informazioni del cantiere" required />

          <label class="label">Posizione del Cantiere</label>
          <input v-model="Latitude" type="text" class="input" placeholder="latitudine" required />
          <input v-model="Longitude" type="text" class="input" placeholder="Longitudine" required />
          <input v-model="Street" type="text" class="input" placeholder="Via/Strada/Viale" required />
          <input v-model="StNumber" type="text" class="input" placeholder="Numero Civico" required />
          <input v-model="City" type="text" class="input" placeholder="Cittá" required />
          <input v-model="Code" type="text" class="input" placeholder="Codice Postale" required />

          <label class="label">Durata del cantiere</label>
          <input v-model="StartDuration" type="text" class="input" placeholder="Data di Inizio" required />
          <input v-model="EndDuration" type="text" class="input" placeholder="Data di Fine (non necessaria)" />

          <label class="label">Impresa Edile</label>
          <input v-model="CompanyName" type="text" class="input" placeholder="Nome dell'Impresa" required />

          <button class="btn btn-neutral mt-4" @click="createSite" :disabled="NameSite || InfoSite  ||  Latitude || Longitude || Street || StNumber || City || Code || StartDuration || CompanyName">Crea</button>
      </fieldset>
  </div>
  <div style = "width:75%;">
    <div style = "float: left; width: auto">
      <p style = "vertical-align: middle;">Clicca il pulsante per vedere i cantieri salvati: 
        <button class="btn btn-neutral mt-4" @click="getSites" :disabled=false>Mostra i Cantieri</button>
      </p>
      <pre v-if="data">{{ data }}</pre>
    </div>
  </div>
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