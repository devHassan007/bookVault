require('dotenv').config();

const required = ['DATABASE_URL', 'JWT_ACCESS_SECRET', 'JWT_REFRESH_SECRET'];
for (const key of required) {
    if (!process.env[key]) {
        throw new Error(`Missing required env var: ${key}`);
    }
}

module.exports = {
    databaseUrl: process.env.DATABASE_URL,
    jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
    jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
    port: process.env.PORT || 4000,
    nodeEnv: process.env.NODE_ENV || 'development',
    devUserId: process.env.DEV_USER_ID || '2b171f7b-3b8c-488d-bc51-bd934e22e0a2',
};