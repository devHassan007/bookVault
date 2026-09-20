const { z } = require('zod');
const { stripHtml } = require('../utils/sanitize');

const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    body: z.string().optional().transform((val) => (val ? stripHtml(val) : val)),
});

const updateReviewSchema = createReviewSchema.partial();

module.exports = { createReviewSchema, updateReviewSchema };