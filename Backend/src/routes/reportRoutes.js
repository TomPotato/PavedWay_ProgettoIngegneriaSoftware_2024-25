const express = require('express');
const router = express.Router();

const service = require('../services/ReportService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const toValidInt = require('../utils/toValidInt');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    try {
        const reports = await service.getReports(offset, limit);
        res.status(200).json(reports);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const report = await service.getReportById(id);
        res.status(200).json(report);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.post('/', tokenChecker, async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire una segnalazione nel corpo della richiesta.'));
    }

    req.body.createdBy = req.user.id;

    try {
        const site = await service.createReport(req.body);
        res.status(201).json(site);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.delete('/:id', tokenChecker, async (req, res) => {
    const id = req.params.id;

    try {
        const report = await service.getReportById(id);

        if (req.user.role === 'citizen' && req.user.id !== report.userId) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Puoi eliminare solo le segnalazioni che hai creato.'));
        }

        await service.deleteReport(id);
        res.status(204).json(null);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.patch('/:id', tokenChecker, async (req, res) => {

    try {

        //inserire un json(?)/array(?) per il contro controllo che non stia cercando di inserire altro oltre ai dati che vogliamo,
        // for each per ogni valore nell'array per riempire data e passarglielo al posto di req.body, nel caso sia admin si modifica
        //  solamente lo status della segnalazione e se cittadino può modificare solamente dei campi definiti

        const id = req.params.id;

        if (!req.body) {
            return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire le informazioni nel corpo della richiesta.'));
        }

        if (req.user.role !== 'admin' && req.body.status !== null) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Devi essere un amministratore per modificare questo dato'));
        }

        if (req.user.role === 'citizen' && req.user.id !== report.userId) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Puoi modificare solo le segnalazioni che hai creato.'));
        }

        const report = await service.getReportById(id);
        await service.updateReport(id, req.body);
        res.status(204).json(null);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;