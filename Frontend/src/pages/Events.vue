<template>
	<div class="tabs tabs-lift tabs-s">
		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Cantieri" />
		<div class="tab-content bg-base-200 border-base-400 w-full p-6">
			<div class="flex">
				<div class="w-[30vh] space-y-2 flex items-center">
					<div class="grid grid-cols-1 grid-rows-1 gap-10 w-xs">
						<button class="btn btn-neutral mt-4 w-full" @click="getSites">Mostra tutti i
							Cantieri!</button>
						<label for="my-drawer-Cantieri" class="btn btn-primary drawer-button w-full">Cerca
							Cantieri!</label>
						<label v-if="isAdmin" for="my_modal_CantieriCrea" class="btn btn-primary w-full">Crea un
							cantiere!</label>
					</div>
				</div>
				<div class="flex-1 p-6 overflow-y-auto min-h-[65vh] flex flex-col max-h-[65vh]">
					<h1 class="text-2xl font-bold mb-4">Ecco qua!</h1>
					<div class="space-y-4">
						<div class="bg-base-300 border border-base-200 w-full p-6" v-for="site in sites" :key="site.id">
							<h2 class="text-xl font-semibold">{{ site.name }}</h2>
							<i>{{ site.info }}</i>
							<p>Posizione:</p>
							<p>Lat: {{ site.location.latitude }} - Lon: {{ site.location.longitude }}</p>
							<p>Indirizzo: {{ site.location.street }}, {{ site.location.stNumber }} in {{
								site.location.city }} ({{ site.location.code }})</p>
							<p>Durata: da {{ site.duration?.start || "non inserita" }} a {{ site.duration?.end || "'data da destinarsi'"}}</p>
							<p>Durata reale: da {{ site.realDuration?.start || " 'data da destinarsi' " }} a {{
								site.realDuration?.end || " 'data da destinarsi' " }}</p>
							<p>Impresa Edile: {{ site.companyName }}</p>
							<div class="grid grid-cols-2 gap-5 w-auto">
								<label @click="updateSite(site.id)" v-if="isAdmin" for="my_modal_CantieriModifica"
									class="btn btn-primary w-full">Modifica il
									cantiere!</label>
								<label @click="deleteSite(site.id)" v-if="isAdmin"
									class="btn btn-primary w-full">Elimina il
									cantiere!</label>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div class="drawer drawer-end h-full center-0">
				<input id="my-drawer-Cantieri" type="checkbox" class="drawer-toggle" />
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
							<label for="my-drawer-Cantieri" class="btn btn-neutral mt-4"
								@click="getSitesByInfo">Cerca!</label>
						</fieldset>
					</div>
				</div>
			</div>

			<input type="checkbox" id="my_modal_CantieriCrea" class="modal-toggle" />
			<dialog id="my_modal_CantieriCrea" class="modal" role="dialog">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Titolo del Cantiere</label>
							<input v-model="title" type="text" class="input" placeholder="Titolo Cantiere" required />

							<label class="label">Informazioni sul Cantiere</label>
							<input v-model="info" type="text" class="input" placeholder="Informazioni del cantiere"
								required />

							<label class="label">Posizione del Cantiere</label>
							<input v-model="longitude" type="text" class="input" placeholder="Latitudine" required />
							<input v-model="latitude" type="text" class="input" placeholder="Longitudine" required />
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<input v-model="city" type="text" class="input" placeholder="Cittá" required />
							<input v-model="code" type="text" class="input" placeholder="Codice Postale" required />

							<label class="label">Durata del cantiere</label>
							<input v-model="start" type="text" class="input" placeholder="Data di Inizio" required />
							<input v-model="end" type="text" class="input"
								placeholder="Data di Fine (non necessaria)" />

							<label class="label">Impresa Edile</label>
							<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa"
								required />
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 flex justify-end gap-2 sticky bottom-0">
						<div>
							<button for="my_modal_CantieriCrea" class="btn btn-neutral w-full" @click="createSites"
								:disabled="!title || !info || !latitude || !longitude || !street || !stNumber || !city || !code || !start || !companyName">Crea</button>
						</div>
						<div>
							<label class="modal-backdrop btn btn-neutral text-white w-full"
								for="my_modal_CantieriCrea">Annulla</label>
						</div>
					</div>
				</div>
				<label class="modal-backdrop" for="my_modal_CantieriCrea">Close</label>
			</dialog>

			<input type="checkbox" id="my_modal_CantieriModifica" class="modal-toggle" />
			<dialog id="my_modal_1" class="modal" role="dialog">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Titolo del Cantiere</label>
							<input v-model="msName" type="text" class="input" placeholder="Titolo Cantiere" required />

							<label class="label">Informazioni sul Cantiere</label>
							<input v-model="msInfo" type="text" class="input" placeholder="Informazioni del cantiere"
								required />

							<label class="label">Posizione del Cantiere</label>
							<input v-model="msLatitude" type="text" class="input" placeholder="Latitudine" required />
							<input v-model="msLongitude" type="text" class="input" placeholder="Longitudine" required />
							<input v-model="msStreet" type="text" class="input" placeholder="Via/Strada/Viale"
								required />
							<input v-model="msStNumber" type="text" class="input" placeholder="Numero Civico"
								required />
							<input v-model="msCity" type="text" class="input" placeholder="Cittá" required />
							<input v-model="msCode" type="text" class="input" placeholder="Codice Postale" required />

							<label class="label">Durata del cantiere</label>
							<input v-model="msStartDuration" type="text" class="input" placeholder="Data di Inizio"
								required />
							<input v-model="msEndDuration" type="text" class="input"
								placeholder="Data di Fine (non necessaria)" />

							<label class="label">Impresa Edile</label>
							<input v-model="msCompanyName" type="text" class="input" placeholder="Nome dell'Impresa"
								required />
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 flex justify-end gap-2 sticky bottom-0">
						<div>
							<button for="my_modal_CantieriModifica" class="btn btn-neutral w-full" @click="createSites"
								:disabled="!msName || !msInfo || !msLatitude || !msLongitude || !msStreet || !msStNumber || !msCity || !msCode || !msStartDuration || !msCompanyName">Modifica</button>
						</div>
						<div>
							<label class="modal-backdrop btn btn-neutral text-white w-full"
								for="my_modal_CantieriModifica">Annulla</label>
						</div>
					</div>
				</div>
				<label class="modal-backdrop" for="my_modal_CantieriModifica">Close</label>
			</dialog>
		</div>

		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:lack]" aria-label="Segnalazioni"
			checked="checked" />
		<div class="tab-content bg-base-200 border-base-400 p-6">
			<div class="flex h-auto">
				<div class="w-[30vh] space-y-2 flex items-center">
					<div class="grid grid-cols-1 grid-rows-1 gap-10 w-xs">
						<button class="btn btn-neutral mt-4 w-full h-auto" @click="getReports">Mostra
							tutte le
							Segnalazioni!</button>
						<label for="my-drawer-Segnalazioni" class="btn btn-primary drawer-button w-full">Cerca una
							Segnalazione!</label>
						<label v-if="isCitizen" for="my_modal_SegnalazioniCrea" class="btn btn-primary w-full">Crea
							una
							Segnalazione!</label>
					</div>
				</div>
				<div class="flex-1 p-6 overflow-y-auto min-h-[65vh] flex flex-col max-h-[65vh]">
					<h1 class="text-2xl font-bold mb-4">Ecco qua!</h1>
					<div class="space-y-4">
						<div class="bg-base-300 border border-base-200 w-full p-6" v-for="report in reports"
							:key="report.id">
							<h2 class="text-xl font-semibold">{{ report.name }}</h2>
							<i>{{ report.info }}</i>
							<p>Posizione: Lat: {{ report.location.latitude }}, Lon: {{ report.location.longitude }}</p>
							<p>Indirizzo: {{ report.location.street }}, {{ report.location?.stNumber || " 0 " }} in {{
								report.location.city }} ({{ report.location.code }})</p>
							<p>Durata: da {{ report.duration?.start || " 'non inserita' " }} a {{ report.duration?.end
								||
								" 'data da destinarsi' " }}</p>
							<i>Rating: {{ report?.rating || "0" }}</i>
							<p>Foto: {{ report.photos == [] || " 'Non ci sono foto per questa segnalazione' " }}</p>
							<p v-if="isAdmin">Status: {{ report.status }}</p>
							<div class="grid grid-cols-2 gap-5 w-auto">
								<label v-if="isCitizen" for="my_modal_SegnalazioniModifica"
									class="btn btn-primary w-full">Modifica la
									Segnalazione!</label>
								<label v-if="isCitizen" class="btn btn-primary w-full">Elimina la
									Segnalazione!</label>
								<label v-if="isAdmin" class="btn btn-primary w-full">Approva
									la
									Segnalazione!</label>
								<label v-if="isAdmin" class="btn btn-primary w-full">Rifiuta
									la
									Segnalazione!</label>
							</div>
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
							<label for="my-drawer-Segnalazioni" class="btn btn-neutral mt-4"
								@click="getReportsByInfo">Cerca!</label>
						</fieldset>
					</div>
				</div>
			</div>

			<input type="checkbox" id="my_modal_SegnalazioniCrea" class="modal-toggle" />
			<dialog id="my_modal_01" class="modal" role="dialog">
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
							<label for="my_modal_SegnalazioniCrea" class="btn btn-neutral w-full" @click="createReports"
								:disabled="!name || !info || !latitude || !longitude || !street || !stNumber || !city || !code">Crea</label>
						</div>
						<div>
							<label class="modal-backdrop btn btn-neutral text-white w-full"
								for="my_modal_SegnalazioniCrea">Annulla</label>
						</div>
					</div>
				</div>
				<label class="modal-backdrop" for="my_modal_SegnalazioniCrea">Close</label>
			</dialog>
			<input type="checkbox" id="my_modal_SegnalazioniModifica" class="modal-toggle" />
			<dialog id="my_modal_02" class="modal" role="dialog">
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
							<label for="my_modal_SegnalazioniModifica" class="btn btn-neutral w-full"
								@click="createReports"
								:disabled="!name || !info || !latitude || !longitude || !street || !stNumber || !city || !code">Crea</label>
						</div>
						<div>
							<label class="modal-backdrop btn btn-neutral text-white w-full"
								for="my_modal_SegnalazioniModifica">Annulla</label>
						</div>
					</div>
				</div>
				<label class="modal-backdrop" for="my_modal_SegnalazioniModifica">Close</label>
			</dialog>
		</div>
	</div>
	<div class="toast">
		<div v-if="errorMessage" role="alert" class="alert alert-error">
			<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 shrink-0 stroke-current" fill="none"
				viewBox="0 0 24 24">
				<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
					d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
			</svg>
			<span>{{ errorMessage }}</span>
		</div>
	</div>
	<RedirectMessage />
</template>

<script setup>

import { ref } from 'vue';
import { useRouter } from 'vue-router';
import RedirectMessage from '@/components/RedirectMessage.vue';
import { useAuthStore } from '@/stores/authStores';
import defaultSite from '@/services/SiteService';
import defaultReport from '@/services/ReportService';

const router = useRouter();

const errorMessage = ref(null);

const authStore = useAuthStore();

const sites = ref([]);
const reports = ref([]);

const title = ref('');
const info = ref('');
const latitude = ref('');
const longitude = ref('');
const street = ref('');
const stNumber = ref('');
const city = ref('');
const code = ref('');
const start = ref('');
const end = ref('');
const companyName = ref('');

const isAdmin = authStore.isAdmin;
const isCitizen = authStore.isCitizen;

const resetForm = () => {
	title = '';
	info = '';
	latitude = '';
	longitude = '';
	street = '';
	stNumber = '';
	city = '';
	code = '';
	start = '';
	end = '';
	companyName = '';
};

const getSites = async () => {
	try {
		sites.value = await defaultSite.getSites(0, 0);
	} catch (error) {
		errorMessage.value = error.message;
	}
};

const getReports = async () => {
	try {
		reports.value = await defaultReport.getReports(0, 0);
	} catch (error) {
		errorMessage.value = error.message;
	}
};

const createSites = async () => {
	try {
		const siteData = {
			"name": title,
			"info": info,
			"location": {
				"latitude": latitude,
				"longitude": longitude,
				"street": street,
				"stNumber": stNumber,
				"city": city,
				"code": code
			},
			"duration": {
				"start": start,
				"end": end
			},
			"conmpanyName": companyName
		};
		await defaultSite.createSite(authStore.token, siteData);
		resetForm();
	} catch (error) {
		errorMessage.value = error.message;
	}
};

const deleteSite = async (id) => {
	try {
		await defaultSite.deleteSite(authStore.token, id);
	} catch (error) {
		errorMessage.value = error.message;
	}
};

const updateSite = async (id) => {
	try {
		const siteData = {
			"name": title,
			"info": info,
			"location": {
				"latitude": latitude,
				"longitude": longitude,
				"street": street,
				"stNumber": stNumber,
				"city": city,
				"code": code
			},
			"duration": {
				"start": start,
				"end": end
			},
			"conmpanyName": companyName
		};
		await defaultSite.updateSite(authStore.token, id, siteData);
	} catch (error) {
		errorMessage.value = error.message;
	}
};

</script>