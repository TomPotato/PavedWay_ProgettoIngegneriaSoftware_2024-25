<template>
	<div class="tabs tabs-lift tabs-s">
		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Cantieri" />
		<div class="tab-content bg-base-200 border-base-400 h-auto w-full p-6">
			<div class="flex h-auto">
				<div class="w-[30vh] space-y-2 flex items-center">
					<div class="grid grid-cols-1 grid-rows-1 gap-10 w-xs">
						<button class="btn btn-neutral mt-4 w-full" @click="getSites" :disabled=false>Mostra tutti i
							Cantieri!</button>
						<pre v-if="data">{{ data }}</pre>
						<label for="my-drawer-Cantieri" class="btn btn-primary drawer-button w-full">Cerca
							Cantieri!</label>
						<label for="my_modal_Cantieri" class="btn btn-primary w-full">Crea un cantiere!</label>
					</div>
				</div>
				<div class="flex-1 p-6 overflow-y-auto min-h-full flex flex-col max-h-[80vh]">
					<h1 class="text-2xl font-bold mb-4">Ecco qua!</h1>
					<div class="space-y-4">
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 1</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
					</div>
				</div>
			</div>


			<div class="drawer drawer-end h-full center-0">
				<input id="my-drawer-Cantieri" type="checkbox" class="drawer-toggle"/>
				<div class="drawer-side">
					<label for="my-drawer-Cantieri" aria-label="close sidebar" class="drawer-overlay"></label>
					<div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
						<fieldset class="fieldset bg-base-200 border-base-200 w-xs h-full border p-4">
							<label class="label">Cerca il cantiere per informazioni</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
							<input v-model="city" type="text" class="input" placeholder="Cittá" />
							<input v-model="code" type="text" class="input" placeholder="Codice Postale" />
							<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa" />
							<label class="label">Oppure inserisci la posizione e il raggio entro cui
								cercare.</label>
							<label class="label">Posizione per lat/long</label>
							<input v-model="latitude" type="text" class="input" placeholder="latitudine" />
							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" />
							<label class="label">Posizione per via</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
							<label class="label">E inserisci il raggio</label>
							<input v-model="endDuration" type="text" class="input" placeholder="Raggio" />
							<label for="my-drawer-Cantieri" class="btn btn-neutral mt-4" @click="getSitesByInfo">Cerca!</label>
						</fieldset>
					</div>
				</div>
			</div>

			<input type="checkbox" id="my_modal_Cantieri" class="modal-toggle" />
			<dialog id="my_modal_id" class="modal" role="dialog">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Titolo del Cantiere</label>
							<input v-model="name" type="text" class="input" placeholder="Titolo Cantiere" required />

							<label class="label">Informazioni sul Cantiere</label>
							<input v-model="info" type="text" class="input" placeholder="Informazioni del cantiere"
								required />

							<label class="label">Posizione del Cantiere</label>
							<input v-model="latitude" type="text" class="input" placeholder="Latitudine" required />
							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" required />
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<input v-model="city" type="text" class="input" placeholder="Cittá" required />
							<input v-model="code" type="text" class="input" placeholder="Codice Postale" required />

							<label class="label">Durata del cantiere</label>
							<input v-model="startDuration" type="text" class="input" placeholder="Data di Inizio"
								required />
							<input v-model="endDuration" type="text" class="input"
								placeholder="Data di Fine (non necessaria)" />

							<label class="label">Impresa Edile</label>
							<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa"
								required />
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 flex justify-end gap-2 sticky bottom-0">
						<div>
							<label for="my_modal_Cantieri" class="btn btn-neutral w-full" @click="createSites"
								:disabled="name || info || latitude || longitude || street || stNumber || city || code || startDuration || companyName">Crea</label>
						</div>
						<div>
							<label class="modal-backdrop btn btn-neutral text-white w-full"
								for="my_modal_Cantieri">Annulla</label>
						</div>
					</div>
				</div>
				<label class="modal-backdrop" for="my_modal_Cantieri">Close</label>
			</dialog>
		</div>

		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:lack]" aria-label="Segnalazioni"
			checked="checked" />
		<div class="tab-content bg-base-200 border-base-400 p-6">
			<div class="flex h-auto">
				<div class="w-[30vh] space-y-2 flex items-center">
					<div class="grid grid-cols-1 grid-rows-1 gap-10 w-xs">
						<button class="btn btn-neutral mt-4 w-full h-auto" @click="getSites" :disabled=false>Mostra
							tutte le
							Segnalazioni!</button>
						<pre v-if="data">{{ data }}</pre>
						<label for="my-drawer-Segnalazioni" class="btn btn-primary drawer-button w-full">Cerca una
							Segnalazione!</label>
						<label for="my_modal_Segnalazioni" class="btn btn-primary w-full">Crea una
							Segnalazione!</label>
					</div>
				</div>
				<div class="flex-1 p-6 overflow-y-auto min-h-full flex flex-col max-h-[80vh]">
					<h1 class="text-2xl font-bold mb-4">Ecco qua!</h1>
					<div class="space-y-4">
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 1</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
						<div class="card bg-base-300 shadow-md p-4">
							<h2 class="text-lg font-semibold">Risultato 2</h2>
							<p>Descrizione o dati associati al risultato.</p>
						</div>
					</div>
				</div>
			</div>


			<div class="drawer drawer-end h-full center-0">
				<input id="my-drawer-Segnalazioni" type="checkbox" class="drawer-toggle" />
				<div class="drawer-side">
					<label for="my-drawer-Segnalazioni" aria-label="close sidebar" class="drawer-overlay"></label>
					<div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
						<fieldset class="fieldset bg-base-200 border-base-200 w-xs h-full border p-4">
							<label class="label">Cerca la segnalazione per informazioni</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
							<input v-model="city" type="text" class="input" placeholder="Cittá" />
							<input v-model="code" type="text" class="input" placeholder="Codice Postale" />
							<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa" />
							<label class="label">Oppure inserisci la posizione e il raggio entro cui
								cercare.</label>
							<label class="label">Posizione per lat/long</label>
							<input v-model="latitude" type="text" class="input" placeholder="Latitudine" />
							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" />
							<label class="label">Posizione per via</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
							<label class="label">E inserisci il raggio</label>
							<input v-model="endDuration" type="text" class="input" placeholder="Raggio" />
							<label for="my-drawer-Segnalazioni" class="btn btn-neutral mt-4" @click="getReportsByInfo">Cerca!</label>
						</fieldset>
					</div>
				</div>
			</div>

			<input type="checkbox" id="my_modal_Segnalazioni" class="modal-toggle" />
			<dialog id="my_modal_id1" class="modal" role="dialog">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Titolo della Segnalazione</label>
							<input v-model="name" type="text" class="input" placeholder="Titolo Segnalazione"
								required />

							<label class="label">Informazioni sulla Segnalazione</label>
							<input v-model="info" type="text" class="input"
								placeholder="Informazioni della Segnalazione" required />

							<label class="label">Posizione della Segnalazione</label>
							<input v-model="latitude" type="text" class="input" placeholder="Latitudine" required />
							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" required />
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<input v-model="city" type="text" class="input" placeholder="Cittá" required />
							<input v-model="code" type="text" class="input" placeholder="Codice Postale" required />
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 flex justify-end gap-2 sticky bottom-0">
						<div>
							<label for="my_modal_Segnalazioni" class="btn btn-neutral w-full" @click="createReports"
								:disabled="name || info || latitude || longitude || street || stNumber || city || code">Crea</label>
						</div>
						<div>
							<label class="modal-backdrop btn btn-neutral text-white w-full"
								for="my_modal_Segnalazioni">Annulla</label>
						</div>
					</div>
				</div>
				<label class="modal-backdrop" for="my_modal_Segnalazioni">Close</label>
			</dialog>
		</div>
	</div>
</template>

<script setup>

</script>