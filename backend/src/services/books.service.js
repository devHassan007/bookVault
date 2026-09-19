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

async function listBooks(userId, { page = 1, limit = 20, status, genre, ratingMin, ratingMax, sort, q }) {
    const conditions = ['user_id = $1'];
    const values = [userId];
    let i = 2;

    if (status) { conditions.push(`status = $${i++}`); values.push(status); }
    if (genre) { conditions.push(`genre = $${i++}`); values.push(genre); }
    if (ratingMin) { conditions.push(`rating >= $${i++}`); values.push(ratingMin); }
    if (ratingMax) { conditions.push(`rating <= $${i++}`); values.push(ratingMax); }
    if (q) { conditions.push(`(title ILIKE $${i} OR author ILIKE $${i})`); values.push(`%${q}%`); i++; }

    const allowedSort = { rating: 'rating', title: 'title', createdAt: 'created_at' };
    let orderClause = 'created_at DESC';
    if (sort) {
        const desc = sort.startsWith('-');
        const key = allowedSort[desc ? sort.slice(1) : sort];
        if (key) orderClause = `${key} ${desc ? 'DESC' : 'ASC'}`;
    }

    const offset = (page - 1) * limit;
    const where = conditions.join(' AND ');

    const dataQuery = `SELECT * FROM books WHERE ${where} ORDER BY ${orderClause} LIMIT $${i} OFFSET $${i + 1}`;
    const countQuery = `SELECT COUNT(*) FROM books WHERE ${where}`;

    const [dataRes, countRes] = await Promise.all([
        pool.query(dataQuery, [...values, limit, offset]),
        pool.query(countQuery, values),
    ]);

    const total = parseInt(countRes.rows[0].count, 10);
    return { data: dataRes.rows, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } };
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
