const pool = require('../db/pool');

async function createReview(bookId, userId, { rating, body }) {
    const { rows } = await pool.query(
        `INSERT INTO reviews (book_id, user_id, rating, body) VALUES ($1,$2,$3,$4) RETURNING *`,
        [bookId, userId, rating, body]
    );
    return rows[0];
}

async function listReviewsForBook(bookId) {
    const { rows } = await pool.query(
        'SELECT * FROM reviews WHERE book_id = $1 ORDER BY created_at DESC',
        [bookId]
    );
    return rows;
}

async function getReviewById(id) {
    const { rows } = await pool.query('SELECT * FROM reviews WHERE id = $1', [id]);
    return rows[0] || null;
}

async function updateReview(id, userId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return getReviewById(id);
    const setClause = keys.map((k, i) => `${k} = $${i + 3}`).join(', ');
    const values = keys.map((k) => fields[k]);
    const { rows } = await pool.query(
        `UPDATE reviews SET ${setClause}, updated_at = now() WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId, ...values]
    );
    return rows[0] || null;
}

async function deleteReview(id, userId) {
    await pool.query('DELETE FROM reviews WHERE id = $1 AND user_id = $2', [id, userId]);
}

async function getAverageRating(bookId) {
    const { rows } = await pool.query(
        `SELECT AVG(rating)::numeric(3,2) AS average_rating, COUNT(*) AS review_count
     FROM reviews WHERE book_id = $1`,
        [bookId]
    );
    return {
        averageRating: rows[0].average_rating ? parseFloat(rows[0].average_rating) : null,
        reviewCount: parseInt(rows[0].review_count, 10),
    };
}

module.exports = { createReview, listReviewsForBook, getReviewById, updateReview, deleteReview, getAverageRating };