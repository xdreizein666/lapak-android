import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

type AuthContextType = {
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
    logout: () => Promise<void>;
    loginAttempts: number;
    isLocked: boolean;
    lockoutTime: number | null;
    user: any | null;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 5 * 60 * 1000; // 5 minutes in milliseconds

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState<any | null>(null);
    const [loginAttempts, setLoginAttempts] = useState(0);
    const [isLocked, setIsLocked] = useState(false);
    const [lockoutTime, setLockoutTime] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check active session
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
            setLoading(false);
        });

        // Listen for auth changes
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((_event, session) => {
            setUser(session?.user ?? null);
            setIsAuthenticated(!!session);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        // Check if account is locked (client-side protection)
        const lockedUntil = localStorage.getItem('lockedUntil');
        if (lockedUntil) {
            const lockTime = parseInt(lockedUntil);
            if (Date.now() < lockTime) {
                setIsLocked(true);
                setLockoutTime(lockTime);
            } else {
                localStorage.removeItem('lockedUntil');
                localStorage.removeItem('loginAttempts');
                setLoginAttempts(0);
            }
        }

        // Check stored login attempts
        const attempts = localStorage.getItem('loginAttempts');
        if (attempts) {
            setLoginAttempts(parseInt(attempts));
        }
    }, []);

    useEffect(() => {
        // Handle lockout countdown
        if (isLocked && lockoutTime) {
            const timer = setInterval(() => {
                if (Date.now() >= lockoutTime) {
                    setIsLocked(false);
                    setLockoutTime(null);
                    setLoginAttempts(0);
                    localStorage.removeItem('lockedUntil');
                    localStorage.removeItem('loginAttempts');
                    clearInterval(timer);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isLocked, lockoutTime]);

    const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
        // Check if locked
        if (isLocked) {
            return { success: false, error: 'Account is locked' };
        }

        try {
            const { error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) {
                // Failed login
                const newAttempts = loginAttempts + 1;
                setLoginAttempts(newAttempts);
                localStorage.setItem('loginAttempts', newAttempts.toString());

                // Check if should lock
                if (newAttempts >= MAX_ATTEMPTS) {
                    const lockUntil = Date.now() + LOCKOUT_DURATION;
                    setIsLocked(true);
                    setLockoutTime(lockUntil);
                    localStorage.setItem('lockedUntil', lockUntil.toString());
                    return { success: false, error: 'Terlalu banyak percobaan gagal. Akun terkunci sementara.' };
                }

                return { success: false, error: error.message };
            }

            // Successful login
            setLoginAttempts(0);
            localStorage.removeItem('loginAttempts');
            localStorage.removeItem('lockedUntil');
            return { success: true };

        } catch (err) {
            return { success: false, error: 'Terjadi kesalahan saat login' };
        }
    };

    const logout = async () => {
        await supabase.auth.signOut();
        setIsAuthenticated(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                isAuthenticated,
                user,
                login,
                logout,
                loginAttempts,
                isLocked,
                lockoutTime,
            }}
        >
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

