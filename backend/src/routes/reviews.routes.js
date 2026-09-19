const express = require('express');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { loadBookAndVerifyOwnership } = require('../middleware/ownership.middleware');
const { createReviewSchema, updateReviewSchema } = require('../validators/reviews.validator');
const controller = require('../controllers/reviews.controller');

const router = express.Router({ mergeParams: true }); // needed to see :bookId from the parent mount

router.use(authMiddleware);
router.use(loadBookAndVerifyOwnership('bookId')); // confirms the book exists and is yours, for every review route

router.post('/', validate(createReviewSchema, 422), controller.create);
router.get('/', controller.list);
router.get('/:id', controller.getOne);
router.patch('/:id', validate(updateReviewSchema, 422), controller.patch);
router.delete('/:id', controller.remove);

module.exports = router;