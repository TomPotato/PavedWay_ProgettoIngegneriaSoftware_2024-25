import L, { marker } from 'leaflet';
import 'leaflet/dist/leaflet.css';

class MapService {
    constructor(id) {
        this.id = id;
        this.map = null;
        this.hereMarker = null;
        this.pathLayer = null;
        this.startMarker = null;
        this.endMarker = null;
        this.pathSteps = [];
        this.pathTime = null;
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

    addEventMarker(lat, lng, id, name, iconUrl = null, color = 'blue', navigateFn = null) {
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

        const popupContent = `<a href="/reports/${id}" id="popup-link-${id}" class="font-medium text-primary dark:text-primary hover:underline">${name}</a>`;

        const newMarker = L.marker([lat, lng], {
            id: id,
            icon: markerIcon
        }).bindPopup(popupContent).addTo(this.map);

        newMarker.on('popupopen', () => {
            const link = document.getElementById(`popup-link-${id}`);
            if (link && typeof navigateFn === 'function') {
                link.addEventListener('click', (e) => {
                    e.preventDefault();
                    navigateFn(id);
                });
            }
        });
    }

    addControl(icon, onClick) {
        const control = L.Control.extend({
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

                container.innerHTML = `<img src="${icon}" alt="Home" style="width: 24px; height: 24px;"/>`;

                L.DomEvent.on(container, 'click', onClick);

                return container;
            }
        });
        this.map.addControl(new control());
    }

    updateHereMarker(lat, lng) {
        if (!this.hereMarker) {
            this.hereMarker = L.marker([lat, lng]).addTo(this.map).bindPopup('Sei qui');
        }
        this.hereMarker.setLatLng([lat, lng]).openPopup();
    }

    drawPath(geojson, color = 'blue', weight = 5) {
        if (!this.map) {
            console.error('Mappa non inizializzata');
            return;
        }

        if (this.hereMarker) {
            this.hereMarker.remove();
            this.hereMarker = null;
        }
        if (this.pathLayer) {
            this.map.removeLayer(this.pathLayer);
            this.pathLayer = null;
        }
        if (this.startMarker) {
            this.map.removeLayer(this.startMarker);
            this.startMarker = null;
        }
        if (this.endMarker) {
            this.map.removeLayer(this.endMarker);
            this.endMarker = null;
        }

        const coords = geojson.features[0].geometry.coordinates;
        const start = coords[0];
        const end = coords[coords.length - 1];
        this.startMarker = L.marker([start[1], start[0]], { title: 'Partenza' }).addTo(this.map).bindPopup('Partenza');
        this.endMarker = L.marker([end[1], end[0]], { title: 'Arrivo' }).addTo(this.map).bindPopup('Arrivo');

        this.pathLayer = L.geoJSON(geojson, {
            style: {
                color: color,
                weight: weight
            }
        }).addTo(this.map);

        this.pathSteps = geojson.features[0]?.properties.segments[0]?.steps || [];
        this.pathTime = geojson.features[0]?.properties.segments[0]?.duration || null;

        this.map.fitBounds(this.pathLayer.getBounds());
    }

    clearPath() {
        if (this.pathLayer) {
            this.map.removeLayer(this.pathLayer);
            this.pathLayer = null;
        }
        if (this.startMarker) {
            this.map.removeLayer(this.startMarker);
            this.startMarker = null;
        }
        if (this.endMarker) {
            this.map.removeLayer(this.endMarker);
            this.endMarker = null;
        }
    }

    getPathSteps() {
        return this.pathSteps.map(step => ({
            instruction: step.instruction,
            distance: step.distance,
            duration: step.duration,
            name: step.name,
            type: step.type,
        }));
    }

    getPathTime() {
        return this.pathTime || null;
    }
}

export default MapService;