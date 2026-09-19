const express = require('express');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { loadShelfAndVerifyOwnership } = require('../middleware/shelfOwnership.middleware');
const { loadBookAndVerifyOwnership } = require('../middleware/ownership.middleware');
const { createShelfSchema, updateShelfSchema } = require('../validators/shelves.validator');
const controller = require('../controllers/shelves.controller');

const router = express.Router();
router.use(authMiddleware);

router.post('/', validate(createShelfSchema), controller.create);
router.get('/', controller.list);
router.get('/:id', loadShelfAndVerifyOwnership, controller.getOne);
router.patch('/:id', loadShelfAndVerifyOwnership, validate(updateShelfSchema), controller.patch);
router.delete('/:id', loadShelfAndVerifyOwnership, controller.remove);

router.put('/:id/books/:bookId', loadShelfAndVerifyOwnership, loadBookAndVerifyOwnership('bookId'), controller.addBook);
router.delete('/:id/books/:bookId', loadShelfAndVerifyOwnership, controller.removeBook);

module.exports = router;