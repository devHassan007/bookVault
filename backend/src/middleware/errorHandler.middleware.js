module.exports = function errorHandler(err, req, res, next) {
    console.error(err);
    res.status(err.status || 500).json({
        error: { message: err.message || 'Something went wrong.' },
    });
};