const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();

app.use(express.json({ limit: '2mb' }))
app.use('/api/v1', routes);

app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PATCH', 'DELETE'],
        credentials: true,
    }
));

const FRONTEND = process.env.FRONTEND || Path.join(__dirname, '..', '..', 'Frontend');
app.use('/PavedWayApp/', express.static(FRONTEND));
app.use('/', express.static('static'));

module.exports = app;
