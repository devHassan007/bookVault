require('dotenv').config();
const bcrypt = require('bcrypt');
const pool = require('../src/db/pool');

const GENRES = ['fantasy', 'sci-fi', 'romance', 'mystery', 'horror', 'biography', 'history', 'poetry'];
const STATUSES = ['want_to_read', 'reading', 'finished', 'abandoned'];
const WORDS = ['King', 'Shadow', 'Storm', 'Whisper', 'Garden', 'Empire', 'River', 'Ashes'];

const randomFrom = (arr) => arr[Math.floor(Math.random() * arr.length)];
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

async function main() {
    const email = 'seed@example.com';
    const existing = await pool.query('SELECT id FROM users WHERE email = $1', [email]);
    let userId;
    if (existing.rows.length) {
        userId = existing.rows[0].id;
    } else {
        const passwordHash = await bcrypt.hash('password123', 10);
        const inserted = await pool.query(
            'INSERT INTO users (email, password_hash, name) VALUES ($1,$2,$3) RETURNING id',
            [email, passwordHash, 'Seed User']
        );
        userId = inserted.rows[0].id;
    }

    const COUNT = 500;
    console.log(`Seeding ${COUNT} books for ${email} (user_id=${userId})...`);

    for (let i = 0; i < COUNT; i++) {
        const status = randomFrom(STATUSES);
        await pool.query(
            `INSERT INTO books (user_id, title, author, genre, status, rating, total_pages)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
            [
                userId,
                `${randomFrom(WORDS)} of the ${randomFrom(WORDS)} ${i}`,
                `Author ${randomInt(1, 50)}`,
                randomFrom(GENRES),
                status,
                status === 'finished' ? randomInt(1, 5) : null,
                randomInt(150, 900),
            ]
        );
    }

    console.log('Done seeding. Login as seed@example.com / password123 to test.');
    await pool.end();
}

main().catch((err) => { console.error(err); process.exit(1); });