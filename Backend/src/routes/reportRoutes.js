const express = require('express');
const router = express.Router();

const service = require('../services/ReportService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const toValidInt = require('../utils/toValidInt');
const validator = require('../utils/Validator');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    let date;

    if (req.query.now === 'true' && req.query.date) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire solo una data o il parametro "now" con valore "true".'));
    }

    if (req.query.date) {
        if (!validator.validateDate(req.query.date)) {
            return res.status(400).json(createError('Richiesta non valida', 400,
                'Devi fornire una data valida in formato ISO 8601.'));
        }
        date = req.query.date;
    } else if (req.query.now === 'true') {
        date = new Date().toISOString();
    }

    let latitude;
    let longitude;
    let radius;

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

    let userId;

    if (req.query.my) {
        try {
            await new Promise((resolve, reject) => {
                tokenChecker(req, res, (err) => {
                    if (err) return reject(createError('Token non valido', 401, 'Autenticazione richiesta.'));
                    resolve();
                });
            });
            userId = req.user.id;   
        } catch (error) {
            return res.status(error.code || 401).json(error);
        }
    }

    try {
        if (date && !longitude && !latitude && !radius && !userId) {
            const reports = await service.getActiveReports(date, offset, limit);
            return res.status(200).json(reports);
        } else if(longitude && latitude && radius && !date && !userId) {
            const reports = await service.getReportsByLocation(latitude, longitude, radius, offset, limit);
            return res.status(200).json(reports);
        } else if(longitude && latitude && radius && date && !userId){
            const reports = await service.getActiveReportsByLocation(latitude, longitude, radius, date, offset, limit);
            return res.status(200).json(reports);
        }else if(userId && !longitude && !latitude && !radius && !date){
            const reports = await service.getReportsByUserId(userId, offset, limit);
            return res.status(200).json(reports);
        } else if (date && userId && !longitude && !latitude && !radius) {
            const reports = await service.getActiveReportsByUserId(userId, date, offset, limit);
            return res.status(200).json(reports);
        }else if(userId && longitude && latitude && radius && !date){
            const reports = await service.getReportsByUserIdByLoc(userId,latitude, longitude, radius, offset, limit);
            return res.status(200).json(reports);
        }else if(date && userId && longitude && latitude && radius){
            const reports = await service.getActiveReportsByUserIdByLoc(userId, latitude, longitude, radius, date, offset, limit);
            return res.status(200).json(reports);
        } else {
            const reports = await service.getReports(offset, limit);
            return res.status(200).json(reports);
        }
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error);
    }
});

router.get('/:id', async (req, res) => {
    const id = req.params.id;

    try {
        const report = await service.getReportById(id);
        res.status(200).json(report);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.post('/', tokenChecker, async (req, res) => {
    if (!req.body) {
        return res.status(400).json(createError('Richiesta non valida', 400,
            'Devi fornire una segnalazione nel corpo della richiesta.'));
    }

    req.body.createdBy = req.user.id;

    try {
        const site = await service.createReport(req.body);
        res.status(201).json(site);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.delete('/:id', tokenChecker, async (req, res) => {
    const id = req.params.id;

    try {
        const report = await service.getReportById(id);

        if (req.user.role === 'citizen' && req.user.id !== report.createdBy.toString()) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Puoi eliminare solo le segnalazioni che hai creato.'));
        }

        await service.deleteReport(id);
        res.status(204).json(null);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

router.patch('/:id', tokenChecker, async (req, res) => {
        
        console.log('passa1');

        const id = req.params.id;
        const report = await service.getReportById(id);

        if (!req.body) {
            return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire le informazioni nel corpo della richiesta.'));
        }
        
        if(req.body.status){
            if (req.user.role !== 'admin' && req.body.status !== 'solved') {
                return res.status(403).json(createError('Accesso negato. ', 403,
                    'Devi essere un amministratore per modificare questo dato'));
            }
        }

        if (req.user.role === 'citizen' && req.user.id !== report.createdBy.toString()) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Puoi modificare solo le segnalazioni che hai creato.'));
        }

        if (req.user.role === 'admin' && (req.body.name || req.body.info ||
            req.body.duration || req.body.photos )) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Non puoi modificare una segnalazione, solo approvarla o rifiutarla.'));
        }
        
        console.log('passa');

        console.log(req);

        try {

            let data = null;

            if(req.user.role === 'citizen'){
                console.log('passa');
                if(!req.body.start){
                    req.body.duration.start = report.duration.start.toISOString();
                }
                let dataCit = {
                    'name': null,
                    'info': null,
                    'duration': {
                        'start' : null,
                        'end' : null,
                    },
                    'photos': null,
                    'status': null
                }
                
                Object.keys(dataCit).forEach(key => {
                    if(req.body.hasOwnProperty(key)){
                        dataCit[key] = req.body[key];
                    }
                });

                data = Object.fromEntries(Object.entries(dataCit).filter(([_, v]) => v != null));

                console.log(data);

            }else if (req.user.role === 'admin'){

                let dataAdm = {
                    'status':null
                }

                Object.keys(dataAdm).forEach(key => {
                    if(req.body.hasOwnProperty(key)){
                        dataAdm[key] = req.body[key];
                    }
                });

                data = Object.fromEntries(Object.entries(dataAdm).filter(([_, v]) => v != null));

            }else {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Non puoi modificare segnalazioni senza essere autenticato.'));
            }
            await service.updateReport(id, data);
            res.status(204).json(null);
    } catch (error) {
        console.log(error);
        res.status(error.code).json(error);
    }
});

module.exports = router;