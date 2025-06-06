<template>
	<div class="tabs tabs-lift tabs-s">
		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Cantieri"
			checked="checked" />
		<div class="tab-content bg-base-200 border-base-400 w-full p-6">
			<div class="flex w-full h-[66vh] flex-col">
				<div class="w-full space-y-2 bg-base-200 border-base-400 p-2">
					<div class="w-full grid grid-cols-7 gap-2">
						<button class="btn btn-neutral w-auto" @click="getSites">Mostra tutti i
							Cantieri!</button>
						<button class="btn btn-neutral w-auto" @click="getActiveSites">Cantieri ancora attivi!</button>
						<button v-if="isAdmin" @click="openModal('CantieriCrea')" class="btn btn-primary w-auto">Crea un
							Cantiere!</button>
						<button @click="openDrawer('CantieriCerca')" class="btn btn-square btn-primary drawer-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
								stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
								class="feather feather-search" viewBox="0 0 24 24">
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							</svg>
						</button>
					</div>
				</div>
				<div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
					<span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
				</div>
				<div v-else class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col">
					<div class="space-y-4">
						<div class="bg-base-300 border border-base-200 w-full p-6" v-for="site in sites" :key="site.id">
							<h2 class="text-xl font-semibold">{{ site.name }}</h2>
							<i>{{ site.info }}</i>
							<p>Posizione:</p>
							<p>Lat: {{ site.location.latitude }} - Lon: {{ site.location.longitude }}</p>
							<p>Indirizzo: {{ site.location.street }} {{ site.location.number }}, in {{
								site.location.city }} ({{ site.location.code }})</p>
							<p>Durata: da {{ site.duration?.start || "non inserita" }} a {{ site.duration?.end ||
								"/'data da destinarsi'/" }}</p>
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
							<h2 class="text-xl font-semibold">Cerca i cantieri per posizione</h2>
							<label class="label">Posizione per via</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<p v-if="!validateStreet && street != ''" class="text-error">
								La via deve essere lunga tra 1 e 34 caratteri.
							</p>

							<input v-model="city" type="text" class="input" placeholder="Città" />
							<p v-if="!validateCity && city != ''" class="text-error">
								La città deve essere lunga tra 1 e 34 caratteri.
							</p>

							<input v-model="code" type="text" class="input" placeholder="Codice Postale" />
							<p v-if="!validateCode && code != ''" class="text-error">
								Il codice postale deve essere lungo 5 caratteri.
							</p>

							<label class="label w-full flex">E inserisci il raggio in {{ meters }}
								<input @click="metersChange" type="checkbox"
									class="toggle border-blue-600 bg-blue-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800 absolute right-7" />
							</label>
							<input v-model="radius" v-if="meters === 'metri'" type="text" class="input"
								placeholder="Raggio in metri" />
							<p v-if="!validateRadius && meters === 'metri'" class="text-error">
								Puoi cercare solamente entro UN chilometro.
							</p>
							<input v-model="radius" v-if="meters === 'chilometri'" type="text" class="input"
								placeholder="Raggio in chilometri" />
							<p v-if="!validateRadius && meters === 'chilometri'" class="text-error">
								Puoi cercare solamente entro CINQUE chilometri.
							</p>
							<label class="label w-full flex">E vuoi visualizzare cosa:</label>
							<label class="label w-full flex">
								<p v-if="now === 'tutti'">Tutti i cantieri?</p>
								<p v-else>I cantieri ancora attivi?</p>
								<input @click="nowChange" type="checkbox"
									class="toggle border-blue-600 bg-blue-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800 absolute right-7" />
							</label>
							<button for="CantieriCerca" class="btn btn-neutral mt-4" @click="getSitesByLoc(meters)"
								:disabled="(!street || !city || !code || !radius) || (!radius)">Cerca!</button>
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
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<p v-if="!validateStreet" class="text-error">
								La via deve essere lunga tra 1 e 34 caratteri.
							</p>

							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<p v-if="!validateStNumber" class="text-error">
								Il numero civico deve essere lungo tra 1 e 4 caratteri.
							</p>

							<input v-model="city" type="text" class="input" placeholder="Città" required />
							<p v-if="!validateCity" class="text-error">
								La città deve essere lunga tra 1 e 34 caratteri.
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
								:disabled="!title || !info || !street || !stNumber || !city || !code || !start || !companyName">Crea</button>
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
				<button class="modal-backdrop" @click="closeModal('CantieriModifica')">Close</button>
			</dialog>
		</div>

		<input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:black]"
			aria-label="Segnalazioni" />
		<div class="tab-content bg-base-200 border-base-400 w-full p-6">
			<div class="flex w-full h-[66vh] flex-col">
				<div class="w-full space-y-2 bg-base-200 border-base-400 p-2">
					<div class="w-full grid grid-cols-7 gap-2">
						<button class="btn btn-neutral w-auto" @click="getReports">Mostra
							tutte le
							Segnalazioni!</button>
						<button class="btn btn-neutral w-auto" @click="getActiveReports">Segnalazioni ancora
							attive!</button>
						<button v-if="isCitizen" @click="openModal('SegnalazioniCrea')"
							class="btn btn-primary w-full">Crea
							una
							Segnalazione!</button>
						<button @click="openDrawer('SegnalazioniCerca')"
							class="btn btn-square btn-primary drawer-button">
							<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none"
								stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
								class="feather feather-search" viewBox="0 0 24 24">
								<circle cx="11" cy="11" r="8"></circle>
								<line x1="21" y1="21" x2="16.65" y2="16.65"></line>
							</svg>
						</button>
					</div>
				</div>
				<div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
					<span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
				</div>
				<div v-else class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col">
					<div class="space-y-4">
						<div class="bg-base-300 border border-base-200 w-full p-6" v-for="report in reports"
							:key="report.id">
							<h2 class="text-xl font-semibold">{{
								report.name }}</h2>
							<p>{{ report.info }}</p>
							<i>Rating: {{ report?.rating || "0" }}</i>
							<p v-if="isAdmin">Status: {{ report.status }}</p>
							<p v-if="!isAdmin && report.status === 'solved'">Segnalazione Risolta!</p>
							<div class="grid grid-cols-5 gap-5 w-auto">
								<button class="btn btn-primary w-[10vh]"
									@click="goToReportInfo(report.id)">Info</button>
								<button @click="deleteReport(report.id)" v-if="isAdmin"
									class="btn btn-primary w-full">Elimina la
									Segnalazione!</button>
								<button @click="statusReport(report.id, 'approved')" v-if="isAdmin"
									class="btn btn-success w-full" :disabled="report.status === 'solved'">Approva la
									Segnalazione!</button>
								<button @click="statusReport(report.id, 'rejected')" v-if="isAdmin"
									class="btn btn-error w-full" :disabled="report.status === 'solved'">Rifiuta la
									Segnalazione!</button>
								<button @click="statusReport(report.id, 'solved')" v-if="isAdmin"
									class="btn btn-neutral w-full" :disabled="report.status === 'solved'">Contrassegna
									come Risolta!</button>
							</div>
						</div>
					</div>
				</div>
			</div>


			<div class="drawer drawer-end h-full center-0">
				<input id="SegnalazioniCerca" type="checkbox" class="drawer-toggle" />
				<div class="drawer-side">
					<button @click="closeDrawer('SegnalazioniCerca'), resCerca" aria-label="close sidebar"
						class="drawer-overlay"></button>
					<div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
						<fieldset class="fieldset bg-base-200 border-base-200 w-xs h-full border p-4">
							<h2 class="text-xl font-semibold">Cerca le segnalazioni per posizione</h2>
							<label class="label">Posizione per via</label>
							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" />
							<p v-if="!validateStreet && street != ''" class="text-error">
								La via deve essere lunga tra 1 e 34 caratteri.
							</p>

							<input v-model="city" type="text" class="input" placeholder="Città" />
							<p v-if="!validateCity && city != ''" class="text-error">
								La città deve essere lunga tra 1 e 34 caratteri.
							</p>

							<input v-model="code" type="text" class="input" placeholder="Codice Postale" />
							<p v-if="!validateCode && code != ''" class="text-error">
								Il codice postale deve essere lungo 5 caratteri.
							</p>

							<label class="label w-full flex">E inserisci il raggio in {{ meters }}
								<input @click="metersChange" type="checkbox" checked="checked"
									class="toggle border-blue-600 bg-blue-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800 absolute right-10" />
							</label>
							<input v-model="radius" v-if="meters === 'metri'" type="text" class="input"
								placeholder="Raggio in metri" />
							<p v-if="!validateRadius && meters === 'metri'" class="text-error">
								Puoi cercare solamente entro UN chilometro.
							</p>
							<input v-model="radius" v-if="meters === 'chilometri'" type="text" class="input"
								placeholder="Raggio in chilometri" />
							<p v-if="!validateRadius && meters === 'chilometri'" class="text-error">
								Puoi cercare solamente entro CINQUE chilometri.
							</p>
							<label class="label w-full flex">E vuoi visualizzare cosa:</label>
							<label class="label w-full flex">
								<p v-if="now === 'tutti'">Tutte le Segnalazioni?</p>
								<p v-else>Le Segnalazioni ancora attive?</p>
								<input @click="nowChange" type="checkbox" checked="checked"
									class="toggle border-blue-600 bg-blue-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800 absolute right-7" />
							</label>
							<button for="SegnalazioniCerca" class="btn btn-neutral mt-4"
								@click="getReportsByLoc(meters)"
								:disabled="(!street || !city || !code || !radius) || (!radius)">Cerca!</button>
						</fieldset>
					</div>
				</div>
			</div>

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

							<input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale" required />
							<p v-if="!validateStreet" class="text-error">
								La via deve essere lunga tra 1 e 34 caratteri.
							</p>

							<input v-model="stNumber" type="text" class="input" placeholder="Numero Civico" required />
							<p v-if="!validateStNumber" class="text-error">
								Il numero civico deve essere lungo tra 1 e 4 caratteri.
							</p>

							<input v-model="city" type="text" class="input" placeholder="Città" required />
							<p v-if="!validateCity" class="text-error">
								La città deve essere lunga tra 1 e 34 caratteri.
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
								:disabled="!title || !info || !street || !stNumber || !city || !code">Crea</button>
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
import { useRouter } from 'vue-router';
import RedirectMessage from '@/components/RedirectMessage.vue';
import { useAuthStore } from '@/stores/authStores';
import siteService from '@/services/SiteService';
import reportService from '@/services/ReportService';
import validateService from '@/utils/Validator';
import pathService from '@/services/PathService';
import { onMounted } from 'vue';

const router = useRouter();

const errorMessage = ref(null);

const authStore = useAuthStore();

const sites = ref([]);
const reports = ref([]);

const rInfo = ref({});

const ready = ref(true);

const now = ref('tutti');
const meters = ref('metri');

const title = ref('');
const validateTitle = computed(() => {
	return title.value.length > 0 && title.value.length <= 20;
});

const info = ref('');
const validateInfo = computed(() => {
	return info.value.length > 0 && info.value.length <= 200;
});

const latitude = ref('');
const longitude = ref('');

const street = ref('');
const validateStreet = computed(() => {
	return street.value.length > 0 && street.value.length <= 34;
});

const stNumber = ref('');
const validateStNumber = computed(() => {
	return stNumber.value.length > 0 && stNumber.value.length <= 4;
});

const city = ref('');
const validateCity = computed(() => {
	return city.value.length > 0 && city.value.length <= 34;
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
	if (end.value != '') {
		return (validateService.validateDate(end.value) && end.value > start.value);
	} else {
		return (end.value == '');
	}
});

const companyName = ref('');
const validateCompanyName = computed(() => {
	return companyName.value.length > 0 && companyName.value.length <= 20;
});

const radius = ref('');
const validateRadius = computed(() => {
	const check = ref('');
	if (meters.value === 'metri' && radius.value <= 1000) { check.value = true } else if (meters.value === 'chilometri' && radius.value <= 5) { check.value = true } else { check.value = false };
	return radius.value > 0 && check.value;
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

const metersChange = () => {
	if (meters.value === 'metri') {
		meters.value = 'chilometri';
	} else {
		meters.value = 'metri';
	}
}

const nowChange = () => {
	if (now.value === 'tutti') {
		now.value = 'attivi';
	} else {
		now.value = 'tutti';
	}
}

const valCreaSite = computed(() => {
	return (title.value &&
		info.value &&
		street.value &&
		stNumber.value &&
		city.value &&
		code.value &&
		start.value &&
		(end.value || end.value == '') &&
		companyName.value &&
		validateTitle &&
		validateInfo &&
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
		street.value &&
		stNumber.value &&
		city.value &&
		code.value &&
		start.value &&
		validateTitle &&
		validateInfo &&
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
		(street.value && stNumber.value && city.value && radius.value && validateStreet && validateStNumber && validateCity && validateRadius)
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
	code.value = '';
	city.value = '';
	radius.value = '';
	meters.value = 'metri';
	now.value = 'tutti';
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

const getSitesByLoc = async (mtrs) => {
	if (mtrs === 'chilometri') {
		radius.value = radius.value * 1000;
	}
	if (street.value != '' && city.value != '' && code.value != '') {
		const response = await pathService.getPlace(street.value, city.value, code.value);
		latitude.value = response.lat;
		longitude.value = response.lon;
	}
	try {
		if (!valCerca) { errorMessage.value = 'Non hai inserito correttamente i campi della ricerca!'; } else {
			if (now.value === 'tutti') {
				const siteData = {
					'latitude': latitude.value,
					'longitude': longitude.value,
					'radius': radius.value,
					'offset': 0,
					'limit': 0
				}
				ready.value = false;
				sites.value = await siteService.getSitesByLoc(siteData);
			} else {
				const siteData = {
					'latitude': latitude.value,
					'longitude': longitude.value,
					'radius': radius.value,
					'now': true,
					'offset': 0,
					'limit': 0
				}
				ready.value = false;
				sites.value = await siteService.getActiveSitesByLoc(siteData);
			}
			resCerca();
			closeDrawer('CantieriCerca');
			ready.value = true;
		}
	} catch (error) {
		errorMessage.value = siteService.error;
	}
};

const createSite = async () => {
	try {
		if (!valCreaSite.value) {
			errorMessage.value = "Compila tutti i campi correttamente!";
		} else {
			const response = await pathService.getPlace(street.value, city.value, code.value, stNumber.value);
			latitude.value = response.lat;
			longitude.value = response.lon;
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

const getReportsByLoc = async (mtrs) => {
	if (mtrs === 'chilometri') {
		radius.value = radius.value * 1000;
	}
	if (street.value != '' && city.value != '' && code.value != '') {
		const response = await pathService.getPlace(street.value, city.value, code.value);
		latitude.value = response.lat;
		longitude.value = response.lon;
	}
	try {
		if (!valCerca) { errorMessage.value = 'Non hai inserito correttamente i campi della ricerca!'; } else {
			if (now.value === 'tutti') {
				const reportData = {
					'latitude': latitude.value,
					'longitude': longitude.value,
					'radius': radius.value,
					'offset': 0,
					'limit': 0
				}
				ready.value = false;
				sites.value = await reportService.getReportsByLoc(reportData);
			} else {
				const reportData = {
					'latitude': latitude.value,
					'longitude': longitude.value,
					'radius': radius.value,
					'now': true,
					'offset': 0,
					'limit': 0
				}
				ready.value = false;
				reports.value = await reportService.getActiveReportsByLoc(reportData);
			}
			resCerca();
			closeDrawer('SegnalazioniCerca');
			ready.value = true;
		}
	} catch (error) {
		errorMessage.value = reportService.error;
	}
};

const createReport = async () => {
	try {
		if (!valCreaReport.value) {
			errorMessage.value = "Compila tutti i campi correttamente!";
		} else {
			const response = await pathService.getPlace(street.value, city.value, code.value, stNumber.value);
			latitude.value = response.lat;
			longitude.value = response.lon;
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

const goToReportInfo = (id) => {
	router.push({ path: `/reports/${id}` });
};

onMounted(() => {
	if (authStore.isCitizen) {
		getReports();
	} else if (authStore.isAdmin) {
		getSites();
	}
});

</script>