<template>
	<div class="drawer drawer-end h-full">
		<input id="my-drawer-4" type="checkbox" class="drawer-toggle" />
		<div class="drawer-content">
			<label for="my-drawer-4" class="drawer-button btn btn-primary">Cerca un Cantiere!</label>
		</div>
		<div class="drawer-side">
			<label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
			<fieldset class="fieldset bg-base-200 border-base-300 w-xs h-full border p-4">
				<label class="label">Cerca il cantiere per informazioni</label>
				<input v-model="latitude" type="text" class="input" placeholder="latitudine" />
				<input v-model="longitude" type="text" class="input" placeholder="Longitudine" />
				<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
				<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
				<input v-model="city" type="text" class="input" placeholder="Cittá" />
				<input v-model="code" type="text" class="input" placeholder="Codice Postale" />
				<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa" required />
				<label class="label">Oppure inserisci la posizione e il raggio entro cui cercare.</label>
				<input v-model="startDuration" type="text" class="input" placeholder="Posizione iniziale" />
				<input v-model="endDuration" type="text" class="input" placeholder="Raggio" />
				<button class="btn btn-neutral mt-4" @click="getSites">Cerca!</button>
			</fieldset>
		</div>
	</div>
	<label for="my_modal_7" class="btn btn-primary">Crea un cantiere!</label>
	<input type="checkbox" id="my_modal_7" class="modal-toggle" />
	<dialog id="my_modal_1" class="modal" role="dialog">
		<fieldset class="modal-box fieldset bg-base-200 border-base-300 w-xs border p-4">
			<label class="label">Titolo del Cantiere</label>
			<input v-model="name" type="text" class="input" placeholder="Titolo Cantiere" required />

			<label class="label">Informazioni sul Cantiere</label>
			<input v-model="info" type="text" class="input" placeholder="Informazioni del cantiere" required />

			<label class="label">Posizione del Cantiere</label>
			<input v-model="latitude" type="text" class="input" placeholder="latitudine" required />
			<input v-model="longitude" type="text" class="input" placeholder="Longitudine" required />
			<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
			<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
			<input v-model="city" type="text" class="input" placeholder="Cittá" required />
			<input v-model="code" type="text" class="input" placeholder="Codice Postale" required />

			<label class="label">Durata del cantiere</label>
			<input v-model="startDuration" type="text" class="input" placeholder="Data di Inizio" required />
			<input v-model="endDuration" type="text" class="input" placeholder="Data di Fine (non necessaria)" />

			<label class="label">Impresa Edile</label>
			<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa" required />

			<button class="btn btn-neutral mt-4" @click="createSites"
				:disabled="name || info || latitude || longitude || street || stNumber || city || code || startDuration || companyName">Crea</button>
		</fieldset>
		<label class="modal-backdrop" for="my_modal_7">Close</label>
	</dialog>
	<div>
		<button class="btn btn-neutral mt-4" @click="getSites" :disabled=false>Mostra i Cantieri!</button>
		<pre v-if="data">{{ data }}</pre>
	</div>
</template>

<script>
</script>