const express = require('express');
const routes = require('./routes');

const app = express();

// TESTING VUE
const cors = require('cors');
app.use(cors(
    {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        credentials: true,
    }
));

app.use(express.json());
app.use('/api/v1', routes);

module.exports = app;
