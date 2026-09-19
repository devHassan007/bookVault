const express = require('express');
const errorHandler = require('./middleware/errorHandler.middleware');
const authRoutes = require('./routes/auth.routes');
const booksRoutes = require('./routes/books.routes');
const reviewsRoutes = require('./routes/reviews.routes');
const shelvesRoutes = require('./routes/shelves.routes');
const usersRoutes = require('./routes/users.routes');

const app = express();
app.use(express.json());

app.get('/api/v1/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/books/:bookId/reviews', reviewsRoutes); // mounted before /books — more specific path
app.use('/api/v1/books', booksRoutes);
app.use('/api/v1/shelves', shelvesRoutes);
app.use('/api/v1/users', usersRoutes);

app.use(errorHandler); // always last

module.exports = app;