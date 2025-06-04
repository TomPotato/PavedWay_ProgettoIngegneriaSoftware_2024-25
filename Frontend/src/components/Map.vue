<template>
    <div class="flex h-[80vh] shadow-lg">
        <div class="bg-base-200 transition-all duration-300 overflow-hidden rounded-l-lg flex flex-col"
            :class="drawerOpen ? 'basis-[50vw]' : 'basis-0'">
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4 ml-4 mr-4"
                @keyup.enter="submit">
                <legend class="fieldset-legend">Ricerca percorso</legend>

                <label class="label">Punto di partenza</label>
                <div class="relative w-full">
                    <input id="start" v-model="start.name" type="text" class="input w-full pr-12"
                        placeholder="Via, numero civico, città..." @input="fetchSuggestions('start')"
                        @focus="showSuggestions = 'start'" @blur="hideSuggestions()" autocomplete="off" />
                    <ul v-if="showSuggestions === 'start'"
                        class="absolute left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow z-20 max-h-48 overflow-auto">
                        <li v-for="(suggestion, idx) in suggestions" :key="idx"
                            class="px-3 py-2 hover:bg-base-200 cursor-pointer"
                            @mousedown.prevent="selectSuggestion(suggestion, 'start')">
                            {{ suggestion.name }}
                        </li>
                    </ul>
                    <button type="button"
                        class="absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-transform duration-200 hover:scale-115 active:scale-90">
                        <img src="/aim.svg" alt="Posizione attuale" title="Posizione attuale" class="w-5 h-5"
                            @click="setLocation('start')" />
                    </button>
                </div>

                <label class="label">Punto di arrivo</label>
                <div class="relative w-full">
                    <input id="end" v-model="end.name" type="text" class="input w-full pr-12"
                        placeholder="Via, numero civico, città..." @input="fetchSuggestions('end')"
                        @focus="showSuggestions = 'end'" @blur="hideSuggestions()" autocomplete="off" />
                    <ul v-if="showSuggestions === 'end'"
                        class="absolute left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow z-20 max-h-48 overflow-auto">
                        <li v-for="(suggestion, idx) in suggestions" :key="idx"
                            class="px-3 py-2 hover:bg-base-200 cursor-pointer"
                            @mousedown.prevent="selectSuggestion(suggestion, 'end')">
                            {{ suggestion.name }}
                        </li>
                    </ul>
                    <button type="button"
                        class="absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-transform duration-200 hover:scale-115 active:scale-90">
                        <img src="/aim.svg" alt="Posizione attuale" title="Posizione attuale" class="w-5 h-5"
                            @click="setLocation('end')" />
                    </button>
                </div>

                <button class="btn btn-neutral mt-4" @click="findPath()" :disabled="!selectedStart || !selectedEnd">
                    Trova percorso
                </button>
            </fieldset>

            <div class="flex flex-col flex-1 min-h-0 mb-4">
                <fieldset v-if="showSteps"
                    class="fieldset bg-base-200 border-base-300 rounded-box border p-4 ml-4 mr-4 flex-1 flex flex-col min-h-0"
                    style="min-height:0; height:100%;">
                    <legend class="fieldset-legend">Istruzioni del percorso</legend>
                    <div v-if="time > 0" class="mb-2 text-base font-semibold">
                        Tempo stimato: {{ (time / 60).toFixed(0) }} minuti
                    </div>
                    <ol class="list-decimal ml-5 space-y-2 flex-1 overflow-y-auto max-h-full text-base"
                        style="list-style-position: inside;">
                        <li v-for="(step, idx) in map.pathSteps" :key="idx">
                            {{ step.instruction }}
                            <span v-if="step.distance"> ({{ (step.distance / 1000).toFixed(2) }} km)</span>
                        </li>
                    </ol>
                </fieldset>
            </div>
        </div>

        <div id="map" class="transition-all duration-300 w-full -h-full rounded-r-lg"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import siteService from '@/services/SiteService';
import reportService from '@/services/ReportService';
import MapService from '@/services/MapService';
import pathService from '@/services/PathService';
import { nextTick } from 'vue';
import router from '@/routes';

const primaryColor = '#f18e29';
const secondaryColor = '#26353d';

const map = new MapService('map');
const location = ref({ lat: 46.066667, lng: 11.116667 });
const drawerOpen = ref(false);

const start = ref({ name: '' });
const end = ref({ name: '' });
const selectedStart = ref(false);
const selectedEnd = ref(false);

const steps = ref([]);
const showSteps = ref(false);
const time = ref(0);

const showSuggestions = ref(null);
const suggestions = ref([]);

let fetchTimeout = null;
let isFetching = false;

const siteIcon = '/site.svg';
const reportIcon = '/report.svg';

function getLocation() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(position => {
            location.value = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
}

function toggleDrawer() {
    drawerOpen.value = !drawerOpen.value;

    setTimeout(() => {
        if (map.map) map.map.invalidateSize();
    }, 310)
}

async function setLocation(field) {
    suggestions.value = [];
    getLocation();
    await nextTick();
    const locString = `${location.value.lat}, ${location.value.lng}`;
    if (field === 'start') {
        try {
            const response = await pathService.getSuggestions(locString);
            start.value = response[0] || '';
            selectedStart.value = true;
        } catch (error) {
            console.error('Errore durante il recupero dei suggerimenti per il punto di partenza:', error);
        }
    } else if (field === 'end') {
        try {
            const response = await pathService.getSuggestions(locString);
            end.value = response[0] || '';
            selectedEnd.value = true;
        } catch (error) {
            console.error('Errore durante il recupero dei suggerimenti per il punto di arrivo:', error);
        }
    }
}

function fetchSuggestions(field) {
    if (field === 'start')
        selectedStart.value = false;
    else
        selectedEnd.value = false;

    const searchTerm = field === 'start' ? start.value.name : end.value.name;

    clearTimeout(fetchTimeout);

    if (searchTerm.length > 2) {
        fetchTimeout = setTimeout(async () => {
            if (isFetching) return;
            isFetching = true;
            try {
                const response = await pathService.getSuggestions(searchTerm);
                suggestions.value = response;
                showSuggestions.value = field;
            } catch (error) {
                console.error('Errore durante il recupero dei suggerimenti:', error);
                suggestions.value = [];
            } finally {
                isFetching = false;
            }
        }, 1000);
    } else {
        suggestions.value = [];
        showSuggestions.value = null;
    }
}

function hideSuggestions() {
    setTimeout(() => {
        showSuggestions.value = null;
        suggestions.value = [];
    }, 200);
}

function selectSuggestion(suggestion, field) {
    if (field === 'start') {
        start.value = suggestion;
        selectedStart.value = true;
        nextTick(() => {
            document.getElementById('start')?.blur();
        });
    } else {
        end.value = suggestion;
        selectedEnd.value = true;
        nextTick(() => {
            document.getElementById('end')?.blur();
        });
    }
    showSuggestions.value = null;
}

async function findPath() {
    if (!selectedStart.value || !selectedEnd.value) return;

    const sLat = start.value.latitude || location.value.lat;
    const sLng = start.value.longitude || location.value.lng;
    const eLat = end.value.latitude || location.value.lat;
    const eLng = end.value.longitude || location.value.lng;

    try {
        const path = await pathService.getDirectPath(sLat, sLng, eLat, eLng);
        if (!path || path.length === 0) {
            alert('Nessun percorso trovato tra i punti selezionati.');
            return;
        }

        map.drawPath(path, primaryColor);

        steps.value = map.getPathSteps();
        showSteps.value = true;

        time.value = map.getPathTime();
    } catch (error) {
        console.error('Errore durante il recupero del percorso:', error);
        alert('Errore durante il recupero del percorso. Riprova più tardi.');
    }
}

onMounted(async () => {
    await nextTick();

    watch(location, (newLocation) => {
        map.setView(newLocation.lat, newLocation.lng, 16);
        map.updateHereMarker(newLocation.lat, newLocation.lng);
    });

    const sites = await siteService.getActiveSites();
    const reports = await reportService.getActiveReports();

    map.initMap();
    map.setView(location.value.lat, location.value.lng, 16);
    map.addControl('/aim.svg', function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        getLocation();
    });
    map.addControl('/search.svg', function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        toggleDrawer();
    });

    getLocation();

    console.log(sites);
    console.log(reports);
    sites.forEach(site => {
        map.addEventMarker(site.location.latitude, site.location.longitude, site.id, site.name, siteIcon, null, (id) => {
            router.push(`/sites/${id}`);
        });
    });

    reports.forEach(report => {
        map.addEventMarker(report.location.latitude, report.location.longitude, report.id, report.name, reportIcon, null, (id) => {
            router.push(`/reports/${id}`);
        });
    });
});

defineOptions({
    name: 'Map',
});
</script>
