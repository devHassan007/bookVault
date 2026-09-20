const booksService = require('../services/books.service');
const { httpError } = require('../utils/httpError');

function loadBookAndVerifyOwnership(paramName = 'id') {
    return async function (req, res, next) {
        try {
            const book = await booksService.getBookById(req.params[paramName]);
            if (!book || book.user_id !== req.user.id) {
                return next(httpError(404, 'Book not found', 'NOT_FOUND'));
            }
            req.book = book;
            next();
        } catch (err) { next(err); } // DB errors (e.g. bad UUID) still fall through to pgErrors.js
    };
}

module.exports = { loadBookAndVerifyOwnership };