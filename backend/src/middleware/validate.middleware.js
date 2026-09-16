module.exports = function validate(schema) {
    return (req, res, next) => {
        const result = schema.safeParse(req.body);
        if (!result.success) {
            const err = new Error('Validation failed');
            err.status = 400;
            err.details = result.error.issues;
            return next(err);
        }
        req.body = result.data;
        next();
    };
};
