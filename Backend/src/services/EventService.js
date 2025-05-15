const { Event } = require('../models/Event');

class EventService {
    async getReports(offset, limit) {
        try {
            let query = Event.find({});

            if (offset) {
                query = query.skip(offset);
            }

            if (limit) {
                query = query.limit(limit);
            }

            const events = await query.exec();
            return events;
        } catch (error) {
            console.error('Errore durante la lettura:', error);
            throw new Error(error);
        }
    }
}

module.exports = new EventService();