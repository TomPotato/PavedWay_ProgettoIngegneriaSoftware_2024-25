const express = require('express');
const router = express.Router();
const service = require('../services/SiteService');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    try {
        const sites = await service.getSites(offset, limit);
        res.status(200).json(sites);
    } catch (error) {
        res.status(500).json(createError('Errore interno del server', 500, error.message));
    }
});

router.post('/', async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire un cantiere nel corpo della richiesta.'));
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Non autorizzato', 403, 'Devi essere un amministratore per creare un cantiere.'));
    }

    try {
        const site = await service.createSite(req.body);
        res.status(201).json(site);
    } catch (error) {
        // TODO
        res.status(500).json(createError('Errore interno del server', 500, error.message));
    }
});

module.exports = router;