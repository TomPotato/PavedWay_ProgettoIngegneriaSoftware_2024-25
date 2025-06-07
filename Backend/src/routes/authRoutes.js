const express = require('express');
const router = express.Router();

const service = require('../services/AuthService');

const createError = require('../utils/createError');
const validator = require('../utils/Validator');

router.post('/', async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il corpo della richiesta non può essere vuoto. Devi fornire nome utente e password.'));
    }

    if (!req.body.username || !req.body.password) {
        return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire nome utente e password.'));
    }

    try {
        const result = await service.login(req.body.username, req.body.password);
        res.status(200).json(result);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;