// Maps common Postgres SQLSTATE codes to an HTTP status + app error code.
// Reference: https://www.postgresql.org/docs/current/errcodes-appendix.html
const PG_ERROR_MAP = {
    '23505': { status: 409, code: 'CONFLICT', message: 'A record with this value already exists.' },
    '23503': { status: 400, code: 'INVALID_REFERENCE', message: 'Referenced record does not exist.' },
    '23502': { status: 400, code: 'MISSING_FIELD', message: 'A required field is missing.' },
    '22P02': { status: 400, code: 'INVALID_INPUT', message: 'Invalid input format.' },
    '23514': { status: 422, code: 'CHECK_VIOLATION', message: 'Value violates a database constraint.' },
};

function mapPgError(err) {
    return (err && err.code && PG_ERROR_MAP[err.code]) || null;
}

module.exports = { mapPgError, PG_ERROR_MAP };