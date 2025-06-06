const express = require('express');
const router = express.Router();

const service = require('../services/PathService');

const createError = require('../utils/createError');
const toValidFloat = require('../utils/toValidFloat');

router.get('/', async (req, res) => {
    let model;

    if (!req.query.model || !['direct', 'alternate'].includes(req.query.model)) {
        model = 'direct';
    } else {
        model = req.query.model;
    }

    const sLat = toValidFloat(req.query.startLatitude);
    const sLon = toValidFloat(req.query.startLongitude);
    const eLat = toValidFloat(req.query.endLatitude);
    const eLon = toValidFloat(req.query.endLongitude);

    if (sLat === null || sLon === null || eLat === null || eLon === null) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire le coordinate di partenza e arrivo (latitudine e longitudine).'));
    }

    if (sLat < -90 || sLat > 90 || sLon < -180 || sLon > 180 ||
        eLat < -90 || eLat > 90 || eLon < -180 || eLon > 180) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Le coordinate devono essere valide: latitudine tra -90 e 90, longitudine tra -180 e 180.'));
    }

    try {
        const path = await service.getPath(sLat, sLon, eLat, eLon, model);
        res.status(200).json(path);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;