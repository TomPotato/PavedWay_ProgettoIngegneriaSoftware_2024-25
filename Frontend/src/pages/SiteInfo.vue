<template>
    <div class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col w-full">
        <div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
            <span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
        </div>
        <div v-else class="card lg:card-side bg-base-300 shadow-sm">
            <div class="card-body">
                <h2 class="text-xl font-semibold col-start-1 row-start-1">{{ site.name }}</h2>
                <p>{{ site.info }}</p>
                <p>Posizione: Lat: {{ site.location?.latitude }} - Lon: {{
                    site.location?.longitude }}</p>
                <p>Indirizzo: {{ site.location?.street }}, {{
                    site.location?.number }}
                    in {{
                        site.location?.city }} ({{ site.location?.code }})</p>
                <p>Durata: da {{ site.duration?.start || " 'non inserita' " }} a
                    {{
                        site.duration?.end
                        || " 'data da destinarsi' " }}</p>
                <i class=" text-yellow-600">Rating: {{ site?.rating || "0" }}</i>
                <p>Commenti:</p>
                <div v-for="comment in site.comments" :key="comment.id">
                    <p>{{ comment.userId }}</p>
                    <p>{{ comment.text }}</p>
                    <p>{{ comment.createdAt }}</p>
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
