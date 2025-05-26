import api from "./Api";

class SiteService {
  async getSites(offset, limit) {
    try {
      const response = await api.get('/sites', {
        offset,
        limit,
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

  async createSite(token, siteData) {
    try {
      const response = await api.post('/sites', { params: siteData }, {
          headers: { 'x-api-key': token },
        }
      );
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async updateSite(token, id, siteData) {
    try {
      const response = await api.patch(`/sites/${id}`,{ params: siteData }, {
        headers: { 'x-api-key': token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async deleteSite(token, id) {
    try {
      const response = await api.delete(`/sites/${id}`, {
        headers: { 'x-api-key': token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }
}

export default new SiteService();
