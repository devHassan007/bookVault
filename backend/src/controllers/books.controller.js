const booksService = require('../services/books.service');
const reviewsService = require('../services/reviews.service');
const { httpError } = require('../utils/httpError');


async function create(req, res, next) {
    try {
        const book = await booksService.createBook(req.user.id, req.body);
        res.status(201).json(book);
    } catch (err) { next(err); }
}

async function list(req, res, next) {
    try {
        const result = await booksService.listBooks(req.user.id, req.query);
        res.status(200).json(result);
    } catch (err) { next(err); }
}

async function getOne(req, res, next) {
    try {
        const { averageRating, reviewCount } = await reviewsService.getAverageRating(req.book.id);
        res.status(200).json({ ...req.book, averageRating, reviewCount });
    } catch (err) { next(err); }
}

async function patch(req, res, next) {
    try {
        const book = await booksService.updateBookPartial(req.params.id, req.user.id, req.body);
        if (!book) return next(httpError(404, 'Book not found', 'NOT_FOUND'));
        res.status(200).json(book);
    } catch (err) { next(err); }
}

async function put(req, res, next) {
    try {
        const book = await booksService.putBook(req.params.id, req.user.id, req.body);
        if (!book) return next(httpError(404, 'Book not found', 'NOT_FOUND'));
        res.status(200).json(book);
    } catch (err) { next(err); }
}

async function remove(req, res, next) {
    try {
        await booksService.deleteBook(req.params.id, req.user.id);
        res.status(204).send();
    } catch (err) { next(err); }
}

module.exports = { create, list, getOne, patch, put, remove };