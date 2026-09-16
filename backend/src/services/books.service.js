const pool = require('../db/pool');

async function createBook(userId, data) {
    const { title, author, isbn, genre, status = 'want_to_read', totalPages } = data;
    const { rows } = await pool.query(
        `INSERT INTO books (user_id, title, author, isbn, genre, status, total_pages)
     VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
        [userId, title, author, isbn, genre, status, totalPages]
    );
    return rows[0];
}

async function listBooks(userId) {
    const { rows } = await pool.query(
        'SELECT * FROM books WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return rows;
}

async function getBookById(id) {
    const { rows } = await pool.query('SELECT * FROM books WHERE id = $1', [id]);
    return rows[0] || null;
}

async function updateBookPartial(id, userId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return getBookById(id);
    const setClause = keys.map((k, i) => `${k} = $${i + 3}`).join(', ');
    const values = keys.map((k) => fields[k]);
    const { rows } = await pool.query(
        `UPDATE books SET ${setClause}, updated_at = now()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId, ...values]
    );
    return rows[0] || null;
}

async function putBook(id, userId, data) {
    const { title, author, isbn, genre, status, totalPages, currentPage } = data;
    const { rows } = await pool.query(
        `UPDATE books SET title=$3, author=$4, isbn=$5, genre=$6, status=$7,
       total_pages=$8, current_page=$9, updated_at=now()
     WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId, title, author, isbn, genre, status, totalPages, currentPage || 0]
    );
    return rows[0] || null;
}

async function deleteBook(id, userId) {
    await pool.query('DELETE FROM books WHERE id = $1 AND user_id = $2', [id, userId]);
}

module.exports = { createBook, listBooks, getBookById, updateBookPartial, putBook, deleteBook };