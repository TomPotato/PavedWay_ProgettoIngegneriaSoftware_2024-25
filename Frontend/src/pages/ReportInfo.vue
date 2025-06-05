<template>
    <div class="flex-1 p-6 overflow-y-auto min-h-[60vh] flex flex-col w-full">
        <div v-if="!ready" class="flex items-center justify-center w-full min-h-[65vh]">
            <span class="loading loading-infinity loading-s text-primary flex-[0.2]"></span>
        </div>
        <div v-else class="card lg:card-side bg-base-300 shadow-sm">
            <figure class="w-full flex justify-center">
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
                <i class=" text-yellow-600">Rating: {{ report?.rating || "0" }}</i>
                <p>Commenti:</p>
                <div v-for="comment in report.comments" :key="comment.id">
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
import reportService from '@/services/ReportService';
import { useRoute } from 'vue-router';
import { onMounted } from 'vue';

const errorMessage = ref(null);

const ready = ref(false);
const photoDisplay = ref([]);

const route = useRoute();
const id = route.query.id;

const report = ref({});

const getReportById = async () => {
    try {
        ready.value = false;
        report.value = await reportService.getReportById(id);
        photoDisplay.value = report.value.photos;
        ready.value = true;
    } catch (error) {
        errorMessage.value = reportService.error;
    }
};

onMounted(() => {
    getReportById();
});
</script>
