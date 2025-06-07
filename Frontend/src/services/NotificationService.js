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
    
    async createNotification(token, notificationData) {
        try {
            const response = await api.post("/notifications", notificationData, {
                headers: { "x-api-key": token },
            });
            return response.data;
        } catch (error) {
            throw error.data;
        }
    }
}

export default new NotificationService()