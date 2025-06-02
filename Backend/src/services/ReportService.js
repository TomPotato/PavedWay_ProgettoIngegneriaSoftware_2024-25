const { Report } = require("../models/Report");

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

    async getActiveReportsByUserId(userId, offset, limit) {
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
        { createdBy: userId }
      ]
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

  async getReportsByUserIdByLoc(userId, latitude, longitude, radius, offset, limit){
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

  async getActiveReportsByUserIdByLoc(userId, latitude, longitude, radius, date, offset, limit){
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
        { createdBy: userId }
      ]
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
      const message = "Errore interno del server durante la ricerca.";
      throw createError("Errore interno del server", 500, message);
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

  async getActiveReportsByLocation(latitude, longitude, radius, date, offset, limit) {
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
}

module.exports = new ReportService();
