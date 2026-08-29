const express = require('express');
const errorHandler = require('./middleware/errorHandler.middleware');

const app = express();
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use(errorHandler);

module.exports = app;