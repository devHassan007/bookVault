const pool = require('../db/pool');
const bcrypt = require('bcrypt');
const { hashToken } = require('../utils/token.util');

const REFRESH_TOKEN_TTL_DAYS = 7;

async function findUserByEmail(email) {
    const { rows } = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return rows[0] || null;
}

async function createUser({ email, password, name }) {
    const passwordHash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
        `INSERT INTO users (email, password_hash, name) VALUES ($1,$2,$3)
     RETURNING id, email, name, created_at`,
        [email, passwordHash, name || null]
    );
    return rows[0];
}

async function verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
}

async function storeRefreshToken(userId, rawToken) {
    const tokenHash = hashToken(rawToken);
    const expiresAt = new Date(Date.now() + REFRESH_TOKEN_TTL_DAYS * 24 * 60 * 60 * 1000);
    await pool.query(
        `INSERT INTO refresh_tokens (user_id, token_hash, expires_at) VALUES ($1,$2,$3)`,
        [userId, tokenHash, expiresAt]
    );
}

async function findValidRefreshToken(rawToken) {
    const tokenHash = hashToken(rawToken);
    const { rows } = await pool.query(
        `SELECT * FROM refresh_tokens
     WHERE token_hash = $1 AND revoked_at IS NULL AND expires_at > now()`,
        [tokenHash]
    );
    return rows[0] || null;
}

async function revokeRefreshTokenByHash(tokenHash) {
    await pool.query('UPDATE refresh_tokens SET revoked_at = now() WHERE token_hash = $1', [tokenHash]);
}

module.exports = {
    findUserByEmail, createUser, verifyPassword,
    storeRefreshToken, findValidRefreshToken, revokeRefreshTokenByHash,
};