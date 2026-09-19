const express = require('express');
const authMiddleware = require('../middleware/auth.middleware');
const controller = require('../controllers/stats.controller');

const router = express.Router();
router.get('/me/stats', authMiddleware, controller.getMyStats);

module.exports = router;