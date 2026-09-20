import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    return (
        <header className="border-b border-slate-200 bg-white">
            <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
                <Link to="/books" className="font-semibold text-slate-900 tracking-tight">📚 BookVault</Link>
                {user && (
                    <nav className="flex items-center gap-6 text-sm">
                        <Link to="/books" className="text-slate-600 hover:text-slate-900">Books</Link>
                        <Link to="/shelves" className="text-slate-600 hover:text-slate-900">Shelves</Link>
                        <span className="text-slate-400">{user.email}</span>
                        <button onClick={() => { logout(); navigate('/login'); }} className="text-slate-600 hover:text-slate-900">
                            Log out
                        </button>
                    </nav>
                )}
            </div>
        </header>
    );
}