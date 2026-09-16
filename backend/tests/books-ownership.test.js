const request = require('supertest');
const app = require('../src/app');
const pool = require('../src/db/pool');


async function registerAndLogin(email) {
    await request(app).post('/api/v1/auth/register').send({ email, password: 'password123' });
    const res = await request(app).post('/api/v1/auth/login').send({ email, password: 'password123' });
    return res.body;
}

describe('Book ownership', () => {
    let userA, userB, bookAId;


    afterAll(async () => {
        await pool.query("DELETE FROM users WHERE email IN ('usera@example.com','userb@example.com')");
        await pool.end();
    });

    beforeAll(async () => {
        userA = await registerAndLogin('usera@example.com');
        userB = await registerAndLogin('userb@example.com');
        const createRes = await request(app)
            .post('/api/v1/books')
            .set('Authorization', `Bearer ${userA.accessToken}`)
            .send({ title: 'Owned by A' });
        bookAId = createRes.body.id;
    });

    test('user B cannot read user A\'s book (404)', async () => {
        const res = await request(app).get(`/api/v1/books/${bookAId}`)
            .set('Authorization', `Bearer ${userB.accessToken}`);
        expect(res.status).toBe(404);
    });

    test('user B cannot update user A\'s book (404)', async () => {
        const res = await request(app).patch(`/api/v1/books/${bookAId}`)
            .set('Authorization', `Bearer ${userB.accessToken}`).send({ title: 'Hacked' });
        expect(res.status).toBe(404);
    });

    test('user B cannot delete user A\'s book (404)', async () => {
        const res = await request(app).delete(`/api/v1/books/${bookAId}`)
            .set('Authorization', `Bearer ${userB.accessToken}`);
        expect(res.status).toBe(404);
    });

    test('invalid token returns 401', async () => {
        const res = await request(app).get(`/api/v1/books/${bookAId}`)
            .set('Authorization', 'Bearer not-a-real-token');
        expect(res.status).toBe(401);
    });

    test('user A can still read their own book (200)', async () => {
        const res = await request(app).get(`/api/v1/books/${bookAId}`)
            .set('Authorization', `Bearer ${userA.accessToken}`);
        expect(res.status).toBe(200);
    });
});