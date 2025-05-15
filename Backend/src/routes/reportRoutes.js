const express = require('express');
const router = express.Router();
const { ReportService } = require('../services/ReportService');

router.get('/', async (req, res) => {
    try {
        //const reports = await ReportService.getAllReports();
        res.status(200).json(reports);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;