import api from './Api';

class SiteService {
    async createSite(siteData) {
        try {
            const response = await api.post('/sites', siteData);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async getSites(offset = 0, limit = 0) {
        try {
            const response = await api.get('/sites', {
                params: {
                    offset: offset,
                    limit: limit
                }
            });
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async getActiveSites(offset = 0, limit = 0) {
        try {
            const response = await api.get('/sites', {
                params: {
                    now: true,
                    offset: offset,
                    limit: limit
                }
            });
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async getSiteById(id) {
        try {
            const response = await api.get(`/sites/${id}`);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async updateSite(id, siteData) {
        try {
            const response = await api.patch(`/sites/${id}`, siteData);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async deleteSite(id) {
        try {
            const response = await api.delete(`/sites/${id}`);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }
}

export default new SiteService();