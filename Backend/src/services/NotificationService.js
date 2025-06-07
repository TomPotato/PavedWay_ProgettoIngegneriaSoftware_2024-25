const { Notification } = require('../models/Notification');

const createError = require('../utils/createError');

class NotificationService {

    async createNotification(notificationData) {
        try {
            const notification = new Notification(notificationData);

            const validationError = notification.validateSync();
            if (validationError) {
                const message = 'Errore di validazione: alcuni campi non sono corretti.';
                throw createError('Richiesta non valida', 400, message);
            }

            const savedNotification = await notification.save();
            return savedNotification;
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante il salvataggio.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    async getNotifications() {
        try {
            let query = Notification.find({});

            if (offset && offset > 0) {
                query = query.skip(offset);
            }

            if (limit && limit > 0) {
                query = query.limit(limit);
            }

            const notifications = await query.exec();
            return notifications;
        } catch (error) {
            const message = 'Errore interno del server durante il recupero delle notifiche.';
            throw createError('Errore interno del server', 500, message);
        }
    }

}

module.exports = new NotificationService();