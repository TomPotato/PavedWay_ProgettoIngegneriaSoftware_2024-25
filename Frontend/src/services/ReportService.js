import api from './Api';

class ReportService {
    async createReport(reportData) {
        try {
            const response = await api.post(`/reports`, reportData);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async getReports(offset = 0, limit = 0) {
        try {
            const response = await api.get(`/reports`, {
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

    async getActiveReports(offset = 0, limit = 0) {
        try {
            const response = await api.get('/reports', {
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

    async updateReport(reportId, reportData) {
        try {
            const response = await api.put(`/reports/${reportId}`, reportData);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }

    async deleteReport(reportId) {
        try {
            const response = await api.delete(`/reports/${reportId}`);
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }
}

export default new ReportService();