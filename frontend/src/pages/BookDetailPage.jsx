import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { api } from '../api/client';
import StatusBadge from '../components/StatusBadge';

const STATUSES = ['want_to_read', 'reading', 'finished', 'abandoned'];

export default function BookDetailPage() {
    const { id } = useParams();
    const [book, setBook] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [bookRes, reviewsRes] = await Promise.all([
                api.get(`/books/${id}`),
                api.get(`/books/${id}/reviews`),
            ]);
            setBook(bookRes);
            setReviews(reviewsRes);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [id]);

    useEffect(() => { load(); }, [load]);

    async function updateStatus(status) {
        const updated = await api.patch(`/books/${id}`, { status });
        setBook((b) => ({ ...b, ...updated }));
    }

    if (loading) return <p className="text-slate-500">Loading…</p>;
    if (error) return <p className="text-red-600">{error}</p>;
    if (!book) return null;

    return (
        <div>
            <Link to="/books" className="text-sm text-slate-500 hover:text-slate-900">← Back to books</Link>

            <div className="mt-4 flex items-start justify-between">
                <div>
                    <h1 className="text-2xl font-semibold text-slate-900">{book.title}</h1>
                    <p className="text-slate-500">{book.author || 'Unknown author'}</p>
                </div>
                <select value={book.status} onChange={(e) => updateStatus(e.target.value)}
                    className="rounded-lg border border-slate-300 px-3 py-2 text-sm">
                    {STATUSES.map((s) => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
            </div>

            <div className="flex items-center gap-3 mt-3">
                <StatusBadge status={book.status} />
                {book.averageRating != null && (
                    <span className="text-sm text-amber-600">★ {book.averageRating} ({book.reviewCount} reviews)</span>
                )}
                {book.genre && <span className="text-sm text-slate-400">{book.genre}</span>}
            </div>

            <section className="mt-10">
                <h2 className="font-semibold text-slate-900 mb-3">Reviews</h2>
                <ReviewForm bookId={id} onCreated={load} />
                {reviews.length === 0 ? (
                    <p className="text-slate-500 mt-4">No reviews yet.</p>
                ) : (
                    <ul className="mt-4 space-y-3">
                        {reviews.map((r) => (
                            <li key={r.id} className="rounded-lg border border-slate-200 p-3">
                                <span className="text-amber-600 font-medium">★ {r.rating}</span>
                                {r.body && <p className="text-sm text-slate-700 mt-1">{r.body}</p>}
                            </li>
                        ))}
                    </ul>
                )}
            </section>
        </div>
    );
}

function ReviewForm({ bookId, onCreated }) {
    const [rating, setRating] = useState(5);
    const [body, setBody] = useState('');
    const [error, setError] = useState(null);
    const [saving, setSaving] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        try {
            await api.post(`/books/${bookId}/reviews`, { rating: Number(rating), body: body || undefined });
            setBody('');
            onCreated();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-wrap gap-2 items-center">
            <select value={rating} onChange={(e) => setRating(e.target.value)}
                className="rounded-lg border border-slate-300 px-2 py-2 text-sm">
                {[5, 4, 3, 2, 1].map((n) => <option key={n} value={n}>{n} ★</option>)}
            </select>
            <input placeholder="Write a review (optional)" value={body} onChange={(e) => setBody(e.target.value)}
                className="flex-1 min-w-[200px] rounded-lg border border-slate-300 px-3 py-2 text-sm" />
            <button disabled={saving} className="rounded-lg bg-slate-900 text-white text-sm px-4 py-2 disabled:opacity-50">
                {saving ? 'Posting…' : 'Post'}
            </button>
            {error && <p className="text-sm text-red-600 w-full">{error}</p>}
        </form>
    );
}