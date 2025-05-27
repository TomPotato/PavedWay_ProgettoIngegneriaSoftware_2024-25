const { Notification } = require('../models/Notification');

const createError = require('../utils/createError');

class SiteService {

    async createNotification(notificationData) {
        try {
            const notification = new Notification(notificationData);

            const validationError = report.validateSync();
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

}

module.exports = new SiteService();