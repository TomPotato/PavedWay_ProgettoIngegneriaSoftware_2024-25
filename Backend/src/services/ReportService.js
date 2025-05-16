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
            throw new Error(error);
        }
    }
}

module.exports = new ReportService();