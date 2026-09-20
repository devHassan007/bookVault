module.exports = function validate(schema, status = 400) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const err = new Error('Validation failed');
            err.status = status;
            err.appCode = 'VALIDATION_ERROR';
            err.details = result.error.issues;
            return next(err);
        }
        req.body = result.data;
        next();
    };
};