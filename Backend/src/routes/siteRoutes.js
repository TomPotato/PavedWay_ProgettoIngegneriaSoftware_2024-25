const express = require('express');
const router = express.Router();

const service = require('../services/SiteService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const toValidInt = require('../utils/toValidInt');

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
        return res.status(403).json(createError('Accesso negato. ', 403,
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

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Devi essere un amministratore per modificare un cantiere.'));
    }

    if(req.body.id || req.body.location || req.body.createdAt || req.body.comments ){
        return res.status(403).json(createError('Accesso Negato',403, 
            'Non sei autorizzato a modificare questa informazione.'));
        }

    try {

        let data = {
            'name':null,
            'info':null,
            'duration':null,
            'companyName':null,
            'realDuration':null
        }

        Object.keys(data).forEach(key => {
            if(req.body.hasOwnProperty(key)){
                data[key] = req.body[key];
            }
        });

        data = Object.fromEntries(Object.entries(data).filter(([_, v]) => v != null));

        const site = await service.updateSite(req.params.id, data);
        res.status(200).json(site);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.delete('/:id', tokenChecker, async (req, res) => {
    const id = req.params.id;

    if (req.user.role !== 'admin') {
        return res.status(403).json(createError('Accesso negato. ', 403,
            'Devi essere un amministratore per eliminare un cantiere.'));
    }

    try {
        await service.deleteSite(id);
        res.status(204).json(null);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;