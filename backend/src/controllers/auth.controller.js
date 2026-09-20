const authService = require('../services/auth.service');
const { generateAccessToken, generateRefreshTokenValue, hashToken } = require('../utils/token.util');
const { httpError } = require('../utils/httpError');

async function register(req, res, next) {
    try {
        const { email, password, name } = req.body;
        const existing = await authService.findUserByEmail(email);
        if (existing) return next(httpError(409, 'Email already registered', 'CONFLICT'));
        const user = await authService.createUser({ email, password, name });
        res.status(201).json(user);
    } catch (err) {
        if (err.code === '23505') return next(httpError(409, 'Email already registered', 'CONFLICT'));
        next(err);
    }
}

async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const user = await authService.findUserByEmail(email);
        if (!user) return next(httpError(401, 'Invalid email or password', 'UNAUTHORIZED'));
        const valid = await authService.verifyPassword(user, password);
        if (!valid) return next(httpError(401, 'Invalid email or password', 'UNAUTHORIZED'));

        const accessToken = generateAccessToken(user.id);
        const refreshToken = generateRefreshTokenValue();
        await authService.storeRefreshToken(user.id, refreshToken);

        res.status(200).json({ accessToken, refreshToken, user: { id: user.id, email: user.email, name: user.name } });
    } catch (err) { next(err); }
}

async function refresh(req, res, next) {
    try {
        const { refreshToken } = req.body;
        const record = await authService.findValidRefreshToken(refreshToken);
        if (!record) return next(httpError(401, 'Invalid or expired refresh token', 'UNAUTHORIZED'));

        await authService.revokeRefreshTokenByHash(hashToken(refreshToken));
        const newRefreshToken = generateRefreshTokenValue();
        await authService.storeRefreshToken(record.user_id, newRefreshToken);
        const accessToken = generateAccessToken(record.user_id);

        res.status(200).json({ accessToken, refreshToken: newRefreshToken });
    } catch (err) { next(err); }
}

async function logout(req, res, next) {
    try {
        await authService.revokeRefreshTokenByHash(hashToken(req.body.refreshToken));
        res.status(204).send();
    } catch (err) { next(err); }
}

module.exports = { register, login, refresh, logout };