import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function RegisterPage() {
    const { register } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({ email: '', password: '', name: '' });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setLoading(true);
        try {
            await register(form.email, form.password, form.name);
            navigate('/books', { replace: true });
        } catch (err) {
            setError(err.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-sm mx-auto mt-16">
            <h1 className="text-2xl font-semibold text-slate-900 mb-1">Create your account</h1>
            <p className="text-slate-500 mb-6">Start tracking your reading</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <input placeholder="Name (optional)" value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input type="email" required placeholder="Email" value={form.email}
                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                <input type="password" required placeholder="Password (min 8 characters)" value={form.password}
                    onChange={(e) => setForm({ ...form, password: e.target.value })}
                    className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm" />
                {error && <p className="text-sm text-red-600">{error}</p>}
                <button type="submit" disabled={loading}
                    className="w-full rounded-lg bg-slate-900 text-white text-sm font-medium py-2 hover:bg-slate-800 disabled:opacity-50">
                    {loading ? 'Creating account…' : 'Register'}
                </button>
            </form>
            <p className="text-sm text-slate-500 mt-4">
                Already have an account? <Link to="/login" className="text-slate-900 font-medium">Log in</Link>
            </p>
        </div>
    );
}