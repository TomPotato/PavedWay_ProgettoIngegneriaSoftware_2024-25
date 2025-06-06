const express = require('express');
const router = express.Router();

const service = require('../services/SiteService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const toValidInt = require('../utils/toValidInt');
const validator = require('../utils/Validator');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    if (req.query.now === 'true' && req.query.date) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire solo una data o il parametro "now" con valore "true".'));
    }

    let date = null;
    if (req.query.date) {
        if (!validator.validateDate(req.query.date)) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire una data valida in formato ISO 8601.'));
        }
        date = req.query.date;
    } else if (req.query.now === 'true') {
        date = new Date().toISOString();
    }

    let latitude = null;
    let longitude = null;
	let radius = null;

    if(req.query.latitude && req.query.longitude){
        if (!validator.validateLocation(Number(req.query.latitude) , Number(req.query.longitude))) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire una location valida.'));
        }
        latitude = Number(req.query.latitude);
        longitude = Number(req.query.longitude);
    }

	if(req.query.radius){
		if(!validator.validateRadius(Number(req.query.radius))){
			return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire un raggio entro cui cercare che sia maggiore di 0 e minore di 5000.'));
		}
		radius = Number(req.query.radius);
	}

    try {
        if (date && !latitude && !longitude && !radius) {
            const sites = await service.getActiveSites(date, offset, limit);
            return res.status(200).json(sites);
        } else if(longitude && latitude && radius && date === null) {
			const sites = await service.getSitesByLocation(latitude, longitude, radius, offset, limit);
			return res.status(200).json(sites);
		} else if(longitude && latitude && radius && date){
			const sites = await service.getActiveSitesByLocation(latitude, longitude, radius, date, offset, limit);
			return res.status(200).json(sites);
        }else {
            const sites = await service.getSites(offset, limit);
            return res.status(200).json(sites);
        }
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
        return res.status(403).json(createError('Accesso negato.', 403,
            'Devi essere un amministratore per modificare un cantiere.'));
    }

    if (req.body.id || req.body.location || req.body.createdAt || req.body.comments) {
        return res.status(403).json(createError('Accesso Negato', 403,
            'Non sei autorizzato a modificare questa informazione.'));
    }

    try {

        let data = {
            'name': null,
            'info': null,
            'duration': null,
            'companyName': null,
            'realDuration': null
        }

        Object.keys(data).forEach(key => {
            if (req.body.hasOwnProperty(key)) {
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

router.post('/:id/comments', tokenChecker, async (req, res) => {
    const id = req.params.id;
    const userId = req.user.id;

    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire un commento nel corpo della richiesta.'));
    }

    if (!validator.validateComment(req.body.text)) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Il commento non può essere vuoto, deve contenere al massimo 200 caratteri e può includere lettere, numeri, spazi e alcuni simboli.'));
    }

    try {
        const site = await service.createComment(id, userId, req.body.text);
        res.status(201).json(site);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.get('/:id/comments', async (req, res) => {
    const siteID = req.params.id;
    const offset = toValidInt(req.query.offset);
    const limit = toValidInt(req.query.limit);

    try {
        const comments = await service.getCommentsBySiteid(siteID, offset, limit);
        res.status(200).json(comments);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;