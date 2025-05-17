const express = require('express');
const router = express.Router();

//const userRoutes = require('./userRoutes');
const siteRoutes = require('./siteRoutes');

//router.use('/users', userRoutes);
router.use('/sites', siteRoutes);

module.exports = router;