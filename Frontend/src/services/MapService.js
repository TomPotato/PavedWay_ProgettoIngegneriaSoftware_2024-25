import L, { marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

import api from './Api';

class MapService {
    constructor(id) {
        this.id = id;
        this.map = null;
        this.hereMarker = null;
    }

    initMap() {
        if (!this.map) {
            this.map = L.map(this.id);
            L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                maxZoom: 19,
                attribution: '&copy; OpenStreetMap contributors'
            }).addTo(this.map);
            this.hereMarker = L.marker([0, 0]).addTo(this.map).bindPopup('Sei qui');
        }
    }

    setView(lat, lng, zoom = 13) {
        if (!this.map) {
            console.error('Mappa non inizializzata');
            return;
        }
        this.map.setView([lat, lng], zoom);
    }

    addMarker(lat, lng, name, iconUrl = null) {
        if (!this.map) {
            console.error('Mappa non inizializzata');
            return;
        }
        const markerIcon = iconUrl ? L.icon({
            iconUrl,
            iconSize: [32, 32],
            iconAnchor: [16, 16],
            popupAnchor: [0, -16],
            shadowSize: [0, 0]

        }) : null;
        const newMarker = L.marker([lat, lng], {
            id: name,
            icon: markerIcon
        }).bindPopup(name).addTo(this.map);
    }

    addHomeControl(onClick) {
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

                container.innerHTML = `<img src="/home.svg" alt="Home" style="width: 24px; height: 24px;"/>`;

                L.DomEvent.on(container, 'click', onClick);

                return container;
            }
        });
        this.map.addControl(new homeControl());
    }

    updateHereMarker(lat, lng) {
        if (!this.hereMarker) {
            console.error('Marker della posizione attuale non inizializzato');
            return;
        }
        this.hereMarker.setLatLng([lat, lng]).openPopup();
    }
}

export default MapService;