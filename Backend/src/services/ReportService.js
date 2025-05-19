const { Report } = require('../models/Report');

const createError = require('../utils/createError');

class ReportService {
    /**
     * Restituisce i Reports creati dagli utenti o dal'admin
     *
     * @async
     * @param {int} offset - Quanti report saltare prima di mostrarli
     * @param {int} limit - Quanti report deve mostrare
     * @returns {Promise<{reports: query}>} Un oggetto contenente la lista delle segnalazioni esistenti.
     * @throws {Error} Se si verifica un errore durante la lettura delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Richiama le segnalazioni dal database
     * 2. Legge i parametri offset e limit come integer
     * 3. Scarta i segnalazioni iniziali e finali rispetto a offset e limit
     * 4. Restituisce una lista di segnalazioni. 
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
            const message = 'Errore interno del server durante la ricerca.';
            throw createError('Errore interno del server', 500, message);
        }
    }
/**
     * Restituisce la segnalazione che si vuole visualizzare
     *
     * @async
     * @param {int}: Id della segnalazione che si vuole visualizzare
     * @returns {Promise<{report: report}>} oggetto che contiene la segnalazione che si voleva visualizzare
     * @throws {Error} Se si verifica un errore durante la lettura delle segnalazioni, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. legge gli id della segnalazione che si vuole visualizzare
     * 2. Nel caso non esista solleva un errore
     * 3. Nel caso esista la mostra a schermo
     */
    async getReportById(id) {
        try {
            const report = await Report.findById(id);
            if (!report) {
                throw createError('Segnalazione non trovata', 404, 'Nessuna segnalazione trovata con questo ID.');
            }
            return report;
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante la ricerca tramite ID.';
                throw createError('Errore interno del server', 500, message);
            }
          }
        }

    /**
     * Crea una segnalazione
     *
     * @async
     * @param {JSON} reportData - Dati della segnalaizone che si vuole creare
     * @returns {Promise<{report: Document}>} Un oggetto che restituisce il messaggio di creazione della segnalazione
     * @throws {Error} Se si verifica un errore durante la creazione della segnalazione, viene sollevato un errore con un messaggio e un codice di stato appropriati.
     * 
     * @description
     * Questa funzione esegue i seguenti passaggi:
     * 1. Legge i dati del JSON che viene consegnato
     * 2. Valida se i dati contenuti sono quelli richiesti per creare la segnalazione
     * 3. Salva la segnalazione sul database
     * 4. Restotiosce un messaggio di avvenuto salvataggio
    */
    async createReport(reportData) {
        try{
                const report =  new Report(reportData);

                const validationError = report.validateSync();
                if (validationError) {
                    const message = 'Errore di validazione: alcuni campi non sono corretti.';
                    throw createError('Richiesta non valida', 400, message);
                }

                const savedReport = await report.save();
                return savedReport;
            } catch (error) {
                if (error.code) {
                    throw error;
                } else {
                    const message = 'Errore interno del server durante il salvataggio del sito.';
                    throw createError('Errore interno del server', 500, message);
                }
            }
    }
}

module.exports = new ReportService();