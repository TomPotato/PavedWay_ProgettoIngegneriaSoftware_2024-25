<template>
    <div class="flex h-[80vh] shadow-lg">
        <!-- Drawer -->
        <div class="bg-base-200 transition-all duration-300 overflow-hidden rounded-l-lg"
            :class="drawerOpen ? 'basis-[300px]' : 'basis-0'">
            <div class="p-4 h-full flex flex-col">
                <h2 class="text-xl font-bold mb-4">Pannello</h2>
                <p>Contenuto del drawer</p>
                <button class="btn btn-sm mt-4" @click="toggleDrawer">Chiudi</button>
            </div>
        </div>

        <div id="map" class="transition-all duration-300 w-full -h-full rounded-r-lg"></div>
    </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L, { marker } from 'leaflet';

import siteService from '@/services/SiteService';
import reportService from '@/services/ReportService';
import MapService from '@/services/MapService';
import { nextTick } from 'vue';

const map = new MapService('map');
const location = ref({ lat: 46.066667, lng: 11.116667 });
const drawerOpen = ref(false);

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
    map.addHomeControl(function (e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);
        //getLocation();
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
