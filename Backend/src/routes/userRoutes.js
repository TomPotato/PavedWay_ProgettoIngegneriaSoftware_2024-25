const express = require('express');
const router = express.Router();

const reportService = require('../services/ReportService');
const userService = require('../services/UserService');

const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');
const tokenChecker = require('../utils/tokenChecker');
const validator = require('../utils/Validator');

router.get('/', tokenChecker, async (req, res) => {
    const offset = toValidInt(req.query.offset);
    const limit = toValidInt(req.query.limit);

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Devi essere un amministratore per vedere l\'elenco degli utenti.'));
    }

    try {
        const users = await userService.getUsers(offset, limit);
        res.status(200).json(users);
    }
    catch (error) {
        res.status(error.code).json(error);
    }
});

router.post('/', tokenChecker, async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il corpo della richiesta non può essere vuoto. Devi fornire nome utente, nome, cognome, password, ruolo e email o ufficio.'));
    }

    if (!req.body.username || !req.body.name || !req.body.surname || !req.body.password || !req.body.role) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire nome utente, nome, cognome, password, ruolo e email o ufficio.'));
    }

    if (req.body.role !== 'citizen' && req.body.role !== 'admin') {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il ruolo deve essere "citizen" o "admin".'));
    }

    if (req.body.role === 'citizen' && !req.body.email) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire un\'email per il ruolo di cittadino.'));
    }

    if (req.body.role === 'admin' && !req.body.office) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire un ufficio per il ruolo di admin.'));
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

    if (!validator.validatePassword(req.body.password)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'La password deve contenere almeno 8 caratteri, una lettera, un numero e un carattere speciale.'));
    }

    if (req.body.role === 'citizen' && !validator.validateEmail(req.body.email)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'L\'indirizzo email deve essere nel formato corretto'));
    }

    try {
        const result = await userService.createUser(req.body);
        res.status(201).json(result);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.get('/:id/reports', async (req, res) => {
    const userId = req.params.id;
    const offset = toValidInt(req.query.offset);
    const limit = toValidInt(req.query.limit);

    try {
        const reports = await reportService.getReportsByUserId(userId, offset, limit);
        res.status(200).json(reports);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.delete('/:id', tokenChecker, async (req, res) => {
    const userId = req.params.id;

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato', 403,
            'Devi essere un amministratore per eliminare un utente.'));
    }

    try {
        await userService.deleteUser(userId);
        res.status(204).send();
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;