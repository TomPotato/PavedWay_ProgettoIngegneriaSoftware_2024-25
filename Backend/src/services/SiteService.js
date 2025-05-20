const { Site } = require('../models/Site');

const createError = require('../utils/createError');

class SiteService {
    async getSites(offset, limit) {
        try {
            let query = Site.find({});

            if (offset && offset > 0) {
                query = query.skip(offset);
            }

            if (limit && limit > 0) {
                query = query.limit(limit);
            }

            const sites = await query.exec();
            return sites;
        } catch (error) {
            const message = 'Errore interno del server durante la lettura dei cantieri.';
            throw createError('Errore interno del server', 500, message);
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
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante il salvataggio del sito.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    async getActiveSites(offset, limit, date) {
        try {

            let query =  Site.find( {$or: [ 
                    {'realDuration.start': { $lte: date }, 'realDuration.end': { $gte: date }},
                    { 'realDuration': { $exists: false }},
                    {'duration.start': { $lte: date }, 'duration.end': { $gte: date }}
                ]
            });

            if (offset && offset > 0) {
                query = query.skip(offset);
            }

            if (limit && limit > 0) {
                query = query.limit(limit);
            }

            const sites = await query.exec();
            
            if (sites.length === 0) {
                const message = 'Nessun cantiere trovato con questa data.';
                throw createError('Cantieri non trovati', 404, message);
            }

            return sites;
        } catch (error) {
            const message = 'Errore interno del server durante la ricerca.';
            throw createError('Errore interno del server', 500, message);
        }
    }
}

// realDuration.start && realDuration.end

module.exports = new SiteService();