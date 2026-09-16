const { verifyAccessToken } = require('../utils/token.util');

module.exports = function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ error: { message: 'Missing or invalid Authorization header' } });
    }
    try {
        const payload = verifyAccessToken(header.slice(7));
        req.user = { id: payload.sub };
        next();
    } catch (err) {
        return res.status(401).json({ error: { message: 'Invalid or expired token' } });
    }
};