const { z } = require('zod');
const { stripHtml } = require('../utils/sanitize');

const createBookSchema = z.object({
    title: z.string().min(1).transform(stripHtml), // required — safe to transform directly
    author: z.string().optional().transform((val) => (val ? stripHtml(val) : val)), // optional — guard against undefined
    isbn: z.string().optional(),
    genre: z.string().optional().transform((val) => (val ? stripHtml(val) : val)),
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
}).strict();

module.exports = { createBookSchema, updateBookSchema, listBooksQuerySchema };