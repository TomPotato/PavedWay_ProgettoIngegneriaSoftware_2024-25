const { Site } = require('../models/Site');

const createError = require('../utils/createError');

class SiteService {
    /**
     * Restituisce i cantieri esistenti
     *
     * @async
     * @param {int} offset - Quanti cantieri saltare prima di mostrarli
     * @param {int} limit - Quanti cantieri deve mostrare
     * @returns {Promise<{sites: query}>} Un oggetto contenente la lista dei cantieri esistenti.
     * @throws {Error} Se si verifica un errore durante la lettura delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Richiama i cantieri dal database
     * 2. Legge i parametri offset e limit come integer
     * 3. Scarta i cantieri iniziali e finali rispetto a offset e limit
     * 4. Restituisce una lista di cantieri. 
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
     * Crea un cantiere
     *
     * @async
     * @param {JSON} sitetData - Dati del cantiere che si vuole creare
     * @returns {Promise<{savedSite: Document}>} Un oggetto che restituisce il messaggio di creazione del cantiere
     * @throws {Error} Se si verifica un errore durante la creazione della segnalazione, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Legge i dati del JSON che viene consegnato
     * 2. Valida se i dati contenuti sono quelli richiesti per creare il cantiere
     * 3. Salva il cantiere sul database
     * 4. Restotiosce un messaggio di avvenuto salvataggio
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
     * Modifica un cantiere
     *
     * @async
     * @param {JSON} updateData - documento contenente le informazioni da modificare
     * @param {int} siteId - Id del cantiere che si vuole modificare
     * @returns {Promise<{site: query}>} Oggetto che restituisce il messaggio di update del cantiere
     * @throws {Error} Se si verifica un errore durante la modifica di un cantiere, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Legge l'id inserito dall'admin
     * 2. Legge i dati inseriti dall'admin
     * 2. Controlla che il cantiere esista
     * 3. Se non esite manda un messaggio di errore
     * 4. Se esiste controlla che i dati siano quelli richiesti
     * 5. Se i dati sono quelli richiesti modifica il cantiere e restituisce il cantiere modificato
     * */
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
    /**
     * Elimina un cantiere
     *
     * @async
     * @param {int} id - Id del cantiere che si vuole eliminare
     * @returns {Promise<{site: Document}>} Oggetto che restituisce il messaggio di eliminazione del cantiere
     * @throws {Error} Se si verifica un errore durante l'eliminazione di un cantiere, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Legge l'id inserito dall'admin
     * 2. Controlla che esista
     * 3. Se non esite manda un messaggio di errore
     * 4. Se esiste manda messaggio di avvenuta eliminazione
    */
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