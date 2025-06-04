import api from './Api';

class PathService {
    async getPlace(street, city, code, stNumber) {
        try {
            const response = await api.get("/geocode", {
                street: street,
                city: city,
                code: code,
                stNumber: stNumber
            });

            const lat = Number(response.data[0].lat);
            const lon = Number(response.data[0].lon);

            return { lat, lon };
        } catch (error) {
            throw error.data;
        }
    }

    async getSuggestions(q) {
        try {
            const response = await api.get("/geocode", {
                q: q
            });

            return response.data.map(place => ({
                name: place.display_name,
                latitude: place.lat,
                longitude: place.lon
            }));
        } catch (error) {
            throw error.data;
        }
    }

    async getDirectPath(sLat, sLon, eLat, eLon) {
        try {
            const response = await api.get("/paths/direct", {
                startLatitude: sLat,
                startLongitude: sLon,
                endLatitude: eLat,
                endLongitude: eLon
            });
            return response.data;
        } catch (error) {
            throw error.data || error;
        }
    }
}

export default new PathService();