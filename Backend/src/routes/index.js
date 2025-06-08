const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const reportRoutes = require('./reportRoutes');
const siteRoutes = require('./siteRoutes');
const pathRoutes = require('./pathRoutes');
const locationRoutes = require('./locationRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/authentication', authRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/sites', siteRoutes);
router.use('/paths', pathRoutes);
router.use('/locations', locationRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;