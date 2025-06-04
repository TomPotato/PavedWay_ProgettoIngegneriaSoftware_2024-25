import api from './Api';

class PathService {
    async getPlace(street, city, code, stNumber) {
        try {
            const response = await api.get("/locations", {
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
            const response = await api.get("/locations", {
                q: q
            });

            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async getDirectPath(sLat, sLon, eLat, eLon, model = 'direct') {
        try {
            const response = await api.get("/paths", {
                model: model,
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