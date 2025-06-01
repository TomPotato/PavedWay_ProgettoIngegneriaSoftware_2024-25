import api from './Api';

class PathService {
    async getGeocode(path) {
        try {
            const response = await api.get(`/geocode`, {
                q: path,
            });
            return response.data;
        } catch (error) {
            throw error.data || error;
        }
    }
}

export default new PathService();