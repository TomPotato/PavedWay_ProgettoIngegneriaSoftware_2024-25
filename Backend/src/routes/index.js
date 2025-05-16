const express = require('express');
const router = express.Router();

const eventRoutes = require('./eventRoutes');
const userRoutes = require('./userRoutes');
const siteRoutes = require('./siteRoutes');

router.use('/events', eventRoutes);
router.use('/users', userRoutes);
router.use('/site', siteRoutes);

module.exports = router;