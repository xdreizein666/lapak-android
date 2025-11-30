import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Lock, User, Eye, EyeOff, Shield, AlertTriangle, CheckCircle, Clock } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [countdown, setCountdown] = useState(0);

    const { login, isAuthenticated, loginAttempts, isLocked, lockoutTime } = useAuth();
    const navigate = useNavigate();

    const MAX_ATTEMPTS = 5;

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/admin');
        }
    }, [isAuthenticated, navigate]);

    useEffect(() => {
        if (isLocked && lockoutTime) {
            const timer = setInterval(() => {
                const remaining = Math.ceil((lockoutTime - Date.now()) / 1000);
                if (remaining > 0) {
                    setCountdown(remaining);
                } else {
                    setCountdown(0);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [isLocked, lockoutTime]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isLocked) {
            setError(`Account terkunci. Coba lagi dalam ${countdown} detik.`);
            return;
        }

        if (!email || !password) {
            setError('Email dan password harus diisi');
            return;
        }

        setIsLoading(true);

        try {
            const result = await login(email, password);

            if (result.success) {
                navigate('/admin');
            } else {
                setError(result.error || 'Login gagal');
                setPassword('');
            }
        } catch (err) {
            setError('Terjadi kesalahan saat login');
        } finally {
            setIsLoading(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-secondary/10 pt-20 flex items-center justify-center">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                    className="max-w-md mx-auto"
                >
                    {/* Logo & Header */}
                    <div className="text-center mb-8">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.2, type: 'spring' }}
                            className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4"
                        >
                            <Shield className="h-8 w-8 text-white" />
                        </motion.div>
                        <h1 className="mb-2">Admin Login</h1>
                        <p className="text-muted-foreground">
                            Masuk ke dashboard admin Lapak Android
                        </p>
                    </div>

                    {/* Login Form */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3 }}
                        className="bg-card rounded-2xl shadow-xl border border-border p-8"
                    >

                        {/* Error Message */}
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={`mb-6 p-4 rounded-xl flex items-start gap-3 ${isLocked
                                    ? 'bg-red-500/10 text-red-500 border border-red-500/20'
                                    : 'bg-amber-500/10 text-amber-500 border border-amber-500/20'
                                    }`}
                            >
                                <AlertTriangle className="h-5 w-5 mt-0.5 flex-shrink-0" />
                                <div className="flex-1">
                                    <p className="text-sm font-medium">{error}</p>
                                    {isLocked && countdown > 0 && (
                                        <div className="mt-2 flex items-center gap-2 text-xs">
                                            <Clock className="h-4 w-4" />
                                            <span>Waktu tersisa: {formatTime(countdown)}</span>
                                        </div>
                                    )}
                                </div>
                            </motion.div>
                        )}

                        {/* Login Attempts */}
                        {loginAttempts > 0 && !isLocked && (
                            <div className="mb-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                                <div className="flex items-center gap-2 text-sm text-amber-600 dark:text-amber-500">
                                    <AlertTriangle className="h-4 w-4" />
                                    <span>
                                        Percobaan login: {loginAttempts}/{MAX_ATTEMPTS}
                                    </span>
                                </div>
                                <div className="mt-2 w-full bg-muted rounded-full h-2">
                                    <div
                                        className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                        style={{ width: `${(loginAttempts / MAX_ATTEMPTS) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Form */}
                        <form onSubmit={handleSubmit} className="space-y-5">
                            {/* Email */}
                            <div>
                                <label className="block text-sm mb-2">Email</label>
                                <div className="relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type="email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        disabled={isLocked || isLoading}
                                        placeholder="Masukkan email"
                                        className="w-full pl-12 pr-4 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                </div>
                            </div>

                            {/* Password */}
                            <div>
                                <label className="block text-sm mb-2">Password</label>
                                <div className="relative">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        disabled={isLocked || isLoading}
                                        placeholder="Masukkan password"
                                        className="w-full pl-12 pr-12 py-3.5 bg-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        disabled={isLocked || isLoading}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5" />
                                        ) : (
                                            <Eye className="h-5 w-5" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                disabled={isLocked || isLoading}
                                className="w-full py-3.5 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        <span>Memverifikasi...</span>
                                    </>
                                ) : isLocked ? (
                                    <>
                                        <Lock className="h-5 w-5" />
                                        <span>Account Terkunci</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle className="h-5 w-5" />
                                        <span>Login</span>
                                    </>
                                )}
                            </button>
                        </form>

                        {/* Demo Credentials
                        <div className="mt-6 p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl">
                            <p className="text-sm text-blue-600 dark:text-blue-400 mb-2">
                                <strong>Demo Credentials:</strong>
                            </p>
                            <div className="text-xs text-muted-foreground space-y-1">
                                <p>Username: <code className="px-2 py-1 bg-muted rounded">admin</code></p>
                                <p>Password: <code className="px-2 py-1 bg-muted rounded">admin123</code></p>
                            </div>
                        </div> */}
                    </motion.div>

                    {/* Back to Website */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.5 }}
                        className="text-center mt-6"
                    >
                        <button
                            onClick={() => navigate('/')}
                            className="text-muted-foreground hover:text-primary transition-colors"
                        >
                            ← Kembali ke Website
                        </button>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
