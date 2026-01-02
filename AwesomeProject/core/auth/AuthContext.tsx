import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
console.log('AUTH CONTEXT: USING API VERSION');

const API_BASE = 'http://10.0.2.2:3000';

export type UserRole = 'admin' | 'user';
export type User = {
    id: number;
    email: string;
    role: UserRole;
    fullName?: string | null;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    loading: boolean;
    restoring: boolean;
    signIn: (email: string, password: string) => Promise<void>;
    signUp: (name: string, email: string, password: string) => Promise<void>;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const STORAGE_KEYS = {
    token: '@nomnom_token',
    user: '@nomnom_user',
};

async function safeJson(res: Response) {
    try {
        return await res.json();
    } catch {
        return null;
    }
}

async function fetchWithTimeout(url: string, options: any, ms = 12000) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), ms);
    try {
        const res = await fetch(url, { ...options, signal: controller.signal });
        return res;
    } finally {
        clearTimeout(timer);
    }
}

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [restoring, setRestoring] = useState(true);

    // restore session
    useEffect(() => {
        (async () => {
            try {
                const [t, u] = await Promise.all([
                    AsyncStorage.getItem(STORAGE_KEYS.token),
                    AsyncStorage.getItem(STORAGE_KEYS.user),
                ]);
                if (t && u) {
                    setToken(t);
                    setUser(JSON.parse(u));
                }
            } catch (e) {
                console.log('Restore session error:', e);
            } finally {
                setRestoring(false);
            }
        })();
    }, []);

    const signIn = async (email: string, password: string) => {
        const e = email.trim();
        if (!e || !password) throw new Error('Vui lòng nhập email và mật khẩu');

        setLoading(true);
        try {
            const res = await fetchWithTimeout(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: e, password }),
            });

            const json = await safeJson(res);

            if (!res.ok) {
                throw new Error(json?.error || json?.message || `HTTP ${res.status}`);
            }

            const t: string | undefined = json?.token;
            const u: User | undefined = json?.user;
            if (!t || !u) throw new Error('Server thiếu token/user');

            await Promise.all([
                AsyncStorage.setItem(STORAGE_KEYS.token, t),
                AsyncStorage.setItem(STORAGE_KEYS.user, JSON.stringify(u)),
            ]);

            setToken(t);
            setUser(u);
        } catch (err: any) {
            if (err?.name === 'AbortError') throw new Error('Login timeout. Kiểm tra server đang chạy.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // IMPORTANT: name,email,password đúng thứ tự theo Register.tsx của bạn
    const signUp = async (name: string, email: string, password: string) => {
        const e = email.trim();
        const fullName = (name || '').trim();
        if (!e || !password) throw new Error('Email và mật khẩu không được để trống');
        if (password.length < 6) throw new Error('Mật khẩu phải từ 6 ký tự trở lên');

        setLoading(true);
        try {
            // 1) gọi register (lưu SQL)
            const res = await fetchWithTimeout(`${API_BASE}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email: e, password, fullName }),
            });

            const json = await safeJson(res);

            if (!res.ok) {
                throw new Error(json?.error || json?.message || `HTTP ${res.status}`);
            }

            // 2) login để lấy token/user (nếu backend register chưa trả token)
            await signIn(e, password);
        } catch (err: any) {
            if (err?.name === 'AbortError') throw new Error('Register timeout. Kiểm tra server đang chạy.');
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const signOut = async () => {
        await Promise.all([
            AsyncStorage.removeItem(STORAGE_KEYS.token),
            AsyncStorage.removeItem(STORAGE_KEYS.user),
        ]);
        setToken(null);
        setUser(null);
    };

    const value = useMemo(
        () => ({ user, token, loading, restoring, signIn, signUp, signOut }),
        [user, token, loading, restoring],
    );

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
    return ctx;
};
