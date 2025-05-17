const express = require('express');
const router = express.Router();

const service = require('../services/AuthService');

const createError = require('../utils/createError');

router.post('/login', async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il corpo della richiesta non può essere vuoto. Devi fornire nome utente e password.'));
    }

    if (!req.body.username || !req.body.password) {
        return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire nome utente e password.'));
    }

    try {
        const token = await service.authenticate(req.body.username, req.body.password);
        res.status(200).json({ token });
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;