const statsService = require('../services/stats.service');

async function getMyStats(req, res, next) {
    try {
        res.status(200).json(await statsService.getUserStats(req.user.id));
    } catch (err) { next(err); }
}

module.exports = { getMyStats };