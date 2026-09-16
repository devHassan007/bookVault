const express = require('express');
const errorHandler = require('./middleware/errorHandler.middleware');
const booksRoutes = require('./routes/books.routes');
const app = express();
app.use(express.json());
const authRoutes = require('./routes/auth.routes');
app.use('/api/v1/auth', authRoutes);

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use('/api/v1/books', booksRoutes);
app.use(errorHandler);

module.exports = app;