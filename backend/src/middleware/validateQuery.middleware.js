module.exports = function validateQuery(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.query);
        if (!result.success) {
            const err = new Error('Invalid query parameters');
            err.status = 400;
            err.details = result.error.issues;
            return next(err);
        }
        req.query = result.data;
        next();
    };
};