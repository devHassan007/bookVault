function httpError(status, message, appCode, details) {
    const err = new Error(message);
    err.status = status;
    err.appCode = appCode;
    if (details) err.details = details;
    return err;
}

module.exports = { httpError };