const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const reportRoutes = require('./reportRoutes');
const siteRoutes = require('./siteRoutes');
const notificationRoutes = require('./notificationRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/sites', siteRoutes);
router.use('/notifications', notificationRoutes);

module.exports = router;