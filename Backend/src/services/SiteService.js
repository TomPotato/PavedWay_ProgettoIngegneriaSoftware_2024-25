const { Site } = require('../models/Site');

const createError = require('../utils/createError');

class SiteService {
    /**
     * Recupera i cantieri dal database.
     * 
     * @async
     * @param {number} offset - Il numero di cantieri da saltare.
     * @param {number} limit - Il numero massimo di cantieri da recuperare.
     * @returns {Promise<Array<Site>>} Un array di cantieri.
     * @throws {Error} Se si verifica un errore durante la ricerca dei cantieri, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Crea una query per recuperare tutti i cantieri.
     * 2. Se è fornito un offset e un limite, applica questi parametri alla query.
     * 3. Esegue la query e restituisce i cantieri recuperati.
     * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
     */
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

    /**
     * Crea un nuovo cantiere nel database.
     * 
     * @async
     * @param {Object} siteData - I dati del cantiere da creare.
     * @returns {Promise<Site>} Il cantiere creato.
     * @throws {Error} Se si verifica un errore durante la creazione del cantiere, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Crea un nuovo oggetto cantiere con i dati forniti.
     * 2. Esegue la validazione del cantiere.
     * 3. Se la validazione fallisce, solleva un errore 400 (Bad Request).
     * 4. Se la validazione ha successo, salva il cantiere nel database.
     * 5. Se si verifica un errore durante il salvataggio, solleva un errore 500 (Internal Server Error).
     * 6. Restituisce il cantiere salvato.
     */
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

    /**
     * Modifica un cantiere esistente nel database.
     * 
     * @async
     * @param {Object} siteData - I dati da aggiornare.
     * @param {string} siteId - L'ID del cantiere da modificare.
     * @returns {Promise<Site>} Il cantiere aggiornato.
     * @throws {Error} Se si verifica un errore durante la modifica del cantiere, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Controlla se il cantiere esiste nel database in base all'ID fornito.
     * 2. Se il cantiere non esiste, solleva un errore 404 (Not Found).
     * 3. Se il cantiere esiste, aggiorna il cantiere con i nuovi dati.
     * 4. Se si verifica un errore durante l'aggiornamento, solleva un errore 500 (Internal Server Error).
     * 5. Restituisce il cantiere aggiornato.
     */
    async updateSite(siteId, siteData) {
        try {
            const siteExists = await Site.findById(siteId);
            
            if (!siteExists) {
                throw createError('Cantiere non trovato', 404, 'Nessun cantiere trovato con questo ID.');
            } else {
                const updatedSite = await Site.findByIdAndUpdate(siteId, siteData, {
                    new: true,
                    runValidators: true
                });

                return updatedSite;
            }

        } catch (error) {
            throw createError('Errore interno del server', 500, 'Errore interno del server avvenuto durante la modifica.');
        }
    }

    /**
     * Elimina un cantiere dal database in base all'ID fornito.
     * 
     * @async
     * @param {string} id - L'ID del cantiere da eliminare.
     * @throws {Error} Se si verifica un errore durante l'eliminazione del cantiere, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Controlla se il cantiere esiste nel database in base all'ID fornito.
     * 2. Se il cantiere non esiste, solleva un errore 404 (Not Found).
     * 3. Se il cantiere esiste, elimina il cantiere dal database.
     * 4. Se si verifica un errore durante l'eliminazione, solleva un errore 500 (Internal Server Error).
     */
    async deleteSite(id) {
        try {
            const site = await Site.exists({ _id: id });

            if (!site) {
                throw createError('Cantiere non trovato', 404, 'Nessun cantiere trovato con questo ID.');
            }

            await Site.findByIdAndDelete(id);
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante l\'eliminazione.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    /**
     * Mostra una lista di cantieri dal database in base alla data fornita o alla data del giorno.
     * @async
     * @param {date-time} date - Data in cui ricercare un cantiere.
     * @param {number} offset - Il numero di cantieri da saltare.
     * @param {number} limit - Il numero massimo di cantieri da recuperare.
     * @returns {Promise<Array<Site>>} Un array di cantieri.
     * @throws {Error} Se si verifica un errore durante la ricerca dei cantieri, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Crea una query per recuperare i cantieri che soddisfano la ricerca secondo realDuratione duration.
     * 2. Se è fornito un offset e un limite, applica questi parametri alla query.
     * 3. Esegue la query e restituisce i cantieri recuperati.
     * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
     */
    async getActiveSites(date, offset, limit) {
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

            return sites;
        } catch (error) {
            const message = 'Errore interno del server durante la ricerca.';
            throw createError('Errore interno del server', 500, message);
        }
    }
}

module.exports = new SiteService();