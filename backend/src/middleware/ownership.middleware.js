const booksService = require('../services/books.service');

function loadBookAndVerifyOwnership(paramName = 'id') {
    return async function (req, res, next) {
        try {
            const book = await booksService.getBookById(req.params[paramName]);
            if (!book || book.user_id !== req.user.id) {
                return res.status(404).json({ error: { message: 'Book not found' } });
            }
            req.book = book;
            next();
        } catch (err) { next(err); }
    };
}

module.exports = { loadBookAndVerifyOwnership };