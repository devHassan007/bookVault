const reviewsService = require('../services/reviews.service');

async function create(req, res, next) {
    try {
        const review = await reviewsService.createReview(req.params.bookId, req.user.id, req.body);
        res.status(201).json(review);
    } catch (err) { next(err); }
}

async function list(req, res, next) {
    try {
        res.status(200).json(await reviewsService.listReviewsForBook(req.params.bookId));
    } catch (err) { next(err); }
}

async function getOne(req, res, next) {
    try {
        const review = await reviewsService.getReviewById(req.params.id);
        if (!review || review.book_id !== req.params.bookId) {
            return res.status(404).json({ error: { message: 'Review not found' } });
        }
        res.status(200).json(review);
    } catch (err) { next(err); }
}

async function patch(req, res, next) {
    try {
        const review = await reviewsService.updateReview(req.params.id, req.user.id, req.body);
        if (!review) return res.status(404).json({ error: { message: 'Review not found' } });
        res.status(200).json(review);
    } catch (err) { next(err); }
}

async function remove(req, res, next) {
    try {
        await reviewsService.deleteReview(req.params.id, req.user.id);
        res.status(204).send();
    } catch (err) { next(err); }
}

module.exports = { create, list, getOne, patch, remove };