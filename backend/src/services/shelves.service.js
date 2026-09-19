const pool = require('../db/pool');

async function createShelf(userId, name) {
    const { rows } = await pool.query(
        'INSERT INTO shelves (user_id, name) VALUES ($1,$2) RETURNING *',
        [userId, name]
    );
    return rows[0];
}

async function listShelves(userId) {
    const { rows } = await pool.query(
        'SELECT * FROM shelves WHERE user_id = $1 ORDER BY created_at DESC',
        [userId]
    );
    return rows;
}

async function getShelfById(id) {
    const { rows } = await pool.query('SELECT * FROM shelves WHERE id = $1', [id]);
    return rows[0] || null;
}

async function updateShelf(id, userId, fields) {
    const keys = Object.keys(fields);
    if (keys.length === 0) return getShelfById(id);
    const setClause = keys.map((k, i) => `${k} = $${i + 3}`).join(', ');
    const values = keys.map((k) => fields[k]);
    const { rows } = await pool.query(
        `UPDATE shelves SET ${setClause}, updated_at = now() WHERE id = $1 AND user_id = $2 RETURNING *`,
        [id, userId, ...values]
    );
    return rows[0] || null;
}

async function deleteShelf(id, userId) {
    await pool.query('DELETE FROM shelves WHERE id = $1 AND user_id = $2', [id, userId]);
}

async function addBookToShelf(shelfId, bookId) {
    await pool.query(
        `INSERT INTO shelf_books (shelf_id, book_id) VALUES ($1,$2)
     ON CONFLICT (shelf_id, book_id) DO NOTHING`,
        [shelfId, bookId]
    );
}

async function removeBookFromShelf(shelfId, bookId) {
    await pool.query('DELETE FROM shelf_books WHERE shelf_id = $1 AND book_id = $2', [shelfId, bookId]);
}

async function listBooksOnShelf(shelfId) {
    const { rows } = await pool.query(
        `SELECT b.* FROM books b JOIN shelf_books sb ON sb.book_id = b.id
     WHERE sb.shelf_id = $1 ORDER BY sb.added_at DESC`,
        [shelfId]
    );
    return rows;
}

module.exports = {
    createShelf, listShelves, getShelfById, updateShelf, deleteShelf,
    addBookToShelf, removeBookFromShelf, listBooksOnShelf,
};