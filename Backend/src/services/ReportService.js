const { Report } = require('../models/Report');
const { Comment } = require('../models/Comment');

const userService = require("./UserService");

const createError = require("../utils/createError");
const distanceFilter = require("../utils/distanceFilter");

class ReportService {
  /**
   * Recupera le segnalazioni dal database.
   *
   * @async
   * @param {number} offset - Il numero di segnalazioni da saltare.
   * @param {number} limit - Il numero massimo di segnalazioni da recuperare.
   * @returns {Promise<Array<Report>>} Un array di segnalazioni.
   * @throws {Error} Se si verifica un errore durante la ricerca delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Crea una query per recuperare tutte le segnalazioni.
   * 2. Se è fornito un offset e un limite, applica questi parametri alla query.
   * 3. Esegue la query e restituisce le segnalazioni recuperate.
   * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
   */
  async getReports(offset, limit) {
    try {
      let query = Report.find({});

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();
      return reports;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Recupera una segnalazione dal database in base all'ID fornito.
   *
   * @async
   * @param {string} id - L'ID della segnalazione da recuperare.
   * @returns {Promise<Report>} La segnalazione recuperata.
   * @throws {Error} Se si verifica un errore durante la ricerca della segnalazione, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Controlla se la segnalazione esiste nel database in base all'ID fornito.
   * 2. Se la segnalazione non esiste, solleva un errore 404 (Not Found).
   * 3. Se la segnalazione esiste, recupera la segnalazione dal database.
   * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
   */
  async getReportById(id) {
    try {
      const report = await Report.exists({ _id: id });
      if (!report) {
        throw createError(
          "Segnalazione non trovata",
          404,
          "Nessuna segnalazione trovata con questo ID."
        );
      }
      return await Report.findById(id);
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
   * Recupera le segnalazioni create da un utente specifico in base all'ID fornito.
   *
   * @async
   * @param {string} userId - L'ID dell'utente di cui recuperare le segnalazioni.
   * @param {number} offset - Il numero di segnalazioni da saltare.
   * @param {number} limit - Il numero massimo di segnalazioni da recuperare.
   * @returns {Promise<Array<Report>>} Un array di segnalazioni create dall'utente specificato.
   * @throws {Error} Se si verifica un errore durante la ricerca delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Controlla se l'utente esiste nel database in base all'ID fornito.
   * 2. Se l'utente non esiste, solleva un errore 404 (Not Found).
   * 3. Se l'utente esiste, crea una query per recuperare le segnalazioni create da quell'utente.
   * 4. Se è fornito un offset e un limite, applica questi parametri alla query.
   * 5. Esegue la query e restituisce le segnalazioni recuperate.
   * 6. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
   */
  async getReportsByUserId(userId, offset, limit) {
    try {
      const user = await userService.getUserById(userId);
      let query = Report.find({ createdBy: userId });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();
      return reports;
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = "Errore interno del server durante la ricerca.";
        throw createError("Errore interno del server", 500, message);
      }
    }
  }

  /**
   * Recupera le segnalazioni attive di un utente in una determinata data.
   *
   * @async
   * @param {string} userId - L'ID dell'utente di cui recuperare le segnalazioni.
   * @param {Date} date - La data di riferimento per determinare se una segnalazione è attiva.
   * @param {number} [offset=0] - Il numero di segnalazioni da saltare per la paginazione.
   * @param {number} [limit=0] - Il numero massimo di segnalazioni da restituire.
   * @returns {Promise<Array<Report>>} Le segnalazioni attive dell'utente filtrate per data.
   * @throws {Error} Se si verifica un errore durante il recupero delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Recupera le informazioni dell'utente tramite `userService.getUserById`.
   * 2. Costruisce una query Mongoose per cercare segnalazioni attive, cioè:
   *    - Quelle con data di inizio (`duration.start`) inferiore o uguale alla data fornita.
   *    - E con data di fine (`duration.end`) maggiore o uguale alla data fornita, oppure senza data di fine (null, undefined o non esistente).
   * 3. Filtra le segnalazioni in base all'ID dell'utente (campo `createdBy`).
   * 4. Applica l'offset e il limite se forniti.
   * 5. Restituisce le segnalazioni attive dell'utente che soddisfano i criteri di data.
   * 6. Se si verifica un errore durante l'elaborazione, solleva un errore 500 (Internal Server Error).
   */
  async getActiveReportsByUserId(userId, date, offset, limit) {
    try {
      const user = await userService.getUserById(userId);
      let query = Report.find({
        $and: [
          { "duration.start": { $lte: date } },
          {
            $or: [
              { "duration.end": { $gte: date } },
              { "duration.end": { $exists: false } },
              { "duration.end": { $in: [null, undefined] } },
            ],
          },
          { createdBy: userId },
        ],
      });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();
      return reports;
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = "Errore interno del server durante la ricerca.";
        throw createError("Errore interno del server", 500, message);
      }
    }
  }

  /**
   * Recupera le segnalazioni di un utente entro un certo raggio da una posizione geografica specifica.
   *
   * @async
   * @param {string} userId - L'ID dell'utente di cui recuperare le segnalazioni.
   * @param {number} latitude - La latitudine della posizione di riferimento.
   * @param {number} longitude - La longitudine della posizione di riferimento.
   * @param {number} radius - Il raggio (in chilometri o unità definite) entro cui cercare le segnalazioni.
   * @param {number} [offset=0] - Il numero di segnalazioni da saltare per la paginazione.
   * @param {number} [limit=0] - Il numero massimo di segnalazioni da restituire.
   * @returns {Promise<Array<Report>>} Le segnalazioni dell'utente filtrate per distanza.
   * @throws {Error} Se si verifica un errore durante il recupero delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Recupera le informazioni dell'utente tramite `userService.getUserById`.
   * 2. Costruisce una query Mongoose per cercare tutte le segnalazioni dell'utente (campo `createdBy`).
   * 3. Applica l'offset e il limite se forniti.
   * 4. Esegue la query per ottenere le segnalazioni.
   * 5. Filtra i risultati utilizzando la funzione `distanceFilter`, confrontando la distanza tra ogni segnalazione e la posizione fornita.
   * 6. Restituisce solo le segnalazioni dell'utente che rientrano nel raggio specificato.
   * 7. Se si verifica un errore durante l'elaborazione, solleva un errore 500 (Internal Server Error).
   */
  async getReportsByUserIdByLoc(
    userId,
    latitude,
    longitude,
    radius,
    offset,
    limit
  ) {
    try {
      const user = await userService.getUserById(userId);
      let query = Report.find({ createdBy: userId });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();

      const closeReports = distanceFilter(latitude, longitude, reports, radius);

      return closeReports;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Recupera le segnalazioni attive di un utente entro un certo raggio da una posizione geografica specifica e in una determinata data.
   *
   * @async
   * @param {string} userId - L'ID dell'utente di cui recuperare le segnalazioni.
   * @param {number} latitude - La latitudine della posizione di riferimento.
   * @param {number} longitude - La longitudine della posizione di riferimento.
   * @param {number} radius - Il raggio (in chilometri o unità definite) entro cui cercare le segnalazioni.
   * @param {Date} date - La data di riferimento per determinare se una segnalazione è attiva.
   * @param {number} [offset=0] - Il numero di segnalazioni da saltare per la paginazione.
   * @param {number} [limit=0] - Il numero massimo di segnalazioni da restituire.
   * @returns {Promise<Array<Report>>} Le segnalazioni attive dell'utente filtrate per distanza e data.
   * @throws {Error} Se si verifica un errore durante il recupero delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Recupera le informazioni dell'utente tramite `userService.getUserById`.
   * 2. Costruisce una query Mongoose per cercare segnalazioni attive dell'utente, cioè:
   *    - Quelle con data di inizio (`duration.start`) inferiore o uguale alla data fornita.
   *    - E con data di fine (`duration.end`) maggiore o uguale alla data fornita, oppure senza data di fine (null, undefined o non esistente).
   * 3. Filtra le segnalazioni in base all'ID dell'utente (campo `createdBy`).
   * 4. Applica l'offset e il limite se forniti.
   * 5. Esegue la query per ottenere le segnalazioni attive.
   * 6. Filtra i risultati utilizzando la funzione `distanceFilter`, confrontando la distanza tra ogni segnalazione e la posizione fornita.
   * 7. Restituisce solo le segnalazioni attive dell'utente che rientrano nel raggio specificato e nella data fornita.
   * 8. Se si verifica un errore durante l'elaborazione, solleva un errore 500 (Internal Server Error).
   */

  async getActiveReportsByUserIdByLoc(
    userId,
    latitude,
    longitude,
    radius,
    date,
    offset,
    limit
  ) {
    try {
      const user = await userService.getUserById(userId);
      let query = Report.find({
        $and: [
          { "duration.start": { $lte: date } },
          {
            $or: [
              { "duration.end": { $gte: date } },
              { "duration.end": { $exists: false } },
              { "duration.end": { $in: [null, undefined] } },
            ],
          },
          { createdBy: userId },
        ],
      });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();

      const closeReports = distanceFilter(latitude, longitude, reports, radius);

      return closeReports;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Crea una nuova segnalazione nel database.
   *
   * @async
   * @param {Object} reportData - I dati della segnalazione da creare.
   * @returns {Promise<Report>} La segnalazione creata.
   * @throws {Error} Se si verifica un errore durante la creazione della segnalazione, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Crea una nuova istanza del modello Report con i dati forniti.
   * 2. Esegue la validazione dei dati della segnalazione.
   * 3. Se la validazione fallisce, solleva un errore 400 (Bad Request).
   * 4. Se la validazione ha successo, salva la segnalazione nel database.
   * 5. Se si verifica un errore durante il salvataggio, solleva un errore 500 (Internal Server Error).
   * 6. Restituisce la segnalazione salvata.
   */
  async createReport(reportData) {
    try {
      const report = new Report(reportData);

      const validationError = report.validateSync();
      if (validationError) {
        const message =
          "Errore di validazione: alcuni campi non sono corretti.";
        throw createError("Richiesta non valida", 400, message);
      }

      const savedReport = await report.save();
      return savedReport;
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = "Errore interno del server durante il salvataggio.";
        throw createError("Errore interno del server", 500, message);
      }
    }
  }

  /**
   * Elimina una segnalazione dal database in base all'ID fornito.
   *
   * @async
   * @param {string} id - L'ID della segnalazione da eliminare.
   * @throws {Error} Se si verifica un errore durante l'eliminazione della segnalazione, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Controlla se la segnalazione esiste nel database in base all'ID fornito.
   * 2. Se la segnalazione non esiste, solleva un errore 404 (Not Found).
   * 3. Se la segnalazione esiste, elimina la segnalazione dal database.
   * 4. Se si verifica un errore durante l'eliminazione, solleva un errore 500 (Internal Server Error).
   */
  async deleteReport(id) {
    try {
      const report = await Report.exists({ _id: id });

      if (!report) {
        throw createError(
          "Segnalazione non trovata",
          404,
          "Nessuna segnalazione trovata con questo ID."
        );
      }

      await Report.findByIdAndDelete(id);
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
   * Recupera le segnalazioni dal database.
   *
   * @async
   * @param {string} date - La data in cui vogliamo vedere quali segnalazioni sono attive
   * @param {number} offset - Il numero di segnalazioni da saltare.
   * @param {number} limit - Il numero massimo di segnalazioni da recuperare.
   * @returns {Promise<Array<Report>>} Un array di segnalazioni.
   * @throws {Error} Se si verifica un errore durante la ricerca delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Crea una query per recuperare tutte le segnalazioni che sono iniziate prima della data inserita e che terminano dopo, oppure tute quelle senza terminazione che sono ancora attive.
   * 2. Se è fornito un offset e un limite, applica questi parametri alla query.
   * 3. Esegue la query e restituisce le segnalazioni recuperate.
   * 4. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
   */
  async getActiveReports(date, offset, limit) {
    try {
      let query = Report.find({
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
      });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();
      return reports;
    } catch (error) {
      const message = 'Errore interno del server durante la ricerca.';
      throw createError('Errore interno del server', 500, message);
    }
  }

  /**
  * Modifica una segnalazione nel database in base all'ID fornito.
  *
  * @async
  * @param {string} reportId - L'ID della segnalazione da modificare.
  * @param {Object} reportData - I dati della segnalazione da modificare.
  * @returns {Promise<Report>} La segnalazione modificata.
  * @throws {Error} Se si verifica un errore durante la modifica della segnalazione, viene sollevato un errore con un messaggio e un codice di stato appropriati.
  * 
  * @description
  * Questa funzione esegue i seguenti passaggi:
  * 1. Controlla se la segnalazione esiste nel database in base all'ID fornito.
  * 2. Se la segnalazione non esiste, solleva un errore 404 (Not Found).
  * 3. Se la segnalazione esiste, aggiorna la segnalazione nel database con i nuovi dati forniti.
  * 4. Esegue la validazione dei dati della segnalazione.
  * 5. Se la validazione fallisce, solleva un errore 400 (Bad Request).
  * 6. Se la validazione ha successo, salva la segnalazione nel database.
  * 7. Se si verifica un errore durante il salvataggio, solleva un errore 500 (Internal Server Error).
  * 8. Restituisce la segnalazione modificata.
  */
  async updateReport(reportId, reportData) {
    try {
      const reportExists = await Report.findById(reportId);

      if (!reportExists) {
        throw createError(
          "Segnalazione non trovata",
          404,
          "Nessuna segnalazione trovata con questo ID."
        );
      } else {
        const approvedReport = await Report.findByIdAndUpdate(
          reportId,
          reportData,
          {
            new: true,
            runValidators: true,
          }
        );

        return approvedReport;
      }
    } catch (error) {
      if (error.code) {
        throw error;
      } else {
        const message = "Errore interno del server durante la ricerca.";
        throw createError("Errore interno del server", 500, message);
      }
    }
  }

  /**
   * Recupera le segnalazioni entro un certo raggio da una posizione geografica specifica.
   *
   * @async
   * @param {number} latitude - La latitudine della posizione di riferimento.
   * @param {number} longitude - La longitudine della posizione di riferimento.
   * @param {number} radius - Il raggio (in chilometri o unità definite) entro cui cercare le segnalazioni.
   * @param {number} [offset=0] - Il numero di segnalazioni da saltare per la paginazione.
   * @param {number} [limit=0] - Il numero massimo di segnalazioni da restituire.
   * @returns {Promise<Array<Report>>} Le segnalazioni filtrate in base alla distanza specificata.
   * @throws {Error} Se si verifica un errore durante il recupero delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Costruisce una query Mongoose per recuperare tutte le segnalazioni dal database.
   * 2. Applica l'offset se fornito, per saltare un certo numero di risultati.
   * 3. Applica il limite se fornito, per limitare il numero di risultati restituiti.
   * 4. Esegue la query per ottenere le segnalazioni.
   * 5. Filtra i risultati utilizzando la funzione `distanceFilter`, confrontando la distanza tra ogni segnalazione e la posizione fornita.
   * 6. Restituisce solo le segnalazioni che rientrano nel raggio specificato.
   * 7. Se si verifica un errore durante l'elaborazione, solleva un errore 500 (Internal Server Error).
   */
  async getReportsByLocation(latitude, longitude, radius, offset, limit) {
    try {
      let query = Report.find({});

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();

      const closeReports = distanceFilter(latitude, longitude, reports, radius);

      return closeReports;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Recupera le segnalazioni attive entro un certo raggio da una posizione geografica specifica e in una determinata data.
   *
   * @async
   * @param {number} latitude - La latitudine della posizione di riferimento.
   * @param {number} longitude - La longitudine della posizione di riferimento.
   * @param {number} radius - Il raggio (in chilometri o unità definite) entro cui cercare le segnalazioni.
   * @param {Date} date - La data di riferimento per determinare se una segnalazione è attiva.
   * @param {number} [offset=0] - Il numero di segnalazioni da saltare per la paginazione.
   * @param {number} [limit=0] - Il numero massimo di segnalazioni da restituire.
   * @returns {Promise<Array<Report>>} Le segnalazioni attive filtrate per distanza e data.
   * @throws {Error} Se si verifica un errore durante il recupero delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   *
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Costruisce una query Mongoose per cercare segnalazioni attive, cioè:
   *    - Quelle con data di inizio (`duration.start`) inferiore o uguale alla data fornita.
   *    - E con data di fine (`duration.end`) maggiore o uguale alla data fornita, oppure senza data di fine (null, undefined o non esistente).
   * 2. Applica l'offset se fornito, per saltare un certo numero di risultati.
   * 3. Applica il limite se fornito, per limitare il numero di risultati restituiti.
   * 4. Esegue la query per ottenere le segnalazioni attive dal database.
   * 5. Filtra i risultati utilizzando la funzione `distanceFilter`, confrontando la distanza tra ogni segnalazione e la posizione fornita.
   * 6. Restituisce solo le segnalazioni attive che rientrano nel raggio specificato.
   * 7. Se si verifica un errore durante l'elaborazione, solleva un errore 500 (Internal Server Error).
   */
  async getActiveReportsByLocation(
    latitude,
    longitude,
    radius,
    date,
    offset,
    limit
  ) {
    try {
      let query = Report.find({
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
      });

      if (offset && offset > 0) {
        query = query.skip(offset);
      }

      if (limit && limit > 0) {
        query = query.limit(limit);
      }

      const reports = await query.exec();

      const closeReports = distanceFilter(latitude, longitude, reports, radius);

      return closeReports;
    } catch (error) {
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
    }
  }

  /**
   * Crea un commento associato a una segnalazione.
   * 
   * @async
   * @param {string} reportId - L'ID della segnalazione a cui aggiungere il commento.
   * @param {string} userId - L'ID dell'utente che sta creando il commento.
   * @param {string} text - Il testo del commento da aggiungere.
   * @returns {Promise<Report>} La segnalazione aggiornata con il nuovo commento.
   * @throws {Error} Se si verifica un errore durante la creazione del commento, viene sollevato un errore con un messaggio e un codice di stato appropriati.
   * 
   * @description
   * Questa funzione esegue i seguenti passaggi:
   * 1. Controlla se la segnalazione esiste nel database in base all'ID fornito.
   * 2. Se la segnalazione non esiste, solleva un errore 404 (Not Found).
   * 3. Se la segnalazione esiste, crea un nuovo commento con i dati forniti.
   * 4. Aggiunge il commento alla lista dei commenti della segnalazione.
   * 5. Salva la segnalazione aggiornata nel database.
   * 6. Se si verifica un errore durante la creazione del commento, solleva un errore 500 (Internal Server Error).
   * 7. Restituisce la segnalazione aggiornata con il nuovo commento.
   */
  async createComment(reportId, userId, text) {
    try {
      const report = await Report.findById(reportId);
      if (!report) {
        throw createError('Segnalazione non trovata', 404, 'Nessuna segnalazione trovata con questo ID.');
      }

      const comment = new Comment({
        userId: userId,
        text: text
      });

      report.comments.push(comment.toObject());
      const updatedReport = await report.save();
      return updatedReport;
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
  * Mostra una lista di commenti associati a una segnalazione.
  *
  * @async
  * @param {string} reportid - L'ID della segnalazione di cui visualizzare i commenti.
  * @param {number} offset - Il numero di commenti da saltare.
  * @param {number} limit - Il numero massimo di commenti da recuperare.
  * @returns {Promise<Array<Comments>>} Un array di commenti.
  * @throws {Error} Se si verifica un errore durante la ricerca dei commenti, viene sollevato un errore con un messaggio e un codice di stato appropriati.
  * 
  * @description
  * Questa funzione esegue i seguenti passaggi:
  * 1. Controlla se la segnalazione esiste nel database in base all'ID fornito.
  * 2. Se la segnalazione non esiste, solleva un errore 404 (Not Found).
  * 3. Se la segnalazione esiste, recupera i commenti associati alla segnalazione.
  * 4. Se è fornito un offset e un limite, applica questi parametri alla lista dei commenti.
  * 5. Se si verifica un errore durante la ricerca, solleva un errore 500 (Internal Server Error).
  * 6. Restituisce i commenti recuperati.
  */
  async getCommentsByReportid(reportid, offset, limit) {
    try {
      const report = await Report.findById(reportid);
      if (!report) {
        throw createError('Segnalazione non trovata', 404, 'Nessuna segnalazione trovata con questo ID.');
      }

      let comments = report.comments;

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

module.exports = new ReportService();
