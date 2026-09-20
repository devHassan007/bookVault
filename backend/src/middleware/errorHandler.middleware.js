const { mapPgError } = require('../db/pgErrors');

module.exports = function errorHandler(err, req, res, next) {
    console.error(err);

    const pgMapped = mapPgError(err); // last-resort translation for any pg error a controller didn't catch
    const status = err.status || (pgMapped && pgMapped.status) || 500;
    const code = err.appCode || (pgMapped && pgMapped.code) || 'INTERNAL_ERROR';
    const message = status === 500
        ? 'Something went wrong.'
        : err.message || (pgMapped && pgMapped.message) || 'Request failed.';

    res.status(status).json({
        error: { code, message, details: err.details || [] },
    });
};