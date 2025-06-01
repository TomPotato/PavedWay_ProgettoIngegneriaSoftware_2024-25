<template>
    <div class="bg-base-200 border-base-400 w-full p-6">
        <div class="flex w-full h-[66vh] flex-col">
            <div class="w-full space-y-2 bg-base-200 border-base-400 p-2">
                <div class="w-full grid grid-cols-7 gap-2">
                    <button class="btn btn-neutral w-auto" @click="getReportsByUserId">Mostra
                        le mie
                        Segnalazioni!</button>
                    <button class="btn btn-neutral w-auto" @click="getActiveReportsByUserId">Le mie Segnalazioni ancora
                        attive!</button>
                    <button @click="openDrawer('SegnalazioniCerca')" class="btn btn-square btn-primary drawer-button">
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" stroke="currentColor"
                            stroke-width="3" stroke-linecap="round" stroke-linejoin="round"
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
                        <h2 class="text-xl font-semibold">{{ report.name }}</h2>
                        <p>{{ report.info }}</p>
                        <i>Rating: {{ report?.rating || "0" }}</i>
                        <p v-if="report.status === 'solved'">Segnalazione Risolta!</p>
                        <div class="grid grid-cols-4 gap-5 w-auto">
                            <button @click="openModal('SegnalazioniInfo', report.id)"
                                class="btn btn-primary w-[10vh]">Info</button>
                            <button @click="deleteReport(report.id)" class="btn btn-primary w-full">Elimina la
                                Segnalazione!</button>
                            <button @click="modifyReport(report.id)" class="btn btn-neutral w-full"
                                :disabled="report.status === 'solved'">Modifica la Segnalazione</button>
                            <button @click="statusReport(report.id, 'solved')" class="btn btn-neutral w-full"
                                :disabled="report.status === 'solved'">Contrassegna come Risolta</button>
                        </div>
                    </div>
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

        <div class="drawer drawer-end h-full center-0">
            <input id="SegnalazioniCerca" type="checkbox" class="drawer-toggle" />
            <div class="drawer-side">
                <button @click="closeDrawer('SegnalazioniCerca'), resCerca" aria-label="close sidebar"
                    class="drawer-overlay"></button>
                <div class="menu p-4 w-auto min-h-full bg-base-200 flex items-center justify-center">
                    <fieldset class="fieldset bg-base-200 border-base-200 w-xs h-full border p-4">
                        <h2 class="text-xl font-semibold">Cerca le segnalazioni per posizione</h2>
                        <label class="label">Posizione per via</label>
                        <input v-model="street" type="text" class="input" placeholder="Via/Strada/Viale"
                            :disabled="longitude != '' || latitude != ''" />
                        <p v-if="!validateStreet && street != ''" class="text-error">
                            La via deve essere lunga tra 1 e 34 caratteri.
                        </p>

                        <input v-model="stNumber" type="text" class="input" placeholder="Numero Civico"
                            :disabled="longitude != '' || latitude != ''" />
                        <p v-if="!validateStNumber && stNumber != ''" class="text-error">
                            Il numero civico deve essere lungo tra 1 e 4 caratteri.
                        </p>

                        <input v-model="city" type="text" class="input" placeholder="Cittá"
                            :disabled="longitude != '' || latitude != ''" />
                        <p v-if="!validateCity && city != ''" class="text-error">
                            La città deve essere lunga tra 1 e 34 caratteri.
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
                            @click="getReportsByUserIdByLoc(meters)"
                            :disabled="((!latitude || !longitude || !radius) && (!street && !city && !stNumber)) ||
                                ((!street || !city || !stNumber || !radius) && (!latitude && !longitude)) || (!radius)">Cerca!</button>
                    </fieldset>
                </div>
            </div>
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
import reportService from '@/services/ReportService';
import validateService from '@/utils/Validator';
import nominatim from '@/services/Nominatim';

const errorMessage = ref(null);

const authStore = useAuthStore();

const reports = ref([]);

const rInfo = ref({});

const ready = ref(true);

const now = ref('tutti');
const meters = ref('metri');

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

const radius = ref('');
const validateRadius = computed(() => {
    const check = ref('');
    if (meters.value === 'metri' && radius.value <= 1000) { check.value = true } else if (meters.value === 'chilometri' && radius.value <= 5) { check.value = true } else { check.value = false };
    return radius.value > 0 && check.value;
});

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
)

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

const getReportsByUserId = async () => {
    try {
        const reportData = {
            'my': true,
            'offset': 0,
            'limit': 0
        };
        ready.value = false;
        reports.value = await reportService.getReportsByUserId(authStore.token, reportData);
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
};

const getActiveReportsByUserId = async () => {
    try {
        const reportData = {
            'my': true,
            'offset': 0,
            'limit': 0
        };
        ready.value = false;
        reports.value = await reportService.getActiveReportsByUserId(authStore.token, reportData);
        ready.value = true;
    } catch (error) {
        errorMessage.value = siteService.error;
    }
};

const getReportsByUserIdByLoc = async (mtrs) => {
    if (mtrs === 'chilometri') {
        radius.value = radius.value * 1000;
    }
    if (street.value != '' && city.value != '' && code.value != '') {
        const response = await nominatim.getPlace(street.value, city.value, code.value);
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
                sites.value = await reportService.getReportsByUserIdByLoc(reportData);
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
                reports.value = await reportService.getActiveReportsByUserIdByLoc(reportData);
            }
            resCerca();
            closeDrawer('SegnalazioniCerca');
            ready.value = true;
        }
    } catch (error) {
        errorMessage.value = reportService.error;
    }
};

const deleteReport = async (id) => {
    try {
        await reportService.deleteReport(authStore.token, id);
        ready.value = false;
        await getReportsByUserId();
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
};

const statusReport = async (id, status) => {
    try {
        await reportService.statusReport(authStore.token, id, status);
        ready.value = false;
        await getReportsByUserId();
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
};

</script>
