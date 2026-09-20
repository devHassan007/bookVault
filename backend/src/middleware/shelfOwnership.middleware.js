const shelvesService = require('../services/shelves.service');
const { httpError } = require('../utils/httpError');

async function loadShelfAndVerifyOwnership(req, res, next) {
    try {
        const shelf = await shelvesService.getShelfById(req.params.id);
        if (!shelf || shelf.user_id !== req.user.id) {
            return next(httpError(404, 'Shelf not found', 'NOT_FOUND'));
        }
        req.shelf = shelf;
        next();
    } catch (err) { next(err); }
}

module.exports = { loadShelfAndVerifyOwnership };