const API_BASE = 'http://localhost:4000/api/v1';

let accessToken = null;
let refreshTokenValue = null; // in-memory only — see design note above

export function setTokens({ accessToken: at, refreshToken: rt }) {
    accessToken = at;
    if (rt !== undefined) refreshTokenValue = rt;
}

export function getAccessToken() {
    return accessToken;
}

export function clearTokens() {
    accessToken = null;
    refreshTokenValue = null;
}

export class ApiError extends Error {
    constructor(status, code, message, details) {
        super(message);
        this.status = status;
        this.code = code;
        this.details = details || [];
    }
}

let refreshPromise = null;

async function refreshAccessToken() {
    if (!refreshTokenValue) throw new Error('No refresh token');
    if (!refreshPromise) {
        refreshPromise = fetch(`${API_BASE}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken: refreshTokenValue }),
        })
            .then(async (res) => {
                if (!res.ok) throw new Error('Refresh failed');
                const data = await res.json();
                setTokens(data);
                return data.accessToken;
            })
            .finally(() => { refreshPromise = null; });
    }
    return refreshPromise;
}

async function request(path, { method = 'GET', body, params, skipAuth = false, _retried = false } = {}) {
    const url = new URL(`${API_BASE}${path}`);
    if (params) {
        Object.entries(params).forEach(([k, v]) => {
            if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, v);
        });
    }

    const headers = { 'Content-Type': 'application/json' };
    if (!skipAuth && accessToken) headers.Authorization = `Bearer ${accessToken}`;

    const res = await fetch(url, { method, headers, body: body ? JSON.stringify(body) : undefined });

    if (res.status === 401 && !skipAuth && !_retried) {
        try {
            await refreshAccessToken();
            return request(path, { method, body, params, skipAuth, _retried: true });
        } catch {
            clearTokens();
            window.dispatchEvent(new Event('auth:logout'));
            throw new ApiError(401, 'UNAUTHORIZED', 'Session expired. Please log in again.');
        }
    }

    const text = await res.text();
    let data = null;
    if (text) { try { data = JSON.parse(text); } catch { /* non-JSON body */ } }

    if (!res.ok) {
        const err = data?.error || {};
        throw new ApiError(res.status, err.code || 'ERROR', err.message || 'Request failed', err.details);
    }
    return data;
}

export const api = {
    get: (path, params) => request(path, { method: 'GET', params }),
    post: (path, body, opts = {}) => request(path, { method: 'POST', body, ...opts }),
    patch: (path, body) => request(path, { method: 'PATCH', body }),
    put: (path, body) => request(path, { method: 'PUT', body }),
    delete: (path) => request(path, { method: 'DELETE' }),
};