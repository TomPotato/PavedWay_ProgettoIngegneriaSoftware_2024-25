const express = require('express');
const router = express.Router();

const service = require('../services/SiteService');

const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');
const tokenChecker = require('../utils/tokenChecker');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    try {
        const sites = await service.getSites(offset, limit);
        res.status(200).json(sites);
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
        return res.status(403).json(createError('Non autorizzato', 403, 
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
        res.status(204).json(site);
    } catch (error) {
        if (error.code === 400) {
            return res.status(400).json(error);
        }
        res.status(500).json(error);
    }
});

module.exports = router;