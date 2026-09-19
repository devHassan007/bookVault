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

const listBooksQuerySchema = z.object({
    page: z.coerce.number().int().positive().optional().default(1),
    limit: z.coerce.number().int().positive().max(100).optional().default(20),
    status: z.enum(['want_to_read', 'reading', 'finished', 'abandoned']).optional(),
    genre: z.string().optional(),
    ratingMin: z.coerce.number().int().min(1).max(5).optional(),
    ratingMax: z.coerce.number().int().min(1).max(5).optional(),
    sort: z.string().optional(),
    q: z.string().optional(),
}).strict(); // unknown query params fail validation → 400

module.exports = { createBookSchema, updateBookSchema, listBooksQuerySchema };