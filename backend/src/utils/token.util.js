const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config');

function generateAccessToken(userId) {
    return jwt.sign({ sub: userId }, config.jwtAccessSecret, { expiresIn: '15m' });
}

function verifyAccessToken(token) {
    return jwt.verify(token, config.jwtAccessSecret);
}

function generateRefreshTokenValue() {
    return crypto.randomBytes(40).toString('hex');
}

function hashToken(token) {
    return crypto.createHash('sha256').update(token).digest('hex');
}

module.exports = { generateAccessToken, verifyAccessToken, generateRefreshTokenValue, hashToken };