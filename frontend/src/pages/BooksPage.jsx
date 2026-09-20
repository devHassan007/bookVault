import { useEffect, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['want_to_read', 'reading', 'finished', 'abandoned'];

export default function BooksPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [filters, setFilters] = useState({ status: '', genre: '', q: '', sort: '-createdAt', page: 1, limit: 12 });
    const [showCreate, setShowCreate] = useState(false);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            setData(await api.get('/books', filters));
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [filters]);

    useEffect(() => { load(); }, [load]);

    function updateFilter(key, value) {
        setFilters((f) => ({ ...f, [key]: value, page: key === 'page' ? value : 1 }));
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl font-semibold text-slate-900">Your Books</h1>
                <button onClick={() => setShowCreate(true)}
                    className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2 hover:bg-slate-800">
                    + Add book
                </button>
            </div>

            <div className="flex flex-wrap gap-3 mb-6">
                <input placeholder="Search title or author…" value={filters.q}
                    onChange={(e) => updateFilter('q', e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1 min-w-[180px]" />
                <select value={filters.status} onChange={(e) => updateFilter('status', e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    <option value="">All statuses</option>
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <input placeholder="Genre" value={filters.genre} onChange={(e) => updateFilter('genre', e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm w-32" />
                <select value={filters.sort} onChange={(e) => updateFilter('sort', e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    <option value="-createdAt">Newest first</option>
                    <option value="createdAt">Oldest first</option>
                    <option value="-rating">Rating: high to low</option>
                    <option value="rating">Rating: low to high</option>
                    <option value="title">Title: A-Z</option>
                </select>
            </div>

            {loading && <p className="text-slate-500">Loading books…</p>}
            {error && <p className="text-red-600">{error}</p>}

            {!loading && !error && data?.data.length === 0 && (
                <div className="text-center py-16 text-slate-500">
                    <p className="mb-2">No books match your filters yet.</p>
                    <button onClick={() => setShowCreate(true)} className="text-slate-900 font-medium underline">
                        Add your first book
                    </button>
                </div>
            )}

            {!loading && !error && data?.data.length > 0 && (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {data.data.map((book) => (
                            <Link key={book.id} to={`/books/${book.id}`}
                                className="block rounded-xl border border-slate-200 bg-white p-4 hover:shadow-md transition-shadow">
                                <h3 className="font-medium text-slate-900 truncate">{book.title}</h3>
                                <p className="text-sm text-slate-500 truncate">{book.author || 'Unknown author'}</p>
                                <div className="flex items-center justify-between mt-3">
                                    <StatusBadge status={book.status} />
                                    {book.genre && <span className="text-xs text-slate-400">{book.genre}</span>}
                                </div>
                            </Link>
                        ))}
                    </div>

                    <div className="flex items-center justify-between mt-6 text-sm text-slate-600">
                        <span>Page {data.meta.page} of {data.meta.totalPages} ({data.meta.total} books)</span>
                        <div className="flex gap-2">
                            <button disabled={filters.page <= 1} onClick={() => updateFilter('page', filters.page - 1)}
                                className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40">Prev</button>
                            <button disabled={filters.page >= data.meta.totalPages} onClick={() => updateFilter('page', filters.page + 1)}
                                className="rounded-lg border border-slate-300 px-3 py-1 disabled:opacity-40">Next</button>
                        </div>
                    </div>
                </>
            )}

            {showCreate && (
                <CreateBookModal onClose={() => setShowCreate(false)} onCreated={() => { setShowCreate(false); load(); }} />
            )}
        </div>
    );
}

function CreateBookModal({ onClose, onCreated }) {
    const [form, setForm] = useState({ title: '', author: '', genre: '' });
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await api.post('/books', form);
            onCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 w-full max-w-sm">
                <h2 className="font-semibold text-slate-900 mb-4">Add a book</h2>
                <form onSubmit={handleSubmit} className="space-y-3">
                    <input required placeholder="Title" value={form.title}
                        onChange={(e) => setForm({ ...form, title: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <input placeholder="Author" value={form.author}
                        onChange={(e) => setForm({ ...form, author: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    <input placeholder="Genre" value={form.genre}
                        onChange={(e) => setForm({ ...form, genre: e.target.value })}
                        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                    {error && <p className="text-sm text-red-600">{error}</p>}
                    <div className="flex gap-2 justify-end pt-2">
                        <button type="button" onClick={onClose} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                        <button type="submit" disabled={saving}
                            className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2 disabled:opacity-50">
                            {saving ? 'Saving…' : 'Add book'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}