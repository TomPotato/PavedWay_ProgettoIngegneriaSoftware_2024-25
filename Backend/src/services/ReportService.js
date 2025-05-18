const { Report } = require('../models/Report');

class ReportService {
    async getReports(offset, limit) {
        try {
            let query = Report.find({});

            if (offset) {
                query = query.skip(offset);
            }

            if (limit) {
                query = query.limit(limit);
            }

            const reports = await query.exec();
            return reports;
        } catch (error) {
            if (error.code) {
                throw error;
            } else {
                const message = 'Errore interno del server durante la ricerca.';
                throw createError('Errore interno del server', 500, message);
            }
        }
    }

    async getReportById(id) {
        try {
            const report = await Report.findById(id);
            if (!report) {
                throw createError('Ricerca fallita', 404, 'Nessun report trovato con questo ID.');
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
}

module.exports = new ReportService();