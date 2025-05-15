const express = require('express');
const router = express.Router();

const reportRoutes = require('./reportRoutes');

router.use('/reports', reportRoutes);

module.exports = router;
