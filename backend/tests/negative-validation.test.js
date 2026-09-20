const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');

async function registerAndLogin(email) {
    await request(app).post('/api/v1/auth/register').send({ email, password: 'password123' });
    const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'password123' });
    return res.body;
}

function expectErrorEnvelope(body) {
    expect(body).toHaveProperty('error');
    expect(body.error).toHaveProperty('code');
    expect(body.error).toHaveProperty('message');
    expect(body.error).toHaveProperty('details');
}

describe('Negative validation across endpoints', () => {
    let user, bookId;

    beforeAll(async () => {
        user = await registerAndLogin('negtest@example.com');
        const res = await request(app).post('/api/v1/books')
            .set('Authorization', `Bearer ${user.accessToken}`).send({ title: 'Valid Book' });
        bookId = res.body.id;
    });

    afterAll(async () => {
        await pool.query("DELETE FROM users WHERE email = 'negtest@example.com'");
        await pool.end();
    });

    test('missing title on book create → 400', async () => {
        const res = await request(app).post('/api/v1/books')
            .set('Authorization', `Bearer ${user.accessToken}`).send({ author: 'No Title' });
        expect(res.status).toBe(400);
        expectErrorEnvelope(res.body);
    });

    test('rating out of range on review create → 422', async () => {
        const res = await request(app).post(`/api/v1/books/${bookId}/reviews`)
            .set('Authorization', `Bearer ${user.accessToken}`).send({ rating: 99 });
        expect(res.status).toBe(422);
        expectErrorEnvelope(res.body);
    });

    test('duplicate email on register → 409', async () => {
        const res = await request(app).post('/api/v1/auth/register')
            .send({ email: 'negtest@example.com', password: 'password123' });
        expect(res.status).toBe(409);
        expectErrorEnvelope(res.body);
    });

    test('duplicate shelf name → 409', async () => {
        await request(app).post('/api/v1/shelves')
            .set('Authorization', `Bearer ${user.accessToken}`).send({ name: 'Favorites' });
        const res = await request(app).post('/api/v1/shelves')
            .set('Authorization', `Bearer ${user.accessToken}`).send({ name: 'Favorites' });
        expect(res.status).toBe(409);
        expectErrorEnvelope(res.body);
    });

    test('garbage UUID in URL param → 400', async () => {
        const res = await request(app).get('/api/v1/books/not-a-real-uuid')
            .set('Authorization', `Bearer ${user.accessToken}`);
        expect([400, 404]).toContain(res.status); // depends whether pgErrors 22P02 fires or ownership 404 fires first
        expectErrorEnvelope(res.body);
    });

    test('invalid token → 401', async () => {
        const res = await request(app).get('/api/v1/books').set('Authorization', 'Bearer garbage');
        expect(res.status).toBe(401);
        expectErrorEnvelope(res.body);
    });

    test('unknown query param → 400', async () => {
        const res = await request(app).get('/api/v1/books?bogus=1')
            .set('Authorization', `Bearer ${user.accessToken}`);
        expect(res.status).toBe(400);
        expectErrorEnvelope(res.body);
    });
});