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
                    <h1 class="text-xl font-semibold">Username: {{ authStore.user?.username }}</h1>
                    <p>Nome: {{ authStore.user?.name }}, Cognome: {{ authStore.user?.surname }}</p>
                    <p v-if="authStore.isCitizen">Email inserita: <i>{{ authStore.user?.email }}</i></p>
                    <p v-if="authStore.isAdmin">Ufficio di competenza: <i>{{ authStore.user?.office }}</i></p>
                    <button @click="openModal('UtentiElimina')" class="btn btn-primary w-full">Elimina il
                        profilo!</button>
                </div>
            </div>
        </div>
        <input type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]" aria-label="Segnalazioni"
            v-if="authStore.isCitizen" @click="getReportsByUserId" />
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
                        <div class="space-y-4">
                            <div class="bg-base-300 border border-base-200 w-full p-6" v-for="report in reports"
                                :key="report.id">
                                <h2 class="text-xl font-semibold">{{ report.name }}</h2>
                                <p>{{ report.info }}</p>
                                <i>Rating: {{ report?.rating || "0" }}</i>
                                <p v-if="report.status === 'solved'">Segnalazione Risolta!</p>
                                <div class="grid grid-cols-4 gap-5 w-auto">
                                    <button class="btn btn-primary w-[10vh]"
                                        @click="goToReportInfo(report.id)">Info</button>
                                    <button @click="deleteReport(report.id)" class="btn btn-primary w-full">Elimina
                                        la
                                        Segnalazione!</button>
                                    <button @click="openModal('SegnalazioniModifica', report.id)"
                                        class="btn btn-neutral w-full" :disabled="report.status === 'solved'">Modifica
                                        la
                                        Segnalazione</button>
                                    <button @click="statusReport(report.id, 'solved')" class="btn btn-neutral w-full"
                                        :disabled="report.status === 'solved'">Contrassegna come Risolta</button>
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

                <dialog id="SegnalazioniModifica" class="modal">
                    <div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[80vh]">
                        <div class="overflow-y-auto p-4 flex-1">
                            <fieldset class="fieldset gap-2 w-xs">
                                <label class="label">Informazioni sulla Segnalazione</label>
                                <input v-model="title" type="text" class="input" placeholder="Titolo della Segnalazione"
                                    required />
                                <p v-if="!validateTitle" class="text-error">
                                    Il titolo della segnalazione deve essere compreso tra gli 0 e i 20 Caratteri
                                </p>
                                <input v-model="info" type="text" class="input"
                                    placeholder="Informazioni della Segnalazione" required />
                                <p v-if="!validateInfo" class="text-error">
                                    Le informazioni devono essere lunghe tra 1 e 200 caratteri.
                                </p>

                                <label class="label">Sono caricate {{ totImg }}
                                    immagini</label>

                                <label class="label">Inserisci le immagini:</label>
                                <input type="file" class="file-input" @change="photoUpload" multiple/>
                                <label class="label">Max size 2MB</label>
                            </fieldset>
                        </div>
                        <div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 justify-end sticky bottom-0">
                            <div>
                                <button class="btn btn-neutral w-full" @click="updateReport()"
                                    :disabled="!title || !info">Modifica</button>
                            </div>
                            <div>
                                <button @click="closeModal('SegnalazioniModifica')"
                                    class="modal-backdrop btn btn-neutral text-white w-full">Annulla</button>
                            </div>
                        </div>
                    </div>
                    <button class="modal-backdrop" @click="closeModal('SegnalazioniModifica')">Close</button>
                </dialog>
            </div>
        </div>

        <input v-if="authStore.isAdmin" type="radio" name="my_tabs_3" class="tab text-black [--tab-border-color:Black]"
            aria-label="Notifiche" @click="getNotifications" />
        <div v-if="authStore.isAdmin" class="tab-content bg-base-200 border-base-400 w-full p-6">
            <div class="bg-base-200 border-base-400 w-full">
                <div class="flex w-full h-[66vh] flex-col">
                    <div class="w-full space-y-2 bg-base-200 border-base-400 p-2 flex gap-2">
                        <button @click="getNotifications" class="btn btn-square btn-primary drawer-button p-1">
                            <img src="/refresh.svg" />
                        </button>
                        <button @click="openModal('NotificheCrea')"
                            class="btn btn-square btn-primary drawer-button p-1">
                            <img src="/add.svg" />
                        </button>
                    </div>

                    <div v-if="!ready" class="flex items-center justify-center w-full min-h-[64vh]">
                        <span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
                    </div>

                    <div v-else class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col">
                        <div class="space-y-4 grid grid-cols-3 gap-4">
                            <div class="bg-base-300 border border-base-200 w-full p-6"
                                v-for="(notify, index) in notifications" :key="index">
                                <h2 class="text-xl font-semibold">{{ notify.title }}</h2>
                                <p>{{ notify.message }}</p>
                                <p>Data di creazione: {{ notify.createdAt }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <dialog id="NotificheCrea" class="modal" role="dialog">
                <div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[40vh]">
                    <div class="overflow-y-auto p-4 flex-1">
                        <fieldset class="fieldset gap-2 w-xs">
                            <textarea v-model="message" type="text" class="textarea" placeholder="Testo Commento"
                                required></textarea>
                            <p v-if="!validateNotify" class="text-error">
                                Hai un massimo di 60 caratteri per scrivere una notifica.
                            </p>
                        </fieldset>
                    </div>
                    <div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 justify-end sticky bottom-0">
                        <div>
                            <button class="btn btn-neutral w-full" @click="createNotification"
                                :disabled="!message">Crea</button>
                        </div>
                        <div>
                            <button @click="closeModal('NotificheCrea')"
                                class="modal-backdrop btn btn-neutral text-white w-full">Annulla</button>
                        </div>
                    </div>
                </div>
                <button class="modal-backdrop" @click="closeModal('NotificheCrea')">Close</button>
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

    <dialog id="UtentiElimina" class="modal">
        <div class="modal-box max-w-md w-full">
            <h3 class="text-lg font-bold">Disconnessione</h3>
            <p class="py-2">Sei sicuro di volerti disconnettere?</p>
            <div class="modal-action">
                <form method="dialog" class="flex flex-row gap-2">
                    <button class="btn btn-neutral" @click="deleteUser(authStore.user.id)">Disconnettiti</button>
                    <button class="btn btn-neutral" @click="closeModal">Annulla</button>
                </form>
            </div>
        </div>
        <form method="dialog" class="modal-backdrop">
            <button @click="closeModal('UtentiElimina')">Annulla</button>
        </form>
    </dialog>
</template>

<script setup>

import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import imageCompression from 'browser-image-compression';
import RedirectMessage from '@/components/RedirectMessage.vue';
import { useAuthStore } from '@/stores/authStores';
import reportService from '@/services/ReportService';
import validateService from '@/utils/Validator';
import pathService from '@/services/PathService';
import userService from '@/services/UserService';
import notificationService from '@/services/NotificationService';

const router = useRouter();

const errorMessage = ref(null);
const notifications = ref([]);

const message = ref('');
const validateNotify = computed(() => {
    return message.value.length > 0 && message.value.length <= 60;
});

const index = ref(0);
const totImg = ref(0);

const authStore = useAuthStore();

const reports = ref([]);
const base64Photos = ref([]);

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

const radius = ref('');
const validateRadius = computed(() => {
    const check = ref('');
    if (meters.value === 'metri' && radius.value <= 1000) { check.value = true } else if (meters.value === 'chilometri' && radius.value <= 5) { check.value = true } else { check.value = false };
    return radius.value > 0 && check.value;
});

const passEvent = ref('');

const openModal = (id, eventId = '') => {
    passEvent.value = eventId;

    switch (id) {
        case 'SegnalazioniModifica':
            const report = reports.value.find(r => r.id === eventId);
            index.value = reports.value.findIndex(r => r.id === eventId);
            totImg.value = report.photos.length;
            title.value = report.name;
            info.value = report.info;
            break;
        default:
            break;
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
    return (title.value &&
        info.value &&
        validateTitle &&
        validateInfo
    );
});

const valCerca = computed(() => {
    return (
        (street.value && stNumber.value && city.value && radius.value && code.value &&
            validateStreet && validateStNumber && validateCity && validateRadius && validateCode)
    );
}
)

const resMod = () => {
    title.value = '';
    info.value = '';
    start.value = '';
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

async function photoUpload(event) {
    const files = event.target.files;
    if (!files) return;

    try {
        const options = {
            maxSizeMB: 0.2,
            maxWidthOrHeight: 1024,
            useWebWorker: true
        };
        const base64Photo = [];

        for (const file of files) {
            const compressedFile = await imageCompression(file, options);
            const base64photo = await imageCompression.getDataUrlFromFile(compressedFile);
            const base64Only = base64photo.split(',')[1];
            base64Photo.push(base64Only);
        }

        base64Photos.value = base64Photo;

    } catch (error) {
        console.error("Errore durante la compressione:", error);
    }
}

async function getReportsByUserId() {
    try {
        const reportData = {
            'offset': 0,
            'limit': 0
        };
        ready.value = false;
        reports.value = await reportService.getReportsByUserId(reportData, authStore.user.id);
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
        reports.value = await reportService.getActiveReportsByUserId(reportData, authStore.user.id);
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
                reports.value = await reportService.getReportsByUserIdByLoc(reportData, authStore.user.id);
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
                reports.value = await reportService.getActiveReportsByUserIdByLoc(reportData, authStore.user.id);
            }
            resCerca();
            closeDrawer('SegnalazioniCerca');
            ready.value = true;
        }
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

async function updateReport() {
    try {
        const id = passEvent.value;
        const index = reports.value.findIndex(r => r.id === id);

        start.value = new Date().toISOString();

        if (!valMod.value) {
            errorMessage.value = "Compila tutti i campi correttamente!";
        } else {
            if (index !== -1 && reports.value[index].photos && Array.isArray(reports.value[index].photos) && totImg < 4) {
                const existingPhotos = reports.value[index].photos.filter(photo => !base64Photos.value.includes(photo));
                base64Photos.value = [...existingPhotos, ...base64Photos.value];
            };
            const reportData = {
                'name': title.value,
                'info': info.value,
                'duration': {
                    'start': start.value,
                },
                'photos': base64Photos.value,
            };
            await reportService.updateReport(authStore.token, id, reportData);
            resMod();
            closeModal('SegnalazioniModifica');
            ready.value = false;
            await getReportsByUserId();
            ready.value = true;
        }
    } catch (error) {
        errorMessage.value = error.value;
    }
}

async function deleteReport(id) {
    try {
        await reportService.deleteReport(authStore.token, id);
        ready.value = false;
        await getReportsByUserId();
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

async function statusReport(id, status) {
    try {
        const date = Date.now();
        end.value = new Date(date).toISOString();
        await reportService.statusReport(authStore.token, id, status, end.value);
        ready.value = false;
        await getReportsByUserId();
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

async function getNotifications() {
    ready.value = false;
    notifications.value = await notificationService.getNotifications();
    ready.value = true;
}

async function createNotification() {
    try {
        const notificationData = {
            'message': message.value
        };
        await notificationService.createNotification(authStore.token, notificationData);
        ready.value = false;
        await getNotifications();
        ready.value = true;
        closeModal('NotificheCrea');
    } catch (error) {
        errorMessage.value = notificationService.error;
    }
}

async function goToReportInfo(id) {
    router.push({ path: `/reports/${id}` });
}

async function deleteUser(id) {
    try {
        await userService.deleteUser(id, authStore.token);
        authStore.logout();
        authStore.setMessage('Profilo eliminato con successo!');
        router.push({ path: '/' });
    } catch (error) {
        errorMessage.value = error.message || 'Errore durante l\'eliminazione del profilo.';
    }
}
</script>
