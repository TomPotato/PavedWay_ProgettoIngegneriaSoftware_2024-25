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
                                <p>{{ comment.userId }}</p>
                                <p>{{ comment.text }}</p>
                                <p>{{ comment.createdAt }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import siteService from '@/services/SiteService';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const errorMessage = ref(null);

const ready = ref(false);

const route = useRoute();
const id = route.params.id;

const site = ref({});

const getSiteById = async () => {
    try {
        ready.value = false;
        site.value = await siteService.getSiteById(id);
        ready.value = true;
    } catch (error) {
        errorMessage.value = siteService.error;
    }
};

onMounted(() => {
    getSiteById();
});
</script>
