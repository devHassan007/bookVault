const booksService = require('../services/books.service');

async function loadBookAndVerifyOwnership(req, res, next) {
    try {
        const book = await booksService.getBookById(req.params.id);
        // 404 either way — avoids confirming to an attacker that this id exists at all
        if (!book || book.user_id !== req.user.id) {
            return res.status(404).json({ error: { message: 'Book not found' } });
        }
        req.book = book;
        next();
    } catch (err) { next(err); }
}

module.exports = { loadBookAndVerifyOwnership };