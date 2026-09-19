const { z } = require('zod');

const createReviewSchema = z.object({
    rating: z.number().int().min(1).max(5),
    body: z.string().optional(),
});

const updateReviewSchema = createReviewSchema.partial();

module.exports = { createReviewSchema, updateReviewSchema };