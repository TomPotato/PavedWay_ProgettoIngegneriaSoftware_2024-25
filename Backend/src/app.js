const express = require('express');
const cors = require('cors');
const path = require('path');
const routes = require('./routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '2mb' }))
app.use('/api/v1', routes);


const FRONTEND = process.env.FRONTEND || path.join(__dirname, '..', '..', 'Frontend', 'dist');
app.use('/', express.static(FRONTEND));

app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(FRONTEND, 'index.html'));
});

/* Default 404 handler */
app.use((req, res) => {
    res.status(404);
    res.json({ error: 'Not found' });
});

/* Default error handler */
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;
