const express = require('express');
const errorHandler = require('./middleware/errorHandler.middleware');
const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const shelvesRoutes = require('./routes/shelves.routes');
const usersRoutes = require('./routes/users.routes');
const { mutationLimiter } = require('./middleware/rateLimit.middleware');
const cors = require('cors');
const config = require('./config');
const morgan = require('morgan');
const app = express();
app.use(express.json({ limit: '100kb' }));

morgan.token('user', (req) => (req.user ? req.user.id : 'anon'));
app.use(morgan(':method :url :status :response-time ms - user=:user'));

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});
app.use(mutationLimiter);
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books/:bookId/reviews', reviewsRoutes);
app.use('/api/v1/books', booksRoutes);
app.use('/api/v1/shelves', shelvesRoutes);
app.use('/api/v1/users', usersRoutes);
app.use(cors({ origin: config.allowedOrigin, credentials: true }));
app.use(errorHandler);

module.exports = app;