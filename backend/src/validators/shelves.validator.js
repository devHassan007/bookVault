const { z } = require('zod');
const { stripHtml } = require('../utils/sanitize');

const createShelfSchema = z.object({
    name: z.string().min(1).max(255).transform(stripHtml), // required field — transform runs directly, no null check needed
});

const updateShelfSchema = createShelfSchema.partial();

module.exports = { createShelfSchema, updateShelfSchema };