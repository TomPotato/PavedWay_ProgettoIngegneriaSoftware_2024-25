const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const reportRoutes = require('./reportRoutes');
const siteRoutes = require('./siteRoutes');

const geocodeRoute = require('./geocodeRoute');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/sites', siteRoutes);

router.use('/geocode', geocodeRoute);

module.exports = router;