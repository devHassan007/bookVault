const express = require('express');
const validate = require('../middleware/validate.middleware');
const authMiddleware = require('../middleware/auth.middleware');
const { loadBookAndVerifyOwnership } = require('../middleware/ownership.middleware');
const controller = require('../controllers/books.controller');
const validateQuery = require('../middleware/validateQuery.middleware');
const { createBookSchema, updateBookSchema, listBooksQuerySchema } = require('../validators/books.validator');
const router = express.Router();
router.use(authMiddleware); // every book route requires a valid access token

router.post('/', validate(createBookSchema), controller.create);
router.get('/', validateQuery(listBooksQuerySchema), controller.list);
router.get('/:id', loadBookAndVerifyOwnership(), controller.getOne);
router.patch('/:id', loadBookAndVerifyOwnership(), validate(updateBookSchema), controller.patch);
router.put('/:id', loadBookAndVerifyOwnership(), validate(createBookSchema), controller.put);
router.delete('/:id', loadBookAndVerifyOwnership(), controller.remove);
module.exports = router;