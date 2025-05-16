const express = require('express');
const router = express.Router();
const createError = require('../utils/createError');
const toValidInt = require('../utils/toValidInt');
const { SiteService } = require('../services/SiteService');

router.get('/', async (req, res) => {
    try {
        res.status(200).json(sites);
    } catch (error) {
        console.error('Error fetching reports:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

module.exports = router;