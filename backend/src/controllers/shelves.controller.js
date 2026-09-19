const shelvesService = require('../services/shelves.service');

async function create(req, res, next) {
    try {
        res.status(201).json(await shelvesService.createShelf(req.user.id, req.body.name));
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: { message: 'You already have a shelf with this name' } });
        next(err);
    }
}

async function list(req, res, next) {
    try {
        res.status(200).json(await shelvesService.listShelves(req.user.id));
    } catch (err) { next(err); }
}

async function getOne(req, res, next) {
    try {
        const books = await shelvesService.listBooksOnShelf(req.shelf.id);
        res.status(200).json({ ...req.shelf, books });
    } catch (err) { next(err); }
}

async function patch(req, res, next) {
    try {
        const shelf = await shelvesService.updateShelf(req.params.id, req.user.id, req.body);
        if (!shelf) return res.status(404).json({ error: { message: 'Shelf not found' } });
        res.status(200).json(shelf);
    } catch (err) {
        if (err.code === '23505') return res.status(409).json({ error: { message: 'You already have a shelf with this name' } });
        next(err);
    }
}

async function remove(req, res, next) {
    try {
        await shelvesService.deleteShelf(req.params.id, req.user.id);
        res.status(204).send();
    } catch (err) { next(err); }
}

async function addBook(req, res, next) {
    try {
        await shelvesService.addBookToShelf(req.shelf.id, req.book.id);
        res.status(200).json({ message: 'Book is on this shelf' }); // 200 whether just-added or already there — true idempotency
    } catch (err) { next(err); }
}

async function removeBook(req, res, next) {
    try {
        await shelvesService.removeBookFromShelf(req.shelf.id, req.params.bookId);
        res.status(204).send();
    } catch (err) { next(err); }
}

module.exports = { create, list, getOne, patch, remove, addBook, removeBook };