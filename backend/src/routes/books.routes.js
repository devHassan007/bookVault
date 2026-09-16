const express = require('express');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { loadBookAndVerifyOwnership } = require('../middleware/ownership.middleware');
const { createBookSchema, updateBookSchema } = require('../validators/books.validator');
const controller = require('../controllers/books.controller');

const router = express.Router();
router.use(authMiddleware); // every book route requires a valid access token

router.post('/', validate(createBookSchema), controller.create);
router.get('/', controller.list);
router.get('/:id', loadBookAndVerifyOwnership, controller.getOne);
router.patch('/:id', loadBookAndVerifyOwnership, validate(updateBookSchema), controller.patch);
router.put('/:id', loadBookAndVerifyOwnership, validate(createBookSchema), controller.put);
router.delete('/:id', loadBookAndVerifyOwnership, controller.remove);

module.exports = router;