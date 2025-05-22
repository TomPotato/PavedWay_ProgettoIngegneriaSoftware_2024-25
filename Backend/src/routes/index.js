const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const userRoutes = require('./userRoutes');
const reportRoutes = require('./reportRoutes');
const siteRoutes = require('./siteRoutes');

router.use('/auth', authRoutes);
router.use('/users', userRoutes);
router.use('/reports', reportRoutes);
router.use('/sites', siteRoutes);

module.exports = router;