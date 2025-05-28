const express = require('express');
const router = express.Router();

const service = require('../services/NotificationService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const validator = require('../utils/Validator');

router.post('/', tokenChecker, async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire una notifica nel corpo della richiesta.'));
    }

    if (!req.body.message) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire un messaggio per la notifica.'));
    }

    if (!validator.validateNotification(req.body.message)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il messaggio della notifica deve avere una lunghezza tra 1 e 100 caratteri e non può contenere caratteri speciali.'));
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato', 403,
            'Devi essere un amministratore per creare una notifica.'));
    }

    try {
        const notification = await service.createNotification(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.get('/', async (req, res) => {

    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);
    if (offset < 0 || limit <= 0) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'I parametri di offset e limit devono essere numeri interi validi.'));
    }
    
    try {
        const notifications = await service.getNotifications();
        res.status(200).json(notifications);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;