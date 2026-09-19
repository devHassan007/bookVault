const pool = require('../db/pool');

async function getUserStats(userId) {
    const [totalRes, statusRes, ratingRes, genreRes] = await Promise.all([
        pool.query('SELECT COUNT(*) FROM books WHERE user_id = $1', [userId]),
        pool.query('SELECT status, COUNT(*) FROM books WHERE user_id = $1 GROUP BY status', [userId]),
        pool.query(
            `SELECT AVG(r.rating)::numeric(3,2) AS avg_rating
       FROM reviews r JOIN books b ON b.id = r.book_id WHERE b.user_id = $1`,
            [userId]
        ),
        pool.query(
            `SELECT genre, COUNT(*) AS count FROM books
       WHERE user_id = $1 AND genre IS NOT NULL
       GROUP BY genre ORDER BY count DESC LIMIT 1`,
            [userId]
        ),
    ]);

    return {
        totalBooks: parseInt(totalRes.rows[0].count, 10),
        byStatus: statusRes.rows.reduce((acc, r) => ({ ...acc, [r.status]: parseInt(r.count, 10) }), {}),
        averageRatingGiven: ratingRes.rows[0].avg_rating ? parseFloat(ratingRes.rows[0].avg_rating) : null,
        topGenre: genreRes.rows[0] ? genreRes.rows[0].genre : null,
    };
}

module.exports = { getUserStats };