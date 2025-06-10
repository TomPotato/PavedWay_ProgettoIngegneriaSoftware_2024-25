<template>
    <div class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col w-full">
        <div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
            <span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
        </div>
        <div v-else class="card lg:card-side bg-base-300 shadow-sm">
            <div class="card-body">
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
                <br />
                <div class="w-full flex gap-5">
                    <div class="flex-1 collapse collapse-arrow bg-base-200 border border-base-100">
                        <input type="radio" name="my-accordion-2" />
                        <div class="collapse-title font-semibold">Commenti:</div>
                        <div class="collapse-content text-sm">
                            <div class="bg-base-100 border border-base-200 w-full p-6"
                                v-for="(comment, index) in site.comments" :key="index">
                                <p>{{ commentDisplay[index] }}</p>
                                <p>{{ comment.text }}</p>
                                <p>{{ comment.createdAt }}</p>
                            </div>
                        </div>
                    </div>
                    <div v-if="isCitizen" class="flex items-start">
                        <button @click="openModal('CommentiCrea', site.id)" class="btn btn-square btn-primary p-1">
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
                    <button class="btn btn-neutral w-full" @click="createComment" :disabled="!text || !validateComment">Crea</button>
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
import siteService from '@/services/SiteService';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';
import { useAuthStore } from '@/stores/authStores';
import userService from '@/services/UserService';

const errorMessage = ref(null);
const authStore = useAuthStore();
const isCitizen = authStore.isCitizen;


const ready = ref(false);

const route = useRoute();
const id = route.params.id;

const commentDisplay = ref([]);

const site = ref({});

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

const getSiteById = async () => {
    try {
        ready.value = false;
        site.value = await siteService.getSiteById(id);
        if (site.value.comments.length !== 0) {
            for (const element of site.value.comments) {
                let commentUser;
                if (element.userId.length !== 24) {
                    commentUser = 'Utente Eliminato';
                } else {
                    commentUser = await userService.findUserById(element.userId);
                }
                commentDisplay.value.push(commentUser.username);
            };
        };
        ready.value = true;
    } catch (error) {
        errorMessage.value = siteService.error;
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
        await siteService.createComment(authStore.token, commentData, id);
        text.value = '';
        await getSiteById();
        ready.value = true;
    } catch (error) {
        errorMessage.value = siteService.error;
    }
}

onMounted(() => {
    getSiteById();
});
</script>
