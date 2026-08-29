exports.up = (pgm) => {
    pgm.createExtension('pgcrypto', { ifNotExists: true });

    pgm.createTable('users', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        email: { type: 'varchar(255)', notNull: true, unique: true },
        password_hash: { type: 'varchar(255)', notNull: true },
        name: { type: 'varchar(255)' },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });

    pgm.createTable('books', {
        id: { type: 'uuid', primaryKey: true, default: pgm.func('gen_random_uuid()') },
        user_id: { type: 'uuid', notNull: true, references: 'users', onDelete: 'cascade' },
        title: { type: 'varchar(500)', notNull: true },
        author: { type: 'varchar(255)' },
        isbn: { type: 'varchar(20)' },
        genre: { type: 'varchar(100)' },
        status: { type: 'varchar(20)', notNull: true, default: 'want_to_read' },
        total_pages: { type: 'integer' },
        current_page: { type: 'integer', notNull: true, default: 0 },
        rating: { type: 'integer' },
        started_at: { type: 'timestamptz' },
        finished_at: { type: 'timestamptz' },
        created_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
        updated_at: { type: 'timestamptz', notNull: true, default: pgm.func('now()') },
    });

    pgm.addConstraint('books', 'books_status_check', "CHECK (status IN ('want_to_read','reading','finished','abandoned'))");
    pgm.createIndex('books', 'user_id');
    pgm.createIndex('books', 'genre');
    pgm.createIndex('books', 'status');
};

exports.down = (pgm) => {
    pgm.dropTable('books');
    pgm.dropTable('users');
};