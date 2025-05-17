const { Site } = require('../models/Site');

class SiteService {
    async getSites(offset, limit) {
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

    async createSite(siteData) {
        try {
            const site = new Site(siteData);

            const validationError = site.validateSync();
            if (validationError) {
                const message = 'Errore di validazione: alcuni campi non sono corretti.';
                throw createError('Richiesta non valida', 400, message);
            }

            const savedSite = await site.save();
            return savedSite;
        } catch (error) {
            const message = 'Errore interno del server durante il salvataggio del sito.';
            throw createError('Errore interno del server', 500, message);
        }
    }

    async updateSite(siteData, siteId){
        try {
            const site = new Site(siteData);

            const validationError = site.validateSync();
            if (validationError) {
                const message = 'Errore di validazione: alcuni campi non sono corretti.';
                throw createError('Richiesta non valida', 400, message);
            }

            Site.find(siteId) = site;
            const savedSite = await Site.find(siteId).save();
            return savedSite;
        } catch (error){
            console.error('Errore durante la modifica:', error);
            throw new Error(error);
        }
    }
}

module.exports = new SiteService();