<template>
    <div class="flex h-[80vh] shadow-lg">
        <div class="bg-base-200 transition-all duration-300 overflow-hidden rounded-l-lg"
            :class="drawerOpen ? 'basis-[50vw]' : 'basis-0'">
            <fieldset class="fieldset bg-base-200 border-base-300 rounded-box border p-4 ml-4 mr-4"
                @keyup.enter="submit">
                <legend class="fieldset-legend">Ricerca percorso</legend>

                <label class="label">Punto di partenza</label>
                <div class="relative w-full">
                    <input id="start" v-model="start" type="text" class="input w-full pr-12"
                        placeholder="Via, numero civico, città..." @input="fetchSuggestions('start')"
                        @focus="showSuggestions = 'start'" @blur="hideSuggestions()" />
                    <ul v-if="showSuggestions === 'start' && suggestions.length"
                        class="absolute left-0 right-0 mt-1 bg-base-100 border border-base-300 rounded shadow z-20 max-h-48 overflow-auto">
                        <li v-for="(suggestion, idx) in suggestions" :key="idx"
                            class="px-3 py-2 hover:bg-base-200 cursor-pointer"
                            @mousedown.prevent="selectSuggestion(suggestion, 'start')">
                            {{ suggestion }}
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
                    <input id="end" v-model="end" type="text" class="input w-full pr-12"
                        placeholder="Via, numero civico, città..." />
                    <button type="button"
                        class="absolute right-2 top-1/2 -translate-y-1/2 z-10 transition-transform duration-200 hover:scale-115 active:scale-90">
                        <img src="/aim.svg" alt="Posizione attuale" title="Posizione attuale" class="w-5 h-5"
                            @click="setLocation('end')" />
                    </button>
                </div>

                <button class="btn btn-neutral mt-4" @click="findPath()">
                    Trova percorso
                </button>
            </fieldset>
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

const map = new MapService('map');
const location = ref({ lat: 46.066667, lng: 11.116667 });
const drawerOpen = ref(false);

const start = ref('');
const end = ref('');

const showSuggestions = ref(null);
const suggestions = ref(["ciao", "come va", "tutto bene"]);

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

function setLocation(field) {
    getLocation();
    if (field === 'start') {
        start.value = `${location.value.lat}, ${location.value.lng}`;
    } else if (field === 'end') {
        end.value = `${location.value.lat}, ${location.value.lng}`;
    }
}

async function fetchSuggestions(field) {
    const searchTerm = field === 'start' ? start.value : end.value;
    if (searchTerm.length > 2) {
        try {
            const response = await pathService.getSuggestions(searchTerm);
            suggestions.value = response.data;
            showSuggestions.value = field;
        } catch (error) {
            console.error('Errore durante il recupero dei suggerimenti:', error);
            suggestions.value = [];
        }
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
        nextTick(() => {
            document.getElementById('start')?.blur();
        });
    } else {
        end.value = suggestion;
        nextTick(() => {
            document.getElementById('end')?.blur();
        });
    }
    showSuggestions.value = null;
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

    sites.forEach(site => {
        map.addMarker(site.location.latitude, site.location.longitude, site.name, siteIcon);
    });

    reports.forEach(report => {
        map.addMarker(report.location.latitude, report.location.longitude, report.name, reportIcon);
    });
});

defineOptions({
    name: 'Map',
});
</script>
