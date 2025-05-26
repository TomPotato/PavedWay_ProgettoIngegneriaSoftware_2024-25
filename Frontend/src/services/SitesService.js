import api from "./Api";

class SitesService {
  async getSites(offset, limit) {
    try {
      const response = await api.get("/sites", {
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

  async createSite(siteData) {
    try {
      const response = await api.post("/sites", siteData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async updateSite(id, siteData) {
    try {
      const response = await api.put(`/sites/${id}`, siteData);
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

export default new SitesService();
