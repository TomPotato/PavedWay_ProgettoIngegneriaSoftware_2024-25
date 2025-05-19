const { Report } = require('../models/Report');

const createError = require('../utils/createError');

class ReportService {
    
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

    async getActiveReports(offset, limit, date) {
        try {
            let query = Report.find({ start: { $lte: new Date(date) } , end: { $gte: new Date(date) } });
            if (!query) {
                throw createError('Segnalazioni non trovate', 404, 'Nessuna segnalazione trovata con questa data.');
            }

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
}

module.exports = new ReportService();