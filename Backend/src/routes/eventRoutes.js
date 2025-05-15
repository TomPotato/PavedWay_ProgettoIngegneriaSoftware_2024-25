const express = require('express');
const router = express.Router();
const service = require('../services/EventService');
const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    try {
        const events = await service.getEvents(offset, limit);
        res.status(200).json(events);
    } catch (error) {
        res.status(500).json(createError('[GET /reports] Errore', 500, error.message));
    }
});

module.exports = router;