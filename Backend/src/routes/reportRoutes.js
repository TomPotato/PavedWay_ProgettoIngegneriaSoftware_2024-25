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

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const report = await service.getReportById(id);
        if (!report) {
            return res.status(404).json(createError('[GET /reports/:id] Report non trovato', 404, error.message));
        }
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json(createError('[GET /reports/:id] Errore', 500, error.message));
    }
});

module.exports = router;