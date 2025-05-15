const express = require('express');
const router = express.Router();

const eventRoutes = require('./eventRoutes');
const userRoutes = require('./userRoutes');

router.use('/events', eventRoutes);
router.use('/users', userRoutes);

module.exports = router;
