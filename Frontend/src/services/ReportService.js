import api from "./Api";

class ReportService {
  async getReports(offset, limit) {
    try {
      const response = await api.get(`/reports`, {
        offset: offset,
        limit: limit,
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getReportById(id) {
    try {
      const response = await api.get(`/reports/${id}`);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getActiveReports(offset, limit) {
    try {
      const response = await api.get(`/reports`, {
        now: true,
        offset: offset,
        limit: limit,
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getReportsByLoc(reportData) {
    try {
      const response = await api.get(`/reports`, reportData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getActiveReportsByLoc(reportData) {
    try {
      const response = await api.get(`/reports`, reportData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getReportsByUserId(reportData, userId) {
    try {
      const response = await api.get(`/users/${userId}/reports`, reportData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getActiveReportsByUserId(reportData, userId) {
    try {
      const response = await api.get(`/users/${userId}/reports`, reportData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getReportsByUserIdByLoc(reportData, userId) {
    try {
      const response = await api.get(`/users/${userId}/reports`, reportData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async getActiveReportsByUserIdByLoc(reportData, userId) {
    try {
      const response = await api.get(`/users/${userId}/reports`, reportData);
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async createReport(token, reportData) {
    try {
      const response = await api.post(`/reports`, reportData, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async updateReport(token, reportId, reportData) {
    try {
      const response = await api.patch(`/reports/${reportId}`, reportData, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async deleteReport(token, reportId) {
    try {
      const response = await api.delete(`/reports/${reportId}`, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async statusReport(token, reportId, status, end) {
    try {
      if (status !== 'approved') {
        const response = await api.patch(`/reports/${reportId}`,
          {
            duration: {
              end: end,
            },
            status: status,
          },
          {
            headers: { "x-api-key": token },
          });
        return response.data;
      } else {
        const response = await api.patch(`/reports/${reportId}`,
          {
            status: status,
          },
          {
            headers: { "x-api-key": token },
          });
        return response.data;
      }
    } catch (error) {
      throw error.data;
    }
  }

  async createComment(token, commentData, id) {
    try {
      const response = await api.post(`/reports/${id}/comments`, commentData, {
        headers: { "x-api-key": token },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }
}

export default new ReportService();
