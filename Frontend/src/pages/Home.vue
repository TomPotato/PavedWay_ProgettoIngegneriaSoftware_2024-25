<template>
    <div class="hero bg-base-200 min-h-screen">
        <div id="map" style="height: 100vh;"></div>
    </div>
    <RedirectMessage />
</template>

<script setup>
import { onMounted } from 'vue';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

import RedirectMessage from '@/components/RedirectMessage.vue';

import siteService from '@/services/SiteService';
import reportService from '@/services/ReportService';

function createMarker(event, iconUrl) {
    const marker = L.marker([event.location.latitude, event.location.longitude], {
        icon: L.icon({
            iconUrl: iconUrl,
            iconSize: [25, 41],
            iconAnchor: [12, 41],
            popupAnchor: [1, -34],
            shadowSize: [41, 41]
        })
    });
    marker.bindPopup(event.name);
    return marker;
}

onMounted(async () => {
    const sites = await siteService.getActiveSites();
    const reports = await reportService.getActiveReports();

    const siteIcon = '/site.svg';
    const reportIcon = '/report.svg';

    const map = L.map('map').setView([46.076091302889616, 11.117340635295195], 15);

    sites.forEach(site => {
        const marker = createMarker(site, siteIcon);
        marker.addTo(map);
    });

    reports.forEach(report => {
        const marker = createMarker(report, reportIcon);
        marker.addTo(map);
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map);

    L.marker([46.076091302889616, 11.117340635295195]).addTo(map)
        .bindPopup('CASA MIA')
        .openPopup();
});
</script>

<style scoped>
#map,
.leaflet-container {
    width: 100%;
    height: 100%;
}
</style>
