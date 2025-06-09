const express = require('express');
const router = express.Router();

const service = require('../services/ReportService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const toValidInt = require('../utils/toValidInt');
const validator = require('../utils/Validator');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    let date;

    if (req.query.now === 'true' && req.query.date) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire solo una data o il parametro "now" con valore "true".'));
    }

    if (req.query.date) {
        if (!validator.validateDate(req.query.date)) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire una data valida in formato ISO 8601.'));
        }
        date = req.query.date;
    } else if (req.query.now === 'true') {
        date = new Date().toISOString();
    }

    if((req.query.latitude !== undefined || req.query.longitude !== undefined || req.query.radius !== undefined) &&
    (req.query.latitude === undefined || req.query.longitude === undefined || req.query.radius === undefined))
    {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire longitudine, latitudine e raggio.'));
    }

    let latitude = null;
    let longitude = null;
    let radius = null;

    if (req.query.latitude && req.query.longitude) {
        if (!validator.validateLocation(Number(req.query.latitude), Number(req.query.longitude))) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire una posizione valida.'));
        }
        latitude = Number(req.query.latitude);
        longitude = Number(req.query.longitude);
    }

    if (req.query.radius) {
        if (!validator.validateRadius(Number(req.query.radius))) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire un raggio entro cui cercare che sia maggiore di 0 e minore di 5000.'));
        }
        radius = Number(req.query.radius);
    }

    if ((latitude !== null || longitude !== null || radius !== null) &&
        !(latitude !== null && longitude !== null && radius !== null)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Per cercare in una determinata area devi fornire latitudine, longitudine e raggio insieme.'));
    }

    try {
        if (date && !longitude && !latitude && !radius) {
            const reports = await service.getActiveReports(date, offset, limit);
            return res.status(200).json(reports);
        } else if (longitude && latitude && radius && !date) {
            const reports = await service.getReportsByLocation(latitude, longitude, radius, offset, limit);
            return res.status(200).json(reports);
        } else if (longitude && latitude && radius && date) {
            const reports = await service.getActiveReportsByLocation(latitude, longitude, radius, date, offset, limit);
            return res.status(200).json(reports);
        } else {
            const reports = await service.getReports(offset, limit);
            return res.status(200).json(reports);
        }
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
        const report = await service.createReport(req.body);
        res.status(201).json(report);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.delete('/:id', tokenChecker, async (req, res) => {
    const id = req.params.id;

    try {
        const report = await service.getReportById(id);

        if (req.user.role === 'citizen' && req.user.id !== report.createdBy.toString()) {
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
    const id = req.params.id;
    let report;
    try {
        report = await service.getReportById(id);
    } catch (error) {
        return res.status(error.code || 500).json(error);
    }

    if (!report) {
        return res.status(404).json(createError('Segnalazione non trovata', 404, 'Nessuna segnalazione trovata con questo ID.'));
    }

    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire le informazioni nel corpo della richiesta.'));
    }

    if (req.body.status) {
        if (req.user.role !== 'admin' && req.body.status !== 'solved') {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Devi essere un amministratore per modificare questo dato'));
        }
    }

    if (req.user.role === 'citizen' && req.user.id !== report.createdBy.toString()) {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Puoi modificare solo le segnalazioni che hai creato.'));
    }

    if (req.user.role === 'admin' && (req.body.name || req.body.info || req.body.photos)) {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Non puoi modificare una segnalazione, solo approvarla o rifiutarla.'));
    }

    if (req.body.status && !validator.validateStatus(req.body.status)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Lo stato della segnalazione deve essere uno tra: pending, approved, rejected, solved.'));
    }

    try {
        let data = null;

        if (req.user.role === 'citizen') {
            if (!req.body.start) {
                req.body.duration.start = report.duration.start.toISOString();
            }
            let dataCit = {
                'name': null,
                'info': null,
                'duration': {
                    'start': null,
                    'end': null,
                },
                'photos': null,
                'status': null
            }

            Object.keys(dataCit).forEach(key => {
                if (req.body.hasOwnProperty(key)) {
                    dataCit[key] = req.body[key];
                }
            });

            data = Object.fromEntries(Object.entries(dataCit).filter(([_, v]) => v != null));

        } else if (req.user.role === 'admin') {

            let dataAdm = {
                'status': null
            }

            Object.keys(dataAdm).forEach(key => {
                if (req.body.hasOwnProperty(key)) {
                    dataAdm[key] = req.body[key];
                }
            });

            data = Object.fromEntries(Object.entries(dataAdm).filter(([_, v]) => v != null));

        } else {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Non puoi modificare segnalazioni senza essere autenticato.'));
        }
        await service.updateReport(id, data);
        res.status(204).json(null);
    } catch (error) {
        res.status(error.code || 500).json(error);
    }
});

router.post('/:id/comments', tokenChecker, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;

    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire un commento nel corpo della richiesta.'));
    }

    if (!validator.validateComment(req.body.text)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il commento non può essere vuoto, deve contenere al massimo 200 caratteri e può includere lettere, numeri, spazi e alcuni simboli.'));
    }

    try {
        const comment = await service.createComment(id, userId, req.body.text);
        res.status(201).json(comment);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.get('/:id/comments', async (req, res) => {
    const reportId = req.params.id;
    const offset = toValidInt(req.query.offset);
    const limit = toValidInt(req.query.limit);

    try {
        const comments = await service.getCommentsByReportid(reportId, offset, limit);
        res.status(200).json(comments);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;