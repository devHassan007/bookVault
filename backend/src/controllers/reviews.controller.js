const reviewsService = require('../services/reviews.service');
const { httpError } = require('../utils/httpError');

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
            return next(httpError(404, 'Review not found', 'NOT_FOUND'));
        }
        res.status(200).json(review);
    } catch (err) { next(err); }
}

async function patch(req, res, next) {
    try {
        const review = await reviewsService.updateReview(req.params.id, req.user.id, req.body);
        if (!review) return next(httpError(404, 'Review not found', 'NOT_FOUND'));
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