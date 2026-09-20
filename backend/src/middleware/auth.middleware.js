const { verifyAccessToken } = require('../utils/token.util');
const { httpError } = require('../utils/httpError');

module.exports = function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return next(httpError(401, 'Missing or invalid Authorization header', 'UNAUTHORIZED'));
    }
    try {
        const payload = verifyAccessToken(header.slice(7));
        req.user = { id: payload.sub };
        next();
    } catch (err) {
        next(httpError(401, 'Invalid or expired token', 'UNAUTHORIZED'));
    }
};