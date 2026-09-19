exports.up = (pgm) => {
    pgm.createTable('reviews', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        book_id: { type: 'uuid', notNull: true, references: 'books', onDelete: 'cascade' },
        user_id: { type: 'uuid', notNull: true, references: 'users', onDelete: 'cascade' },
        rating: { type: 'integer', notNull: true },
        body: { type: 'text' },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });
    pgm.addConstraint('reviews', 'reviews_rating_check', 'CHECK (rating BETWEEN 1 AND 5)');
    pgm.createIndex('reviews', 'book_id');

    pgm.createTable('shelves', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        user_id: { type: 'uuid', notNull: true, references: 'users', onDelete: 'cascade' },
        name: { type: 'varchar(255)', notNull: true },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });
    pgm.addConstraint('shelves', 'shelves_user_name_unique', 'UNIQUE (user_id, name)');

    pgm.createTable('shelf_books', {
        shelf_id: { type: 'uuid', notNull: true, references: 'shelves', onDelete: 'cascade' },
        book_id: { type: 'uuid', notNull: true, references: 'books', onDelete: 'cascade' },
        added_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });
    pgm.addConstraint('shelf_books', 'shelf_books_pk', { primaryKey: ['shelf_id', 'book_id'] });
};

exports.down = (pgm) => {
    pgm.dropTable('shelf_books');
    pgm.dropTable('shelves');
    pgm.dropTable('reviews');
};