const { Site } = require('../models/Site');
const { Comment } = require('../models/Comment');

const createError = require("../utils/createError");
const distanceFilter = require("../utils/distanceFilter");

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
      const message =
        "Errore interno del server durante la lettura dei cantieri.";
      throw createError("Errore interno del server", 500, message);
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
        const message =
          "Errore di validazione: alcuni campi non sono corretti.";
        throw createError("Richiesta non valida", 400, message);
      }

      const savedSite = await site.save();
      return savedSite;
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message =
          "Errore interno del server durante il salvataggio del sito.";
        throw createError("Errore interno del server", 500, message);
      }
    }
  }
  
  /**
   * Recupera un cantiere dal database in base all'ID fornito.
   * 
   * @async
   * @param {string} id - L'ID del cantiere da recuperare.
   * @returns {Promise<Site>} Il cantiere recuperato.
   * @throws {Error} Se si verifica un errore durante la ricerca del cantiere, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   * 
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Controlla se il cantiere esiste nel database in base all'ID fornito.
   * 2. Se il cantiere non esiste, solleva un errore 404 (Not Found).
   * 3. Se il cantiere esiste, lo recupera dal database.
   * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
   */
  async getSiteById(id) {
    try {
      const site = await Site.exists({ _id: id });
      if (!site) {
        throw createError(
          "Segnalazione non trovata",
          404,
          "Nessuna segnalazione trovata con questo ID."
        );
      }
      return await Site.findById(id);
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message =
          "Errore interno del server durante la ricerca tramite ID.";
        throw createError("Errore interno del server", 500, message);
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
        throw createError(
          "Cantiere non trovato",
          404,
          "Nessun cantiere trovato con questo ID."
        );
      } else {
        const updatedSite = await Site.findByIdAndUpdate(siteId, siteData, {
          new: true,
          runValidators: true,
        });

        return updatedSite;
      }
    } catch (error) {
      throw createError(
        "Errore interno del server",
        500,
        "Errore interno del server avvenuto durante la modifica."
      );
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
        throw createError(
          "Cantiere non trovato",
          404,
          "Nessun cantiere trovato con questo ID."
        );
      }

      await Site.findByIdAndDelete(id);
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = "Errore interno del server durante l'eliminazione.";
        throw createError("Errore interno del server", 500, message);
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
      let query = Site.find({
        $and: [
          {
            $and: [
              { "duration.start": { $lte: date } },
              {
                $or: [
                  { "duration.end": { $gte: date } },
                  { "duration.end": { $exists: false } },
                  { "duration.end": { $in: [null, undefined] } },
                ],
              },
            ],
          },
          {
            $or: [
              { "realDuration.start": { $lte: date } },
              {
                $or: [
                  { "realDuration.end": { $gte: date } },
                  { "realDuration.end": { $exists: false } },
                  { "realDuration.end": { $in: [null, undefined] } },
                ],
              },
              {
                "realDuration": { $exists: false },
              },
            ],
          },
        ],
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
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Mostra una lista di cantieri filtrati in base alla posizione geografica e al raggio forniti.
   * @async
   * @param {number} latitude - Latitudine del punto da cui calcolare la distanza.
   * @param {number} longitude - Longitudine del punto da cui calcolare la distanza.
   * @param {number} radius - Raggio (in metri) entro il quale cercare i cantieri.
   * @param {number} offset - Il numero di cantieri da saltare.
   * @param {number} limit - Il numero massimo di cantieri da recuperare.
   * @returns {Promise<Array<Site>>} Un array di cantieri entro il raggio specificato.
   * @throws {Error} Se si verifica un errore durante la ricerca dei cantieri, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Recupera tutti i cantieri dal database, applicando eventualmente offset e limit.
   * 2. Applica un filtro geografico ai cantieri in base alla latitudine, longitudine e al raggio forniti, utilizzando la funzione `distanceFilter`.
   * 3. Restituisce i cantieri che rientrano nel raggio specificato dalla posizione data.
   * 4. Se si verifica un errore durante il processo, solleva un errore 500 (Internal Server Error).
   */
  async getSitesByLocation(latitude, longitude, radius, offset, limit) {
    try {

      let query = Site.find({});

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const sites = await query.exec();

      const closeSites = distanceFilter(latitude, longitude, sites, radius);

      return closeSites;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Mostra una lista di cantieri attivi in una determinata data, filtrati in base alla posizione geografica e al raggio forniti.
   * @async
   * @param {number} latitude - Latitudine del punto da cui calcolare la distanza.
   * @param {number} longitude - Longitudine del punto da cui calcolare la distanza.
   * @param {number} radius - Raggio (in metri) entro il quale cercare i cantieri.
   * @param {Date} date - Data in cui il cantiere deve essere attivo.
   * @param {number} offset - Il numero di cantieri da saltare (per la paginazione).
   * @param {number} limit - Il numero massimo di cantieri da recuperare.
   * @returns {Promise<Array<Site>>} Un array di cantieri attivi entro il raggio specificato.
   * @throws {Error} Se si verifica un errore durante la ricerca dei cantieri, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Esegue una query sul database per recuperare i cantieri attivi alla data specificata, 
   *    verificando sia la durata pianificata (`duration`) che quella reale (`realDuration`).
   * 2. Applica i parametri `offset` e `limit` se forniti, per la paginazione dei risultati.
   * 3. Applica un filtro geografico ai cantieri recuperati in base alla latitudine, longitudine e al raggio forniti, utilizzando la funzione `distanceFilter`.
   * 4. Restituisce solo i cantieri che rientrano nel raggio specificato dalla posizione data.
   * 5. Se si verifica un errore durante il processo, solleva un errore 500 (Internal Server Error).
   */
  async getActiveSitesByLocation(latitude, longitude, radius, date, offset, limit) {
    try {
      let query = Site.find({
        $and: [
          {
            $and: [
              { "duration.start": { $lte: date } },
              {
                $or: [
                  { "duration.end": { $gte: date } },
                  { "duration.end": { $exists: false } },
                  { "duration.end": { $in: [null, undefined] } },
                ],
              },
            ],
          },
          {
            $or: [
              { "realDuration.start": { $lte: date } },
              {
                $or: [
                  { "realDuration.end": { $gte: date } },
                  { "realDuration.end": { $exists: false } },
                  { "realDuration.end": { $in: [null, undefined] } },
                ],
              },
              {
                "realDuration": { $exists: false },
              },
            ],
          },
        ],
      });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const sites = await query.exec();

      const closeSites = distanceFilter(latitude, longitude, sites, radius);

      return closeSites;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Crea un commento associato a un cantiere.
   * 
   * @async
   * @param {string} siteId - L'ID del cantiere a cui aggiungere il commento.
   * @param {string} userId - L'ID dell'utente che sta creando il commento.
   * @param {string} text - Il testo del commento da aggiungere.
   * @returns {Promise<Site>} Il cantiere aggiornato con il nuovo commento.
   * @throws {Error} Se si verifica un errore durante la creazione del commento, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   * 
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Controlla se il cantiere esiste nel database in base all'ID fornito.
   * 2. Se il cantiere non esiste, solleva un errore 404 (Not Found).
   * 3. Se il cantiere esiste, crea un nuovo commento con l'ID utente e il testo forniti.
   * 4. Aggiunge il commento al cantiere e lo salva nel database.
   * 5. Se si verifica un errore durante la creazione del commento, solleva un errore 500 (Internal Server Error).
   * 6. Restituisce il cantiere aggiornato con il nuovo commento.
   */
  async createComment(siteId, userId, text) {
    try {
      const site = await Site.findById(siteId);
      if (!site) {
        throw createError('Cantiere non trovato', 404, 'Nessun cantiere trovato con questo ID.');
      }

      const comment = new Comment({
        userId: userId,
        text: text
      });

      site.comments.push(comment.toObject());
      const updatedSite = await site.save();
      return updatedSite;
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = 'Errore interno del server durante la creazione del commento.';
        throw createError('Errore interno del server', 500, message);
      }
    }
  }

  /**
  * Mostra una lista di commenti associati a un cantiere.
  *
  * @async
  * @param {string} siteId - L'ID del cantiere di cui visualizzare i commenti.
  * @param {number} offset - Il numero di commenti da saltare.
  * @param {number} limit - Il numero massimo di commenti da recuperare.
  * @returns {Promise<Array<Comments>>} Un array di commenti.
  * @throws {Error} Se si verifica un errore durante la ricerca dei commenti, viene sollevato un errore con un messaggio e un codice di stato appropriati.
  * 
  * @description
  * Questa funzione esegue i seguenti passaggi:
  * 1. Controlla se il cantiere esiste nel database in base all'ID fornito.
  * 2. Se il cantiere non esiste, solleva un errore 404 (Not Found).
  * 3. Se il cantiere esiste, recupera i commenti associati al cantiere.
  * 4. Se è fornito un offset e un limite, applica questi parametri alla lista dei commenti.
  * 5. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
  * 6. Restituisce i commenti recuperati.
  */
  async getCommentsBySiteid(siteId, offset, limit) {
    try {
      const site = await Site.findById(siteId);
      if (!site) {
        throw createError('Cantiere non trovato', 404, 'Nessun cantiere trovato con questo ID.');
      }

      let comments = site.comments;

      if (offset && offset > 0) {
        comments = comments.slice(offset);
      }

      if (limit && limit > 0) {
        comments = comments.slice(0, limit);
      }

      return comments;
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = 'Errore interno del server durante la lettura dei commenti.';
        throw createError('Errore interno del server', 500, message);
      }
    }
  }

}

module.exports = new SiteService();
