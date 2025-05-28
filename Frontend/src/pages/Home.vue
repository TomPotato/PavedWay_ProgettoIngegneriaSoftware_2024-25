<template>
    <div id="map" style="height: 80vh;"></div>
    <RedirectMessage />
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import 'leaflet/dist/leaflet.css';
import L, { marker } from 'leaflet';

import RedirectMessage from '@/components/RedirectMessage.vue';
import siteService from '@/services/SiteService';
import reportService from '@/services/ReportService';

const map = ref(null);
const hereMarker = ref(null);
const location = ref({ lat: 46.066667, lng: 11.116667 });

const homeControl = L.Control.extend({
    options: { position: 'topleft' },
    onAdd: function () {
        const container = L.DomUtil.create('div', 'leaflet-bar leaflet-control leaflet-control-custom');
        container.style.backgroundColor = 'white';
        container.style.width = '34px';
        container.style.height = '34px';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        container.style.justifyContent = 'center';
        container.style.cursor = 'pointer';
        container.title = 'Torna alla posizione iniziale';

        // Home icon SVG
        container.innerHTML = `<img src="/home.svg" alt="Home" style="width: 24px; height: 24px;"/>`;

        L.DomEvent.on(container, 'click', function (e) {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            getLocation();
        });

        return container;
    }
});

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

function getLocation() {
    if (navigator.geolocation)
        navigator.geolocation.getCurrentPosition(position => {
            console.log('Geolocation successful:', position);
            location.value = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            };
        });
}

onMounted(async () => {
    watch(location, (newLocation) => {
        map.value.setView([newLocation.lat, newLocation.lng], 16);
        marker.value.setLatLng([newLocation.lat, newLocation.lng]).addTo(map.value).bindPopup('Sei qui').openPopup();
    });

    const sites = await siteService.getActiveSites();
    const reports = await reportService.getActiveReports();

    const siteIcon = '/site.svg';
    const reportIcon = '/report.svg';

    map.value = L.map('map').setView([location.value.lat, location.value.lng], 16);
    marker.value = L.marker([location.value.lat, location.value.lng]);
    map.value.addControl(new homeControl());

    getLocation();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; OpenStreetMap contributors'
    }).addTo(map.value);


    sites.forEach(site => {
        const marker = createMarker(site, siteIcon);
        marker.addTo(map.value);
    });

    reports.forEach(report => {
        const marker = createMarker(report, reportIcon);
        marker.addTo(map.value);
    });
});
</script>

<style scoped>
#map,
.leaflet-container {
    width: 100%;
    height: 100%;
}
</style>
