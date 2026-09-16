const booksService = require('../services/books.service');

async function create(req, res, next) {
    try {
        const book = await booksService.createBook(req.user.id, req.body);
        res.status(201).json(book);
    } catch (err) { next(err); }
}

async function list(req, res, next) {
    try {
        res.status(200).json(await booksService.listBooks(req.user.id));
    } catch (err) { next(err); }
}

async function getOne(req, res) {
    res.status(200).json(req.book); // loaded + ownership-checked by ownership.middleware.js
}

async function patch(req, res, next) {
    try {
        const book = await booksService.updateBookPartial(req.params.id, req.user.id, req.body);
        if (!book) return res.status(404).json({ error: { message: 'Book not found' } });
        res.status(200).json(book);
    } catch (err) { next(err); }
}

async function put(req, res, next) {
    try {
        const book = await booksService.putBook(req.params.id, req.user.id, req.body);
        if (!book) return res.status(404).json({ error: { message: 'Book not found' } });
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