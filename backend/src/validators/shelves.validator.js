const { z } = require('zod');

const createShelfSchema = z.object({ name: z.string().min(1).max(255) });
const updateShelfSchema = createShelfSchema.partial();

module.exports = { createShelfSchema, updateShelfSchema };