const express = require('express');
const router = express.Router();

const service = require('../services/AuthService');

const createError = require('../utils/createError');
const validator = require('../utils/Validator');

router.post('/register', async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il corpo della richiesta non può essere vuoto. Devi fornire nome utente e password.'));
    }

    if (!req.body.username || !req.body.name || !req.body.surname || !req.body.email || !req.body.password) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire nome utente, nome, cognome, email e password.'));
    }

    if (!validator.validateUsername(req.body.username)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Lo username deve contenere solo lettere, numeri o underscore, e avere una lunghezza tra 3 e 20 caratteri.'));
    }

    if (!validator.validateName(req.body.name)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il nome deve contenere solo lettere e può includere spazi, apostrofi o trattini (minimo 2 caratteri).'));
    }

    if (!validator.validateName(req.body.surname)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il cognome deve contenere solo lettere e può includere spazi, apostrofi o trattini (minimo 2 caratteri).'));
    }

    if (!validator.validateEmail(req.body.email)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'L\'indirizzo email deve essere nel formato corretto'));
    }

    if (!validator.validatePassword(req.body.password)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'La password deve contenere almeno 8 caratteri, una lettera, un numero e un carattere speciale.'));
    }

    try {
        const result = await service.register(req.body.username, req.body.name, req.body.surname, req.body.email, req.body.password);
        res.status(201).json({ result });
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.post('/login', async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il corpo della richiesta non può essere vuoto. Devi fornire nome utente e password.'));
    }

    if (!req.body.username || !req.body.password) {
        return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire nome utente e password.'));
    }

    try {
        const result = await service.login(req.body.username, req.body.password);
        res.status(200).json({ result });
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;