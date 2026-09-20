import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { api, setTokens, clearTokens } from '../api/client';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const handleLogout = () => setUser(null);
        window.addEventListener('auth:logout', handleLogout);
        return () => window.removeEventListener('auth:logout', handleLogout);
    }, []);

    const login = useCallback(async (email, password) => {
        const data = await api.post('/auth/login', { email, password }, { skipAuth: true });
        setTokens(data);
        setUser(data.user);
        return data.user;
    }, []);

    const register = useCallback(async (email, password, name) => {
        await api.post('/auth/register', { email, password, name }, { skipAuth: true });
        return login(email, password);
    }, [login]);

    const logout = useCallback(() => {
        clearTokens();
        setUser(null);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used within AuthProvider');
    return ctx;
}