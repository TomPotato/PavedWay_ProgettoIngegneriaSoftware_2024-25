const express = require('express');
const router = express.Router();

const service = require('../services/ReportService');

const createError = require('../utils/createError');
const tokenChecker = require('../utils/tokenChecker');
const toValidInt = require('../utils/toValidInt');

router.get('/', async (req, res) => {
    offset = toValidInt(req.query.offset);
    limit = toValidInt(req.query.limit);

    try {
        const reports = await service.getReports(offset, limit);
        res.status(200).json(reports);
    } catch (error) {
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

        if (req.user.role === 'citizen' && req.user.id !== report.userId) {
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

        //inserire un json(?)/array(?) per il contro controllo che non stia cercando di inserire altro oltre ai dati che vogliamo,
        // for each per ogni valore nell'array per riempire data e passarglielo al posto di req.body, nel caso sia admin si modifica
        //  solamente lo status della segnalazione e se cittadino può modificare solamente dei campi definiti
        const id = req.params.id;

        if (!req.body) {
            return res.status(400).json(createError('Richiesta non valida', 400, 'Devi fornire le informazioni nel corpo della richiesta.'));
        }

        if (req.user.role !== 'admin' && req.body.status !== null) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Devi essere un amministratore per modificare questo dato'));
        }

        if (req.user.role === 'citizen' && req.user.id !== report.userId) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Puoi modificare solo le segnalazioni che hai creato.'));
        }

        if (req.user.role === 'admin' && (req.body.name || req.body.info ||
            req.body.duration || req.body.photos )) {
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Non puoi modificare una segnalazione, solo approvarla o rifiutarla.'));
        }
        try {

            let data = null;

            if(req.user.role === 'citizen'){

                let dataCit = {
                    'name':null,
                    'info':null,
                    'duration':null,
                    'photos':null
                }
                
                Object.keys(dataCit).forEach(key => {
                    if(req.body.hasOwnProperty(key)){
                        dataCit[key] = req.body[key];
                    }
                });

                data = Object.fromEntries(Object.entries(dataCit).filter(([_, v]) => v != null));

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

            }else 
            return res.status(403).json(createError('Accesso negato. ', 403,
                'Non puoi modificare segnalazioni senza essere autenticato.'));

            await service.updateReport(id, data);
            res.status(204).json(null);
    } catch (error) {
        res.status(error.code).json(error);
    }
});

module.exports = router;