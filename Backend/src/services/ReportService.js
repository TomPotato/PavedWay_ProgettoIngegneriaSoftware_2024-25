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
            const message = 'Errore interno del server durante la lettura delle segnalazioni.';
            throw createError('Errore interno del server', 500, message);
        }
    }
}

module.exports = new ReportService();