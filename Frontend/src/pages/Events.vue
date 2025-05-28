<template>
	<div class="tabs tabs-lift tabs-s">
		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Cantieri" />
		<div class="tab-content bg-base-200 border-base-400 w-full p-6">
			<div class="flex">
				<div class="w-[30vh] space-y-2 flex items-center">
					<div class="grid grid-cols-1 grid-rows-1 gap-10 w-xs">
						<button class="btn btn-neutral mt-4 w-full" @click="getSites">Mostra tutti i
							Cantieri!</button>
						<button class="btn btn-neutral mt-4 w-full" @click="getActiveSites">Mostra i
							Cantieri ancora attivi!</button>
						<button @click="openDrawer('CantieriCerca')" class="btn btn-primary drawer-button w-full">Cerca
							Cantieri!</button>
						<button v-if="isAdmin" @click="openModal('CantieriCrea')" class="btn btn-primary w-full">Crea un
							cantiere!</button>
					</div>
				</div>
				<div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
					<span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
				</div>
				<div v-else class="flex-1 p-6 overflow-y-auto min-h-[65vh] flex flex-col max-h-[65vh]">
					<div class="space-y-4">
						<div class="bg-base-300 border border-base-200 w-full p-6" v-for="site in sites" :key="site.id">
							<h2 class="text-xl font-semibold">{{ site.name }}</h2>
							<i>{{ site.info }}</i>
							<p>Posizione:</p>
							<p>Lat: {{ site.location.latitude }} - Lon: {{ site.location.longitude }}</p>
							<p>Indirizzo: {{ site.location.street }}, {{ site.location.stNumber }} in {{
								site.location.city }} ({{ site.location.code }})</p>
							<p>Durata: da {{ site.duration?.start || "non inserita" }} a {{ site.duration?.end ||
								"\'data da destinarsi\'" }}</p>
							<p>Durata reale: da {{ site.realDuration?.start || " 'data da destinarsi' " }} a {{
								site.realDuration?.end || " 'data da destinarsi' " }}</p>
							<p>Impresa Edile: {{ site.companyName }}</p>
							<div class="grid grid-cols-2 gap-5 w-auto">
								<button v-if="isAdmin" @click="openModal('CantieriModifica', site.id)"
									class="btn btn-primary w-full">Modifica il
									cantiere!</button>
								<button @click="deleteSite(site.id)" v-if="isAdmin"
									class="btn btn-primary w-full">Elimina il
									cantiere!</button>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div class="drawer drawer-end h-full center-0">
				<input id="CantieriCerca" type="checkbox" class="drawer-toggle" />
				<div class="drawer-side">
					<button @click="closeDrawer('CantieriCerca')" aria-label="close sidebar"
						class="drawer-overlay"></button>
					<div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
						<fieldset class="fieldset bg-base-200 border-base-200 w-xs h-full border p-4">
							<label class="label">Cerca il cantiere per posizione</label>
							<label class="label">Posizione per lat/long</label>
							<input v-model="latitude" type="text" class="input" placeholder="latitudine" />
							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" />
							<label class="label">Posizione per via</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
							<label class="label">E inserisci il raggio</label>
							<input v-model="end" type="text" class="input" placeholder="Raggio" />
							<button for="CantieriCerca" class="btn btn-neutral mt-4"
								@click="closeDrawer('CantieriCerca'), getSitesByInfo">Cerca!</button>
						</fieldset>
					</div>
				</div>
			</div>

			<dialog id="CantieriCrea" class="modal">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Titolo del Cantiere</label>
							<input v-model="title" type="text" class="input" placeholder="Titolo Cantiere" required />
							<p v-if="!validateTitle" class="text-error">
								Il titolo deve essere lungo tra 1 e 20 caratteri.
							</p>

							<label class="label">Informazioni sul Cantiere</label>
							<input v-model="info" type="text" class="input" placeholder="Informazioni del cantiere"
								required />
							<p v-if="!validateInfo" class="text-error">
								Le informazioni devono essere lunghe tra 1 e 200 caratteri.
							</p>

							<label class="label">Posizione del Cantiere</label>
							<input v-model="latitude" type="text" class="input" placeholder="Latitudine" required />
							<p v-if="!validateLatitude" class="text-error">
								La latitudine deve essere compresa tra -90 e 90.
							</p>

							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" required />
							<p v-if="!validateLongitude" class="text-error">
								La longitudine deve essere compresa tra -180 e 180.
							</p>

							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<p v-if="!validateStreet" class="text-error">
								La via deve essere lunga tra 1 e 15 caratteri.
							</p>

							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<p v-if="!validateStNumber" class="text-error">
								Il numero civico deve essere lungo tra 1 e 4 caratteri.
							</p>

							<input v-model="city" type="text" class="input" placeholder="Cittá" required />
							<p v-if="!validateCity" class="text-error">
								La città deve essere lunga tra 1 e 15 caratteri.
							</p>

							<input v-model="code" type="text" class="input" placeholder="Codice Postale" required />
							<p v-if="!validateCode" class="text-error">
								Il codice postale deve essere lungo 5 caratteri.
							</p>

							<label class="label">Durata del cantiere</label>
							<input v-model="start" type="text" class="input" placeholder="Data di Inizio" required />
							<p v-if="!validateStart" class="text-error">
								La data di inizio deve essere nel formato ISO 8601.
							</p>

							<input v-model="end" type="text" class="input"
								placeholder="Data di Fine (non necessaria)" />
							<p v-if="!validateEnd" class="text-error">
								La data di fine deve essere nel formato ISO 8601 e posteriore alla data di inizio.
							</p>

							<label class="label">Impresa Edile</label>
							<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa"
								required />
							<p v-if="!validateCompanyName" class="text-error">
								Il nome dell'impresa deve essere lungo tra 1 e 20 caratteri.
							</p>
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 justify-end sticky bottom-0">
						<div>
							<button class="btn btn-neutral w-full" @click="createSite"
								:disabled="!title || !info || !latitude || !longitude || !street || !stNumber || !city || !code || !start || !companyName">Crea</button>
						</div>
						<div>
							<button class="modal-backdrop btn btn-neutral text-white w-full"
								@click="closeModal('CantieriCrea')">Annulla</button>
						</div>
					</div>
				</div>
				<button class="modal-backdrop" @click="closeModal('CantieriCrea')">Close</button>
			</dialog>

			<dialog id="CantieriModifica" class="modal">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Informazioni sul Cantiere</label>
							<input v-model="info" type="text" class="input" placeholder="Informazioni del cantiere"
								required />
							<p v-if="!validateInfo" class="text-error">
								Le informazioni devono essere lunghe tra 1 e 200 caratteri.
							</p>

							<label class="label">Durata del cantiere</label>
							<input v-model="start" type="text" class="input" placeholder="Data di Inizio" required />
							<p v-if="!validateStart" class="text-error">
								La data di inizio deve essere nel formato ISO 8601.
							</p>

							<input v-model="end" type="text" class="input"
								placeholder="Data di Fine (non necessaria)" />
							<p v-if="!validateEnd" class="text-error">
								La data di fine deve essere nel formato ISO 8601.
							</p>

							<label class="label">Impresa Edile</label>
							<input v-model="companyName" type="text" class="input" placeholder="Nome dell'Impresa"
								required />
							<p v-if="!validateCompanyName" class="text-error">
								Il nome dell'impresa deve essere lungo tra 1 e 20 caratteri.
							</p>
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 justify-end sticky bottom-0">
						<div>
							<button class="btn btn-neutral w-full" @click="updateSite()"
								:disabled="!info || !start || !companyName">Modifica</button>
						</div>
						<div>
							<button @click="closeModal('CantieriModifica')"
								class="modal-backdrop btn btn-neutral text-white w-full">Annulla</button>
						</div>
					</div>
				</div>
				<button class="modal-backdrop" @click="closeModal('CantieriCrea')">Close</button>
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
						<button class="btn btn-neutral mt-4 w-full h-auto" @click="getActiveReports">Mostra le
							Segnalazioni ancora attive!</button>
						<button @click="openDrawer('SegnalazioniCerca')"
							class="btn btn-primary drawer-button w-full">Cerca una
							Segnalazione!</button>
						<button v-if="isCitizen" @click="openModal('SegnalazioniCrea')"
							class="btn btn-primary w-full">Crea
							una
							Segnalazione!</button>
					</div>
				</div>
				<div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
					<span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
				</div>

				<div class="flex-1 p-6 overflow-y-auto min-h-[65vh] flex flex-col max-h-[65vh]">
					<div class="space-y-4">
						<div class="bg-base-300 border border-base-200 w-full p-6" v-for="report in reports"
							:key="report.id">
							<h2 class="text-xl font-semibold">{{
								report.name }}</h2>
							<p>{{ report.info }}</p>
							<i>Rating: {{ report?.rating || "0" }}</i>
							<p v-if="isAdmin">Status: {{ report.status }}</p>
							<div class="grid grid-cols-5 gap-5 w-auto">
								<button @click="openModal('SegnalazioniInfo', report.id)"
									class="btn btn-primary w-[10vh]">Info</button>
								<button @click="deleteReport(report.id)" v-if="isAdmin"
									class="btn btn-primary w-full">Elimina la
									Segnalazione!</button>
								<button @click="statusReport(report.id, 'approved')" v-if="isAdmin"
									class="btn btn-success w-full">Approva
									la
									Segnalazione!</button>
								<button @click="statusReport(report.id, 'rejected')" v-if="isAdmin"
									class="btn btn-error w-full">Rifiuta
									la
									Segnalazione!</button>
								<button @click="statusReport(report.id, 'solved')" v-if="isAdmin"
									class="btn btn-neutral w-full">Contrassegna come
									Risolta!</button>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div class="drawer drawer-end h-full center-0">
				<input id="SegnalazioniCerca" type="checkbox" class="drawer-toggle" />
				<div class="drawer-side">
					<button @click="closeDrawer('SegnalazioniCerca')" aria-label="close sidebar"
						class="drawer-overlay"></button>
					<div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
						<fieldset class="fieldset bg-base-200 border-base-200 w-xs h-full border p-4">
							<label class="label">Cerca la segnalazione per posizione</label>
							<label class="label">Posizione per lat/long</label>
							<input v-model="latitude" type="text" class="input" placeholder="Latitudine" />
							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" />
							<label class="label">Posizione per via</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" />
							<label class="label">E inserisci il raggio</label>
							<input v-model="end" type="text" class="input" placeholder="Raggio" />
							<button for="SegnalazioniCerca" class="btn btn-neutral mt-4"
								@click="closeDrawer('SegnalazioniCerca'), getReportsByPos">Cerca!</button>
						</fieldset>
					</div>
				</div>
			</div>

			<dialog id="SegnalazioniInfo" class="modal" role="dialog">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<h2 class="text-xl font-semibold">{{ rInfo.name }}</h2>
						<p>{{ rInfo.info }}</p>
						<p>Posizione: Lat: {{ rInfo.location?.latitude }} - Lon: {{ rInfo.location?.longitude }}</p>
						<p>Indirizzo: {{ rInfo.location?.street }}, {{ rInfo.location?.number }} in {{
							rInfo.location?.city }} ({{ rInfo.location?.code }})</p>
						<p>Durata: da {{ rInfo.duration?.start || " 'non inserita' " }} a {{ rInfo.duration?.end
							|| " 'data da destinarsi' " }}</p>
						<i>Rating: {{ rInfo?.rating || "0" }}</i>
					</div>
				</div>
				<button class="modal-backdrop" @click="closeModal('SegnalazioniInfo')">Close</button>
			</dialog>

			<dialog id="SegnalazioniCrea" class="modal" role="dialog">
				<div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
					<div class="overflow-y-auto p-4 flex-1">
						<fieldset class="fieldset gap-2 w-xs">
							<label class="label">Titolo della Segnalazione</label>
							<input v-model="title" type="text" class="input" placeholder="Titolo Segnalazione"
								required />
							<p v-if="!validateTitle" class="text-error">
								Il titolo deve essere lungo tra 1 e 20 caratteri.
							</p>

							<label class="label">Informazioni sulla Segnalazione</label>
							<input v-model="info" type="text" class="input"
								placeholder="Informazioni della Segnalazione" required />
							<p v-if="!validateInfo" class="text-error">
								Le informazioni devono essere lunghe tra 1 e 200 caratteri.
							</p>

							<label class="label">Posizione della Segnalazione</label>
							<input v-model="latitude" type="text" class="input" placeholder="Latitudine" required />
							<p v-if="!validateLatitude" class="text-error">
								La latitudine deve essere compresa tra -90 e 90.
							</p>

							<input v-model="longitude" type="text" class="input" placeholder="Longitudine" required />
							<p v-if="!validateLongitude" class="text-error">
								La longitudine deve essere compresa tra -180 e 180.
							</p>

							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<p v-if="!validateStreet" class="text-error">
								La via deve essere lunga tra 1 e 15 caratteri.
							</p>

							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<p v-if="!validateStNumber" class="text-error">
								Il numero civico deve essere lungo tra 1 e 4 caratteri.
							</p>

							<input v-model="city" type="text" class="input" placeholder="Cittá" required />
							<p v-if="!validateCity" class="text-error">
								La città deve essere lunga tra 1 e 15 caratteri.
							</p>

							<input v-model="code" type="text" class="input" placeholder="Codice Postale" required />
							<p v-if="!validateCode" class="text-error">
								Il codice postale deve essere lungo 5 caratteri.
							</p>
						</fieldset>
					</div>
					<div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 justify-end sticky bottom-0">
						<div>
							<button class="btn btn-neutral w-full" @click="createReport"
								:disabled="!title || !info || !latitude || !longitude || !street || !stNumber || !city || !code">Crea</button>
						</div>
						<div>
							<button @click="closeModal('SegnalazioniCrea')"
								class="modal-backdrop btn btn-neutral text-white w-full">Annulla</button>
						</div>
					</div>
				</div>
				<button class="modal-backdrop" @click="">Close</button>
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

import { ref, computed } from 'vue';
import RedirectMessage from '@/components/RedirectMessage.vue';
import { useAuthStore } from '@/stores/authStores';
import siteService from '@/services/SiteService';
import reportService from '@/services/ReportService';
import validateService from '@/utils/Validator';

const errorMessage = ref(null);

const authStore = useAuthStore();

const sites = ref([]);
const reports = ref([]);

const rInfo = ref({});

const ready = ref(true);

const title = ref('');
const validateTitle = computed(() => {
	return title.value.length > 0 && title.value.length <= 20;
});

const info = ref('');
const validateInfo = computed(() => {
	return info.value.length > 0 && info.value.length <= 200;
});

const latitude = ref('');
const validateLatitude = computed(() => {
	return latitude.value >= -90 && latitude.value <= 90;
});

const longitude = ref('');
const validateLongitude = computed(() => {
	return longitude.value >= -180 && longitude.value <= 180;
});

const street = ref('');
const validateStreet = computed(() => {
	return street.value.length > 0 && street.value.length <= 15;
});

const stNumber = ref('');
const validateStNumber = computed(() => {
	return stNumber.value.length > 0 && stNumber.value.length <= 4;
});

const city = ref('');
const validateCity = computed(() => {
	return city.value.length > 0 && city.value.length <= 15;
});

const code = ref('');
const validateCode = computed(() => {
	return code.value.length >= 5 && code.value.length <= 5;
});

const start = ref('');
const validateStart = computed(() => {
	return validateService.validateDate(start.value);
});

const end = ref('');
const validateEnd = computed(() => {
	return (validateService.validateDate(end.value) && end.value > start.value) || end.value == '';
});

const companyName = ref('');
const validateCompanyName = computed(() => {
	return companyName.value.length > 0 && companyName.value.length <= 20;
});

const radius = ref('');
const validateRadius = computed(() =>{
	return radius.value > 0 && radius.value < 5000;
});

const isAdmin = authStore.isAdmin;
const isCitizen = authStore.isCitizen;

const passEvent = ref('');

const openModal = (id, eventId = '') => {
	passEvent.value = eventId;
	if (id === 'CantieriModifica') {
		const site = sites.value.find(s => s.id === eventId);
		info.value = site.info;
		start.value = site.duration.start;
		end.value = site.duration.end || '';
		companyName.value = site.companyName;
	} else if (id === 'SegnalazioniCrea') {
		const date = Date.now();
		start.value = new Date(date).toISOString().split('T')[0];
	} else if (id === 'SegnalazioniInfo') {
		rInfo.value = reports.value.find(r => r.id === eventId);
	}
	document.getElementById(id).showModal();
};

const closeModal = (id) => {
	document.getElementById(id).close();
};

const openDrawer = (id) => {
	document.getElementById(id).checked = true;
};

const closeDrawer = (id) => {
	document.getElementById(id).checked = false;
};

const valCreaSite = computed(() => {
	return (title.value &&
		info.value &&
		latitude.value &&
		longitude.value &&
		street.value &&
		stNumber.value &&
		city.value &&
		code.value &&
		start.value &&
		(end.value || null) &&
		companyName.value &&
		validateTitle &&
		validateInfo &&
		validateLatitude &&
		validateLongitude &&
		validateStreet &&
		validateStNumber &&
		validateCity &&
		validateCode &&
		validateStart &&
		validateEnd &&
		validateCompanyName
	);
});

const valCreaReport = computed(() => {
	return (title.value &&
		info.value &&
		latitude.value &&
		longitude.value &&
		street.value &&
		stNumber.value &&
		city.value &&
		code.value &&
		start.value &&
		validateTitle &&
		validateInfo &&
		validateLatitude &&
		validateLongitude &&
		validateStreet &&
		validateStNumber &&
		validateCity &&
		validateCode &&
		validateStart
	);
});

const valMod = computed(() => {
	return (info.value &&
		start.value &&
		(end.value || null) &&
		companyName.value &&
		validateInfo &&
		validateStart &&
		validateEnd &&
		validateCompanyName
	);
});

const valCerca = computed(() => {
	return (
		(longitude.value && latitude.value && radius.value && validateLatitude && validateLongitude && validateRadius) 
		|| 
		(street.value && stNumber.value && radius.value && validateStreet && validateStNumber && validateRadius) 
	);
}
);

const resCreaSites = () => {
	title.value = '';
	info.value = '';
	latitude.value = '';
	longitude.value = '';
	street.value = '';
	stNumber.value = '';
	city.value = '';
	code.value = '';
	start.value = '';
	end.value = '';
	companyName.value = '';
};

const resCreaReports = () => {
	title.value = '';
	info.value = '';
	latitude.value = '';
	longitude.value = '';
	street.value = '';
	stNumber.value = '';
	city.value = '';
	code.value = '';
	start.value = '';
};

const resMod = () => {
	info.value = '';
	start.value = '';
	end.value = '';
	companyName.value = '';
};

const resCerca = () => {
	latitude.value = '';
	longitude.value = '';
	street.value = '';
	stNumber.value = '';
	city.value = '';
	radius.value = '';
};

const getSites = async () => {
	try {
		ready.value = false;
		sites.value = await siteService.getSites(0, 0);
		ready.value = true;
	} catch (error) {
		errorMessage.value = siteService.error;
	}
};

const getActiveSites = async () => {
	try {
		ready.value = false;
		sites.value = await siteService.getActiveSites(0, 0);
		ready.value = true;
	} catch (error) {
		errorMessage.value = siteService.error;
	}
};

const getReports = async () => {
	try {
		ready.value = false;
		reports.value = await reportService.getReports(0, 0);
		ready.value = true;
	} catch (error) {
		errorMessage.value = reportService.error;
	}
};

const getActiveReports = async () => {
	try {
		ready.value = false;
		reports.value = await reportService.getActiveReports(0, 0);
		ready.value = true;
	} catch (error) {
		errorMessage.value = siteService.error;
	}
};

const createSite = async () => {
	try {
		if (!valCreaSite.value) {
			errorMessage.value = "Compila tutti i campi correttamente!";
		} else {
			const siteData = {
				'name': title.value,
				'info': info.value,
				'location': {
					'latitude': latitude.value,
					'longitude': longitude.value,
					'street': street.value,
					'number': stNumber.value,
					'city': city.value,
					'code': code.value
				},
				'duration': {
					'start': start.value,
					'end': end.value
				},
				'companyName': companyName.value
			};
			await siteService.createSite(authStore.token, siteData);
			resCreaSites();
			ready.value = false;
			await getSites();
			ready.value = true;
			closeModal('CantieriCrea');
		}
	} catch (error) {
		errorMessage.value = error.value;
	}
};

const deleteSite = async (id) => {
	try {
		await siteService.deleteSite(authStore.token, id);
		await getSites();
	} catch (error) {
		errorMessage.value = siteService.error;
	}
};

const updateSite = async () => {
	try {
		const id = passEvent.value;
		console.log('Updating site with id:', id);
		if (!valMod.value) {
			errorMessage.value = "Compila tutti i campi correttamente!";
		} else {
			const siteData = {
				'info': info.value,
				'duration': {
					'start': start.value,
					'end': end.value
				},
				'companyName': companyName.value
			};
			await siteService.updateSite(authStore.token, id, siteData);
			resMod();
			ready.value = false;
			await getSites();
			ready.value = true;
			closeModal('CantieriModifica');
		}
	} catch (error) {
		errorMessage.value = error.value;
	}
};

const createReport = async () => {
	try {
		if (!valCreaReport.value) {
			errorMessage.value = "Compila tutti i campi correttamente!";
		} else {
			const reportData = {
				'name': title.value,
				'info': info.value,
				'location': {
					'latitude': latitude.value,
					'longitude': longitude.value,
					'street': street.value,
					'number': stNumber.value,
					'city': city.value,
					'code': code.value
				},
				'duration': {
					'start': start.value
				}
			};
			console.log('Creating report with data:', reportData);
			await reportService.createReport(authStore.token, reportData);
			resCreaReports();
			ready.value = false;
			await getReports();
			ready.value = true;
			closeModal('SegnalazioniCrea');
		}
	} catch (error) {
		errorMessage.value = reportService.error;
	}

};

const deleteReport = async (id) => {
	try {
		await reportService.deleteReport(authStore.token, id);
		ready.value = false;
		await getReports();
		ready.value = true;
	} catch (error) {
		errorMessage.value = reportService.error;
	}
};

const statusReport = async (id, status) => {
	try {
		await reportService.statusReport(authStore.token, id, status);
		ready.value = false;
		await getReports();
		ready.value = true;
	} catch (error) {
		errorMessage.value = reportService.error;
	}
};

</script>