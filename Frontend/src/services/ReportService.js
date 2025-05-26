import api from "./Api";

class ReportService {

  async getReports(offset, limit) {
    try {
      const response = await api.get(`/reports`, {
        offset,
        limit,
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async createReport(token , reportData) {
    try {
      const response = await api.post(
        `/reports`,
        { params: reportData },
        {
          headers: { "x-api-key": token },
        }
      );
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async updateReport(userId, userCreatedId, reportId, reportData) {
    try {
      const response = await api.put(`/reports/${reportId}`, reportData, {
        headers: {
          "x-user-id": userId,
          "x-user-created-id": userCreatedId,
        },
      });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async deleteReport(userId, userCreatedId, reportId) {
    try {
      const response = await api.delete(
        `/reports/${reportId}`,
        {},
        {
          headers: {
            "x-user-id": userId,
            "x-user-created-id": userCreatedId,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }

  async statusReport(reportId, status) {
    try {
      const response = await api.patch(`/reports/${reportId}`, { status });
      return response.data;
    } catch (error) {
      throw error.data;
    }
  }
}

export default new ReportService();
