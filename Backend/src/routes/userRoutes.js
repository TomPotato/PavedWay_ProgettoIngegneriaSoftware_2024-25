const express = require('express');
const router = express.Router();

const reportService = require('../services/ReportService');
const userService = require('../services/UserService');

const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');

router.get('/:id/reports', async (req, res) => {
    const userId = req.params.id;
    const offset = toValidInt(req.query.offset);
    const limit = toValidInt(req.query.limit);

    try {
        const reports = await reportService.getReportsByUserId(userId, offset, limit);
        res.status(200).json(reports);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;