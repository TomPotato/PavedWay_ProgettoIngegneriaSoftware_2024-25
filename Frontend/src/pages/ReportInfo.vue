<template>
    <div class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col w-full">
        <div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
            <span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
        </div>
        <div v-else class="card lg:card-side bg-base-300 shadow-sm">
            <figure class="w-auto flex justify-center">
                <div class="flex flex-wrap gap-4 justify-center items-center">
                    <div v-for="(photo, index) in photoDisplay" :key="index" class="h-auto w-auto">
                        <img :src="'data:image/jpg;base64,' + photo" alt="Immagine codificata"
                            class="h-[40vh] object-contain" />
                    </div>
                </div>
            </figure>
            <div class="card-body">
                <h2 class="text-xl font-semibold col-start-1 row-start-1">{{ report.name }}</h2>
                <i v-if="report.status === 'solved'" class="text-3xl text-red-600">Segnalazione
                    Risolta!</i>
                <p>{{ report.info }}</p>
                <p>Posizione: Lat: {{ report.location?.latitude }} - Lon: {{
                    report.location?.longitude }}</p>
                <p>Indirizzo: {{ report.location?.street }}, {{
                    report.location?.number }}
                    in {{
                        report.location?.city }} ({{ report.location?.code }})</p>
                <p>Durata: da {{ report.duration?.start || " 'non inserita' " }} a
                    {{
                        report.duration?.end
                        || " 'data da destinarsi' " }}</p>
                <p>Creato da: {{ userId }}</p>
                <i class=" text-yellow-600">Rating: {{ report?.rating || "0" }}</i>
                <div class="w-full flex gap-5">
                    <div class="flex-1 collapse collapse-arrow bg-base-200 border border-base-100">
                        <input type="radio" name="my-accordion-2" />
                        <div class="collapse-title font-semibold">Commenti:</div>
                        <div class="collapse-content text-sm">
                            <div class="bg-base-100 border border-base-200 w-full p-6"
                                v-for="(comment, index) in report.comments" :key="index">
                                <p>{{ commentDisplay[index] }}</p>
                                <p>{{ comment.text }}</p>
                                <p>{{ comment.createdAt }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="isCitizen" class="flex items-start">
                        <button @click="openModal('CommentiCrea', report.id)" class="btn btn-square btn-primary p-1">
                            <img src="/comment.svg" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <dialog id="CommentiCrea" class="modal" role="dialog">
        <div class="modal-box bg-base-200 border-base-300 w-auto p-4 flex flex-col max-h-[40vh]">
            <div class="overflow-y-auto p-4 flex-1">
                <fieldset class="fieldset gap-2 w-xs">
                    <textarea v-model="text" type="text" class="textarea" placeholder="Testo Commento"
                        required></textarea>
                    <p v-if="!validateComment" class="text-error">
                        Hai un massimo di 140 caratteri per scrivere un commento.
                    </p>
                </fieldset>
            </div>
            <div class="grid grid-cols-2 gap-5 w-auto bg-base-200 p-4 justify-end sticky bottom-0">
                <div>
                    <button class="btn btn-neutral w-full" @click="createComment" :disabled="!text">Crea</button>
                </div>
                <div>
                    <button @click="closeModal('CommentiCrea')"
                        class="modal-backdrop btn btn-neutral text-white w-full">Annulla</button>
                </div>
            </div>
        </div>
        <button class="modal-backdrop" @click="closeModal('CommentiCrea')">Close</button>
    </dialog>
</template>

<script setup>
import { ref, computed } from 'vue';
import reportService from '@/services/ReportService';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStores';
import userService from '@/services/UserService';

const authStore = useAuthStore();

const isCitizen = authStore.isCitizen;

const errorMessage = ref(null);

const ready = ref(false);
const photoDisplay = ref([]);
const commentDisplay = ref([]);

const route = useRoute();
const id = route.params.id;

const userId = ref('');

const report = ref({});

const text = ref('');
const validateComment = computed(() => {
    return text.value.length < 140;
});

const passEvent = ref('');

const openModal = (id, eventId = '') => {
    passEvent.value = eventId;
    document.getElementById(id).showModal();
};

const closeModal = (id) => {
    document.getElementById(id).close();
};

const getReportById = async () => {
    try {
        ready.value = false;
        report.value = await reportService.getReportById(id);
        photoDisplay.value = report.value.photos;
        if (report.value.comments.length !== 0) {
            for (const element of report.value.comments) {
                let commentUser;
                if (element.userId.length !== 24) {
                    commentUser = 'Utente Eliminato';
                } else {
                    commentUser = await userService.findUserById(element.userId);
                }
                commentDisplay.value.push(commentUser);
            }
        };
        const user = await userService.findUserById(report.value.createdBy);
        userId.value = user;
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
};

const createComment = async () => {
    try {
        const id = passEvent.value;
        const commentData = {
            'text': text.value
        }
        ready.value = false;
        closeModal('CommentiCrea');
        await reportService.createComment(authStore.token, commentData, id);
        text.value = '';
        await getReportById();
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
}

onMounted(() => {
    getReportById();
});
</script>
