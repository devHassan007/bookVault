const { z } = require('zod');

const createBookSchema = z.object({
    title: z.string().min(1),
    author: z.string().optional(),
    isbn: z.string().optional(),
    genre: z.string().optional(),
    status: z.enum(['want_to_read', 'reading', 'finished', 'abandoned']).optional(),
    totalPages: z.number().int().positive().optional(),
});

const updateBookSchema = createBookSchema.partial();

module.exports = { createBookSchema, updateBookSchema };