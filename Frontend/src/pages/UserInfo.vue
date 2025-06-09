<template>
    <div class="tabs tabs-lift tabs-s">
        <input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Info"
            checked="checked" />
        <div class="tab-content bg-base-200 border-base-400 w-full min-h-[70vh] p-6">
            <div class="card lg:card-side bg-base-300 shadow-sm">
                <div class="card-body">
                    <h2 class="text-xl font-semibold">Informazioni</h2>
                    <p>Questa pagina ti permette di visualizzare le tue segnalazioni e modificarle se necessario.</p>
                    <p>Puoi anche cercare segnalazioni in base alla posizione inserendo via, città e codice postale.</p>
                    <p>Per ogni segnalazione puoi visualizzare le informazioni, modificarle o eliminarle.</p>
                    <br />
                    <h1 class="text-xl font-semibold">Username: {{ user.username }}</h1>
                    <p>Nome: {{ user.name }}, Cognome: {{ user.surname }}</p>
                    <p v-if="user.role === 'citizen'">Email inserita: <i>{{ user.email }}</i></p>
                    <p v-if="user.role === 'admin'">Ufficio di competenza: <i>{{ user.office }}</i></p>
                </div>
            </div>
        </div>
        <input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Segnalazioni"
            @click="getReportsByUserId" v-if="user.role === 'citizen'" />
        <div class="tab-content bg-base-200 border-base-400 w-full p-6">
            <div class="bg-base-200 border-base-400 w-full">
                <div class="flex w-full h-[66vh] flex-col">
                    <div class="w-full space-y-2 bg-base-200 border-base-400 p-2 flex gap-2">
                        <button @click="getReportsByUserId" class="btn btn-square btn-primary drawer-button p-1">
                            <img src="/refresh.svg" />
                        </button>
                        <button @click="openDrawer('SegnalazioniCerca')"
                            class="btn btn-square btn-primary drawer-button p-1">
                            <img src="/search.svg" />
                        </button>
                        <button class="btn btn-neutral w-auto" @click="getActiveReportsByUserId">Le mie
                            Segnalazioni
                            ancora
                            attive!</button>
                    </div>

                    <div v-if="!ready" class="flex items-center justify-center w-full min-h-[64vh]">
                        <span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
                    </div>

                    <div v-else class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col">
                        <div class="space-y-4 grid grid-cols-2 gap-2">
                            <div class="bg-base-300 border border-base-200 w-full p-6" v-for="report in reports"
                                :key="report.id">
                                <h2 class="text-xl font-semibold">{{ report.name }}</h2>
                                <p>{{ report.info }}</p>
                                <i>Rating: {{ report?.rating || "0" }}</i>
                                <p v-if="report.status === 'solved'">Segnalazione Risolta!</p>
                                <div class="grid grid-cols-4 gap-5 w-auto">
                                    <button class="btn btn-primary w-[10vh]"
                                        @click="goToReportInfo(report.id)">Info</button>
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
                                        class="toggle border-blue-600 bg-blue-500 checked:border-orange-500 checked:bg-orange-400 checked:text-orange-800 absolute right-10" />
                                </label>
                                <button for="SegnalazioniCerca" class="btn btn-neutral mt-4"
                                    @click="getReportsByUserIdByLoc(meters)"
                                    :disabled="(!street || !city || !code || !radius) || (!radius)">Cerca!</button>
                            </fieldset>
                        </div>
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
    </div>
    <RedirectMessage />
</template>

<script setup>

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import RedirectMessage from '@/components/RedirectMessage.vue';
import reportService from '@/services/ReportService';
import userService from '@/services/UserService';
import pathService from '@/services/PathService';
import { onMounted } from 'vue';
import { useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const errorMessage = ref(null);
const user = ref('');
const ready = ref(false);
const meters = ref('metri');
const reports = ref([]);
const now = ref('tutti');
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

const valCerca = computed(() => {
    return (
        (street.value && stNumber.value && city.value && radius.value && code.value &&
            validateStreet && validateStNumber && validateCity && validateRadius && validateCode)
    );
}
);

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

async function getReportsByUserId() {
    try {
        const reportData = {
            'offset': 0,
            'limit': 0
        };
        ready.value = false;
        reports.value = await reportService.getReportsByUserId(reportData, user.value.id);
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

async function getActiveReportsByUserId() {
    try {
        const reportData = {
            'now': true,
            'offset': 0,
            'limit': 0
        };
        ready.value = false;
        reports.value = await reportService.getActiveReportsByUserId(reportData, user.value.id);
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

async function getReportsByUserIdByLoc(mtrs) {
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
                reports.value = await reportService.getReportsByUserIdByLoc(reportData, user.value.id);
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
                reports.value = await reportService.getActiveReportsByUserIdByLoc(reportData, user.value.id);
            }
            resCerca();
            closeDrawer('SegnalazioniCerca');
            ready.value = true;
        }
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

async function goToReportInfo(id) {
    router.push({ path: `/reports/${id}` });
}

onMounted(async () => {
    user.value = await userService.findUserById(route.params.id);
    ready.value = true;
});
</script>
