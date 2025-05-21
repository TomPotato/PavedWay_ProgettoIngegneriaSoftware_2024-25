<template>
  <div class="drawer">
  <input id="my-drawer" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <label for="my-drawer" class="btn btn-primary drawer-button">Crea un Cantiere!</label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer" aria-label="close sidebar" class="drawer-overlay"></label>
        <fieldset class="fieldset bg-base-200 border-base-300 w-xs h-full border p-4">
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

            <button class="btn btn-neutral mt-4" @click="createSites" :disabled="NameSite || InfoSite  ||  Latitude || Longitude || Street || StNumber || City || Code || StartDuration || CompanyName">Crea</button>
        </fieldset>
  </div>
</div>

<div class="drawer drawer-end h-full">
  <input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
  <div class="drawer-content">
    <label for="my-drawer-4" class="drawer-button btn btn-primary">Cerca un Cantiere!</label>
  </div>
  <div class="drawer-side">
    <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
    <fieldset class="fieldset bg-base-200 border-base-300 w-xs h-full border p-4">
        <label class="label">Cerca il cantiere per informazioni</label>
        <input v-model="Latitude" type="text" class="input" placeholder="latitudine"  />
        <input v-model="Longitude" type="text" class="input" placeholder="Longitudine"  />
        <input v-model="Street" type="text" class="input" placeholder="Via/Strada/Viale"  />
        <input v-model="StNumber" type="text" class="input" placeholder="Numero Civico"  />
        <input v-model="City" type="text" class="input" placeholder="Cittá"  />
        <input v-model="Code" type="text" class="input" placeholder="Codice Postale"  />
        <input v-model="CompanyName" type="text" class="input" placeholder="Nome dell'Impresa" required />
        <label class="label">Oppure inserisci la posizione e il raggio entro cui cercare.</label>
        <input v-model="StartDuration" type="text" class="input" placeholder="Posizione iniziale"  />
        <input v-model="EndDuration" type="text" class="input" placeholder="Raggio"  />
        <button class="btn btn-neutral mt-4" @click="getSites">Cerca!</button>
    </fieldset>
  </div>
</div>

<div>
  <button class="btn btn-neutral mt-4" @click="getSites" :disabled=false>Mostra i Cantieri!</button>
  <pre v-if="data">{{ data }}</pre>
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