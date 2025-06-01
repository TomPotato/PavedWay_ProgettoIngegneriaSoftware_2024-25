import api from "./Api";

class SiteService {
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

  async getActiveSites(offset, limit) {
    try {
      const response = await api.get("/sites", {
        now: true,
        offset: offset,
        limit: limit,
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getSitesByLoc(siteData) {
    try {
      const response = await api.get(`/sites`, siteData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getActiveSitesByLoc(siteData) {
    try {
      const response = await api.get(`/sites`, siteData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async createSite(token, siteData) {
    try {
      const response = await api.post("/sites", siteData, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async updateSite(token, id, siteData) {
    try {
      const response = await api.patch(`/sites/${id}`, siteData, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async deleteSite(token, id) {
    try {
      const response = await api.delete(`/sites/${id}`, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }
}

export default new SiteService();
