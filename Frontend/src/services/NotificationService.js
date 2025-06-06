import api from './Api';

class NotificationService {
    async getNotifications(offset, limit) {
        try {
            const response = await api.get("/notifications", {
                offset: offset,
                limit: limit
            });
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }
}

export default new NotificationService()