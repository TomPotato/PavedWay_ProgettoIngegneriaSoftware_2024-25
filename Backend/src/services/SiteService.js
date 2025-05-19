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
  
    async updateSite(updateData,siteId){
        try {

            const siteExists = await Site.findById(siteId);

            if(!siteExists) {
                throw createError('Cantiere non trovato', 404, 'Nessun cantiere trovato con questo ID.');
            }else{
                const updatedSite = await Site.findByIdAndUpdate(siteId, updateData, {
                overwrite: true,
                new: true,
                runValidators: true
                });

                return updatedSite;
            }

        } catch (error){
            throw createError('Errore interno del server', 500, 'Errore interno del server avvenuto durante la modifica.');
        }
    }
  
    async deleteSite(id) {
        try {
            const site = await Site.findByIdAndDelete(id);
            if (!site) {
                throw createError('Eliminazione fallita', 404, 'Nessun cantiere trovato con l\'ID fornito.');
            }
            return site;
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante l\'eliminazione del cantiere.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }
}
module.exports = new SiteService();