


import React, { useState } from 'react';
import { useForm } from "react-hook-form";
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { asyncCurrentUser, asyncLogin } from '../store/actions/userActions';
import { motion } from 'framer-motion';
import { asyncLoginBackend } from '../store/actions/userActions';

const Login = () => {
    const { handleSubmit, register } = useForm();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [focusedInput, setFocusedInput] = useState(null);
    const [googleLoading, setGoogleLoading] = useState(false);

    const submitHandler = (user) => {
        dispatch(asyncLoginBackend(user));
        navigate("/");
    };

    // ✅ Google OAuth Login Handler
    const handleGoogleLogin = async () => {
        try {
            setGoogleLoading(true);
            const backendUrl = import.meta.env.VITE_BACKEND_URL || 'https://tumor-trace-backend.onrender.com';
            window.location.href = `${backendUrl}/api/auth/google`;
        } catch (error) {
            console.error('Google login failed:', error);
            setGoogleLoading(false);
        }
    };

    // ✅ Handle OAuth callback from backend
    React.useEffect(() => {
        // Check if there's a token in the URL (callback from Google)
        const params = new URLSearchParams(window.location.search);
        const token = params.get('token');
        const userData = params.get('user');

        if (token && userData) {
            try {
                // ✅ Save token to localStorage
                localStorage.setItem('authToken', token);
                console.log('✅ Token saved:', token.substring(0, 20) + '...');

                // ✅ Parse and save user data
                const user = JSON.parse(decodeURIComponent(userData));
                localStorage.setItem('user', JSON.stringify(user));
                console.log('✅ User data saved:', user);

                // ✅ Dispatch to Redux
                dispatch(asyncCurrentUser());

                // ✅ Clear URL and redirect to home
                window.history.replaceState({}, document.title, window.location.pathname);
                navigate("/");
            } catch (error) {
                console.error('❌ Error processing Google auth:', error);
            }
        }
    }, [navigate, dispatch]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 px-3 sm:px-4 py-8 sm:py-12 relative overflow-hidden">

            {/* Animated Background Orbs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none">
                <motion.div
                    className="absolute -top-40 -left-40 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-teal-500/50 via-cyan-400/40 to-teal-500/50 rounded-full blur-3xl"
                    animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.7, 0.5] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
                />
                <motion.div
                    className="absolute -bottom-40 -right-40 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-gradient-to-tl from-cyan-500/50 via-blue-500/40 to-transparent rounded-full blur-3xl"
                    animate={{ scale: [1.2, 1, 1.2], opacity: [0.7, 0.5, 0.7] }}
                    transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                />
                <motion.div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-blue-500/40 via-teal-500/30 to-transparent rounded-full blur-3xl"
                    animate={{ rotate: [0, 360], scale: [1, 1.3, 1] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Particles */}
            <div className="fixed inset-0 pointer-events-none">
                {[...Array(20)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute w-1 h-1 bg-teal-400/60 rounded-full"
                        style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
                        animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
                        transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
                    />
                ))}
            </div>

            {/* Grid Pattern */}
            <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
                <motion.div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)',
                        backgroundSize: '50px 50px'
                    }}
                    animate={{ backgroundPosition: ['0px 0px', '50px 50px'] }}
                    transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                />
            </div>

            {/* Login Card */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative w-full max-w-7xl z-10"
            >
                <motion.div
                    className="absolute -inset-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-300 rounded-[3rem] opacity-40 blur-3xl"
                    animate={{ opacity: [0.4, 0.6, 0.4], scale: [1, 1.02, 1] }}
                    transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                />

                <form
                    onSubmit={handleSubmit(submitHandler)}
                    className="relative bg-slate-900 backdrop-blur-md border-2 border-slate-700 rounded-3xl overflow-hidden"
                >
                    <motion.div
                        className="absolute inset-0 opacity-80"
                        animate={{
                            background: [
                                'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)',
                                'radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)',
                                'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)',
                            ],
                        }}
                        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
                    />

                    <div className="absolute top-0 left-0 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-br from-teal-500/20 to-transparent rounded-br-full"></div>
                    <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-tl-full"></div>

                    {/* ✅ MOBILE: Single column layout on mobile */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

                        {/* Left Side - Branding */}
                        {/* ✅ MOBILE: Larger padding and text */}
                        <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-b lg:border-b-0 lg:border-r border-slate-700">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.3, duration: 0.8 }}
                            >
                                {/* Logo */}
                                <div className="mb-8 sm:mb-8">
                                    <motion.div
                                        className="inline-flex items-center justify-center w-20 h-20 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl border-2 border-teal-400/50 backdrop-blur-sm relative group"
                                        initial={{ scale: 0, rotate: -180 }}
                                        animate={{ scale: 1, rotate: 0 }}
                                        transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
                                    >
                                        <motion.div
                                            className="absolute inset-0 bg-gradient-to-br from-teal-500/50 to-cyan-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
                                            animate={{ scale: [1, 1.2, 1] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        />
                                        <span className="text-4xl sm:text-4xl relative z-10">🔬</span>
                                    </motion.div>
                                </div>

                                {/* Heading */}
                                {/* ✅ MOBILE: Much larger heading */}
                                <h1 className="text-5xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5 sm:mb-6">
                                    <span className="relative inline-block">
                                        <motion.span
                                            className="absolute -inset-2 bg-gradient-to-r from-teal-400/50 via-cyan-400/50 to-blue-400/50 blur-2xl"
                                            animate={{ opacity: [0.5, 0.8, 0.5] }}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        <span className="relative bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                                            Welcome Back
                                        </span>
                                    </span>
                                </h1>

                                {/* ✅ MOBILE: Larger text */}
                                <p className="text-slate-100 text-lg sm:text-xl mb-8 sm:mb-8 leading-relaxed">
                                    Sign in to access your medical dashboard and continue your bone tumor analysis
                                </p>

                                {/* Feature List */}
                                <div className="space-y-4 sm:space-y-4 font-mono text-lg sm:text-lg">
                                    {[
                                        { icon: '🎯', text: '98.2% Diagnostic Accuracy' },
                                        { icon: '⚡', text: 'Real-time Analysis Results' },
                                        { icon: '🔒', text: 'HIPAA Compliant & Secure' },
                                    ].map((item, idx) => (
                                        <motion.div
                                            key={idx}
                                            className="flex items-center gap-3 text-slate-200"
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                                        >
                                            <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-teal-500/50 flex-shrink-0">
                                                <span className="text-2xl sm:text-xl">{item.icon}</span>
                                            </div>
                                            <span className="font-medium text-lg sm:text-base">{item.text}</span>
                                        </motion.div>
                                    ))}
                                </div>

                                {/* Status Badge */}
                                <motion.div
                                    className="mt-10 sm:mt-12"
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: 0.9 }}
                                >
                                    <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-full border border-teal-400/50">
                                        <span className="relative flex h-2 w-2">
                                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                                            <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300"></span>
                                        </span>
                                        <span className="text-sm sm:text-sm font-bold text-teal-300 tracking-widest uppercase">Secure Access Portal</span>
                                    </div>
                                </motion.div>
                            </motion.div>
                        </div>

                        {/* Right Side - Form */}
                        {/* ✅ MOBILE: Larger padding */}
                        <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4, duration: 0.8 }}
                                className="max-w-md mx-auto w-full"
                            >
                                {/* Form Header */}
                                {/* ✅ MOBILE: Larger heading */}
                                <div className="mb-10 sm:mb-10">
                                    <h2 className="text-3xl sm:text-3xl font-bold text-white mb-3">Sign In</h2>
                                    <p className="text-slate-300 text-lg sm:text-base">Enter your credentials to continue</p>
                                </div>

                                {/* Input Fields */}
                                {/* ✅ MOBILE: Larger inputs with better spacing */}
                                <div className="space-y-5 sm:space-y-5 mb-6 sm:mb-6">
                                    {/* Email */}
                                    <div className="relative group">
                                        <motion.div
                                            className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/0 via-cyan-500/0 to-blue-500/0 rounded-[1.3rem] opacity-0 group-focus-within:opacity-100 blur transition-all duration-500"
                                            animate={focusedInput === 'email' ? {
                                                background: [
                                                    'linear-gradient(90deg, rgba(20,184,166,0.9) 0%, rgba(6,182,212,0.9) 100%)',
                                                    'linear-gradient(180deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.9) 100%)',
                                                    'linear-gradient(90deg, rgba(20,184,166,0.9) 0%, rgba(6,182,212,0.9) 100%)',
                                                ],
                                            } : {}}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        <div className="relative">
                                            <div className="absolute left-5 sm:left-5 top-1/2 -translate-y-1/2 z-10">
                                                <motion.span
                                                    className="text-2xl sm:text-2xl"
                                                    animate={focusedInput === 'email' ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    📧
                                                </motion.span>
                                            </div>
                                            <input
                                                {...register("email")}
                                                type="email"
                                                placeholder="Enter your email"
                                                onFocus={() => setFocusedInput('email')}
                                                onBlur={() => setFocusedInput(null)}
                                                className="relative w-full text-lg sm:text-lg p-5 sm:p-5 pl-16 sm:pl-16 rounded-2xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            {focusedInput === 'email' && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-5 sm:right-5 top-1/2 -translate-y-1/2">
                                                    <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse"></div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Password */}
                                    <div className="relative group">
                                        <motion.div
                                            className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/0 via-blue-500/0 to-teal-500/0 rounded-[1.3rem] opacity-0 group-focus-within:opacity-100 blur transition-all duration-500"
                                            animate={focusedInput === 'password' ? {
                                                background: [
                                                    'linear-gradient(90deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.9) 100%)',
                                                    'linear-gradient(180deg, rgba(59,130,246,0.9) 0%, rgba(20,184,166,0.9) 100%)',
                                                    'linear-gradient(90deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.9) 100%)',
                                                ],
                                            } : {}}
                                            transition={{ duration: 3, repeat: Infinity }}
                                        />
                                        <div className="relative">
                                            <div className="absolute left-5 sm:left-5 top-1/2 -translate-y-1/2 z-10">
                                                <motion.span
                                                    className="text-2xl sm:text-2xl"
                                                    animate={focusedInput === 'password' ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                                                    transition={{ duration: 0.5 }}
                                                >
                                                    🔐
                                                </motion.span>
                                            </div>
                                            <input
                                                {...register("password")}
                                                type="password"
                                                placeholder="Enter your password"
                                                onFocus={() => setFocusedInput('password')}
                                                onBlur={() => setFocusedInput(null)}
                                                className="relative w-full text-lg sm:text-lg p-5 sm:p-5 pl-16 sm:pl-16 rounded-2xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                                            />
                                            {focusedInput === 'password' && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-5 sm:right-5 top-1/2 -translate-y-1/2">
                                                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </div>

                                {/* Remember & Forgot */}
                                <div className="flex items-center justify-between mb-8 sm:mb-8 px-1">
                                    <label className="flex items-center gap-2 cursor-pointer group/check">
                                        <div className="relative w-5 h-5">
                                            <input type="checkbox" className="sr-only peer" />
                                            <div className="w-7 h-7 border-2 border-slate-600 rounded bg-slate-800 peer-checked:bg-gradient-to-br peer-checked:from-teal-500 peer-checked:to-cyan-500 peer-checked:border-teal-400 transition-all"></div>
                                            <div className="mx-auto my-3 absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-0 peer-checked:opacity-100 pointer-events-none">&nbsp;✓</div>
                                        </div>
                                        <span className="mx-2 text-lg sm:text-base text-slate-200 group-hover/check:text-slate-300 transition-colors">Remember me</span>
                                    </label>
                                    <Link to="/forgot-password" className="text-sm sm:text-sm text-teal-400 hover:text-teal-300 transition-colors font-semibold">
                                        Forgot password?
                                    </Link>
                                </div>

                                {/* Login Button */}
                                {/* ✅ MOBILE: Larger button */}
                                <motion.button
                                    type="submit"
                                    className="relative group w-full py-4 sm:py-3 rounded-2xl overflow-hidden mb-6 sm:mb-6 flex items-center justify-center"
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"
                                        animate={{ backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'] }}
                                        transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                                        style={{ backgroundSize: '200% 200%' }}
                                    />
                                    <motion.div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                                    <div className="absolute inset-0 opacity-50">
                                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000"></div>
                                    </div>
                                    <span className="relative flex items-center justify-center gap-3 text-xl sm:text-xl font-bold text-white mx-auto">
                                        <span>Sign In</span>
                                        <motion.span
                                            animate={{ x: [0, 5, 0] }}
                                            transition={{ duration: 1.5, repeat: Infinity }}
                                            className='text-4xl sm:text-4xl'
                                        >
                                            →
                                        </motion.span>
                                    </span>
                                </motion.button>

                                {/* Divider */}
                                <div className="relative my-6 sm:my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-slate-700"></div>
                                    </div>
                                    <div className="relative flex justify-center">
                                        <span className="px-4 text-lg sm:text-base text-slate-200 bg-slate-900 font-medium rounded-lg">or continue with</span>
                                    </div>
                                </div>

                                {/* Social Buttons */}
                                {/* ✅ MOBILE: Larger buttons */}
                                <div className="grid grid-cols-2 gap-4 mb-6 sm:mb-6">
                                    {/* ✅ Google Login Button */}
                                    <motion.button
                                        type="button"
                                        onClick={handleGoogleLogin}
                                        disabled={googleLoading}
                                        className="group relative py-4 sm:py-3 rounded-xl bg-slate-800 border border-slate-600 text-white font-semibold overflow-hidden backdrop-blur-sm hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        whileHover={{ scale: !googleLoading ? 1.05 : 1 }}
                                        whileTap={{ scale: !googleLoading ? 0.95 : 1 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                                        <span className="relative flex items-center justify-center text-lg sm:text-base font-bold text-white">
                                            {googleLoading ? (
                                                <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⏳</motion.span>
                                            ) : (
                                                <>🔍 Google</>
                                            )}
                                        </span>
                                    </motion.button>

                                    {/* GitHub Button */}
                                    <motion.button
                                        type="button"
                                        onClick={() => window.open("https://github.com/capten05ast", "_blank")}
                                        className="group relative py-4 sm:py-3 rounded-xl bg-slate-800 border border-slate-600 text-white font-semibold overflow-hidden backdrop-blur-sm hover:border-cyan-500"
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
                                        <span className="relative flex items-center justify-center text-lg sm:text-base font-bold text-white">⚡ Github</span>
                                    </motion.button>
                                </div>

                                {/* Sign Up */}
                                <div className="text-center p-4 sm:p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
                                    <p className="text-slate-300 text-lg sm:text-sm">
                                        Don't have an account?{" "}
                                        <Link to="/register" className="text-teal-400 font-bold hover:text-teal-300 transition-colors relative group/link">
                                            <span className="relative">
                                                Create Account
                                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 group-hover/link:w-full transition-all duration-300"></span>
                                            </span>
                                        </Link>
                                    </p>
                                </div>

                                {/* Security Badge */}
                                <div className="mt-6 sm:mt-6 flex items-center justify-center gap-2 text-sm sm:text-xs text-slate-400">
                                    <motion.span
                                        className="w-2 h-2 bg-green-400 rounded-full"
                                        animate={{ boxShadow: ['0 0 0 0 rgba(74, 222, 128, 0.9)', '0 0 0 8px rgba(74, 222, 128, 0)'] }}
                                        transition={{ duration: 1.5, repeat: Infinity }}
                                    />
                                    <span>256-bit SSL Encryption</span>
                                </div>
                            </motion.div>
                        </div>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default Login;

