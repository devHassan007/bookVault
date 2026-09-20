import { useEffect, useState, useCallback } from 'react';
import { api } from '../api/client';

export default function ShelvesPage() {
    const [shelves, setShelves] = useState([]);
    const [allBooks, setAllBooks] = useState([]);
    const [shelfBooks, setShelfBooks] = useState({});
    const [expanded, setExpanded] = useState(null);
    const [newName, setNewName] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [shelvesRes, booksRes] = await Promise.all([
                api.get('/shelves'),
                api.get('/books', { limit: 100 }),
            ]);
            setShelves(shelvesRes);
            setAllBooks(booksRes.data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => { load(); }, [load]);

    async function createShelf(e) {
        e.preventDefault();
        if (!newName.trim()) return;
        try {
            await api.post('/shelves', { name: newName.trim() });
            setNewName('');
            load();
        } catch (err) {
            setError(err.message);
        }
    }

    async function toggleExpand(shelfId) {
        if (expanded === shelfId) { setExpanded(null); return; }
        setExpanded(shelfId);
        if (!shelfBooks[shelfId]) {
            const detail = await api.get(`/shelves/${shelfId}`);
            setShelfBooks((s) => ({ ...s, [shelfId]: detail.books }));
        }
    }

    async function addBook(shelfId, bookId) {
        if (!bookId) return;
        await api.put(`/shelves/${shelfId}/books/${bookId}`);
        const detail = await api.get(`/shelves/${shelfId}`);
        setShelfBooks((s) => ({ ...s, [shelfId]: detail.books }));
    }

    async function removeBook(shelfId, bookId) {
        await api.delete(`/shelves/${shelfId}/books/${bookId}`);
        setShelfBooks((s) => ({ ...s, [shelfId]: s[shelfId].filter((b) => b.id !== bookId) }));
    }

    if (loading) return <p className="text-slate-500">Loading…</p>;
    if (error) return <p className="text-red-600">{error}</p>;

    return (
        <div>
            <h1 className="text-xl font-semibold text-slate-900 mb-6">Your Shelves</h1>

            <form onSubmit={createShelf} className="flex gap-2 mb-6">
                <input placeholder="New shelf name" value={newName} onChange={(e) => setNewName(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm flex-1 max-w-xs" />
                <button className="rounded-lg bg-slate-900 text-white text-sm font-medium px-4 py-2">Create</button>
            </form>

            {shelves.length === 0 ? (
                <p className="text-slate-500">No shelves yet — create one above.</p>
            ) : (
                <div className="space-y-3">
                    {shelves.map((shelf) => (
                        <div key={shelf.id} className="rounded-xl border border-slate-200 bg-white">
                            <button onClick={() => toggleExpand(shelf.id)}
                                className="w-full flex items-center justify-between px-4 py-3 text-left">
                                <span className="font-medium text-slate-900">{shelf.name}</span>
                                <span className="text-slate-400 text-sm">{expanded === shelf.id ? '▲' : '▼'}</span>
                            </button>
                            {expanded === shelf.id && (
                                <div className="px-4 pb-4 border-t border-slate-100 pt-3">
                                    <select onChange={(e) => { addBook(shelf.id, e.target.value); e.target.value = ''; }}
                                        className="rounded-lg border border-slate-300 px-3 py-2 text-sm mb-3">
                                        <option value="">+ Add a book…</option>
                                        {allBooks
                                            .filter((b) => !(shelfBooks[shelf.id] || []).some((sb) => sb.id === b.id))
                                            .map((b) => <option key={b.id} value={b.id}>{b.title}</option>)}
                                    </select>
                                    {(shelfBooks[shelf.id] || []).length === 0 ? (
                                        <p className="text-sm text-slate-500">No books on this shelf yet.</p>
                                    ) : (
                                        <ul className="space-y-2">
                                            {shelfBooks[shelf.id].map((b) => (
                                                <li key={b.id} className="flex items-center justify-between text-sm">
                                                    <span>{b.title}</span>
                                                    <button onClick={() => removeBook(shelf.id, b.id)} className="text-red-600 hover:underline">
                                                        Remove
                                                    </button>
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}