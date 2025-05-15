const { Site } = require('../models/Site');

class SiteService {
    async getSite(offset, limit) {
        try {
            let query = Site.find({});

            if (offset) {
                query = query.skip(offset);
            }

            if (limit) {
                query = query.limit(limit);
            }

            const sites = await query.exec();
            return sites;
        } catch (error) {
            console.error('Errore durante la lettura:', error);
            throw new Error(error);
        }
    }
}

module.exports = new SiteService();