const rateLimit = require('express-rate-limit');

const mutationLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    skip: (req) => req.method === 'GET',
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests, please try again later.' } },
});

module.exports = { mutationLimiter };