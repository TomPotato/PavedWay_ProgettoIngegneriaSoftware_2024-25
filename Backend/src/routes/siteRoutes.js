const express = require('express');
const router = express.Router();
const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');
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

module.exports = router;