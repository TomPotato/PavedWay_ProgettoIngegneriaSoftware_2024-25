const express = require('express');
const router = express.Router();
const service = require('../services/ReportService');
const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    try {
        const reports = await service.getReports(offset, limit);
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json(createError('[GET /reports] Errore', 500, error.message));
    }
});

module.exports = router;