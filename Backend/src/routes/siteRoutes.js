const express = require('express');
const router = express.Router();

const service = require('../services/SiteService');

const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');
const tokenChecker = require('../utils/tokenChecker');
const validator = require('../utils/Validator');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    if (req.query.now === 'true' && req.query.date) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire solo una data o il parametro "now" con valore "true".'));
    }

    let date = null;
    if (req.query.date) {
        if (!validator.validateDate(req.query.date)) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire una data valida in formato ISO 8601.'));
        }
        date = req.query.date;
    } else if (req.query.now === 'true') {
        date = new Date().toISOString();
    }

    try {
        if (date) {
            const sites = await service.getActiveSites(offset, limit, date);
            return res.status(200).json(sites);
        } else {
            const sites = await service.getSites(offset, limit);
            return res.status(200).json(sites);
        }
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.post('/', tokenChecker, async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire un cantiere nel corpo della richiesta.'));
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Devi essere un amministratore per creare un cantiere.'));
    }

    try {
        const site = await service.createSite(req.body);
        res.status(201).json(site);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.patch('/:id', tokenChecker, async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire le informazioni nel corpo della richiesta.'));
    }

    try {
        const site = await service.updateSite(req.body, req.params.id);
        res.status(200).json(site);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.delete('/:id', tokenChecker, async (req, res) => {
    const id = req.params.id;

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Devi essere un amministratore per eliminare un cantiere.'));
    }

    try {
        await service.deleteSite(id);
        res.status(204).json(null);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;