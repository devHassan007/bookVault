const shelvesService = require('../services/shelves.service');

async function loadShelfAndVerifyOwnership(req, res, next) {
    try {
        const shelf = await shelvesService.getShelfById(req.params.id);
        if (!shelf || shelf.user_id !== req.user.id) {
            return res.status(404).json({ error: { message: 'Shelf not found' } });
        }
        req.shelf = shelf;
        next();
    } catch (err) { next(err); }
}

module.exports = { loadShelfAndVerifyOwnership };