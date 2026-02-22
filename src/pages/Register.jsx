


import React, { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { asyncCurrentUser, asyncRegisterBackend } from "../store/actions/userActions";
import { motion } from "framer-motion";

const Register = () => {
  const { handleSubmit, register } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [focusedInput, setFocusedInput] = useState(null);
  const [googleLoading, setGoogleLoading] = useState(false);

  const submitHandler = useCallback((user) => {
    dispatch(asyncRegisterBackend(user));
    navigate("/login");
  }, [dispatch, navigate]);

  const handleGoogleRegister = useCallback(async () => {
    try {
      setGoogleLoading(true);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || "https://tumor-trace-backend.onrender.com";
      const authUrl = `${backendUrl}/api/auth/google`;
      console.log('🔗 Redirecting to Google OAuth:', authUrl);
      window.location.href = authUrl;
    } catch (error) {
      console.error("Google registration failed:", error);
      setGoogleLoading(false);
    }
  }, []);

  React.useEffect(() => {
    console.log('🔍 ===== OAUTH CALLBACK CHECK (REGISTER) =====');
    console.log('📍 Current URL:', window.location.href);
    
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const userData = params.get("user");

    console.log('📝 Token from URL:', token ? `✅ YES (${token.substring(0, 20)}...)` : '❌ NO');
    console.log('📝 User from URL:', userData ? '✅ YES' : '❌ NO');

    if (token && userData) {
      console.log('🟢 Both token and userData found! Processing...');
      try {
        localStorage.setItem("authToken", token);
        console.log('✅ Token saved to localStorage');

        const user = JSON.parse(decodeURIComponent(userData));
        localStorage.setItem("user", JSON.stringify(user));
        console.log('✅ User data saved to localStorage:', user);

        console.log('🔄 Dispatching asyncCurrentUser to Redux...');
        dispatch(asyncCurrentUser());

        console.log('🧹 Clearing URL and redirecting to home...');
        window.history.replaceState({}, document.title, '/');
        
        navigate("/", { replace: true });
        console.log('✅ Navigated to home!');
        
      } catch (error) {
        console.error('❌ Error processing OAuth callback:', error);
        console.error('Error details:', error.message);
        navigate("/register");
      }
    } else {
      console.log('🟡 No OAuth callback detected (normal on regular registration page)');
    }
    console.log('============================\n');
  }, [navigate, dispatch]);

  return (
    <div className="min-h-screen w-full bg-slate-950 flex items-center justify-center overflow-x-hidden">
      
      {/* Background - Optimized for mobile */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-20">
        {/* Top Left Orb */}
        <motion.div
          className="absolute -top-40 -left-40 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-gradient-to-br from-teal-500/50 via-cyan-400/40 to-teal-500/50 rounded-full blur-3xl will-change-transform"
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
        />
        {/* Bottom Right Orb */}
        <motion.div
          className="absolute -bottom-40 -right-40 w-80 h-80 sm:w-[600px] sm:h-[600px] bg-gradient-to-tl from-cyan-500/50 via-blue-500/40 to-transparent rounded-full blur-3xl will-change-transform"
          animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.3, 0.5] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        />
        {/* Center Orb - Reduced animation on mobile */}
        <motion.div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 sm:w-[400px] sm:h-[400px] bg-gradient-to-br from-blue-500/40 via-teal-500/30 to-transparent rounded-full blur-3xl will-change-transform"
          animate={{ rotate: [0, 180, 360], scale: [1, 1.2, 1] }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Particles - Optimized */}
      <div className="absolute inset-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/60 rounded-full will-change-transform"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`
            }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Grid Pattern - Very subtle, no animation */}
      <div className="absolute inset-0 w-full h-full opacity-[0.02] pointer-events-none -z-10">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: 'radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)',
            backgroundSize: '50px 50px'
          }}
        />
      </div>

      {/* Main Container */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="relative w-full h-full sm:h-auto px-4 sm:px-6 py-8 sm:py-12 z-10 flex items-center justify-center sm:max-w-7xl"
      >
        {/* Glow Background */}
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-300 rounded-3xl opacity-20 blur-2xl -z-10 will-change-transform hidden sm:block"
          animate={{ opacity: [0.2, 0.3, 0.2], scale: [1, 1.02, 1] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Form Card */}
        <form
          onSubmit={handleSubmit(submitHandler)}
          className="relative w-full bg-slate-900/95 backdrop-blur-md border border-slate-700 rounded-2xl sm:rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Animated Background - Optimized */}
          <motion.div
            className="absolute inset-0 opacity-60 pointer-events-none"
            animate={{
              background: [
                'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.2) 0%, transparent 50%)',
                'radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.2) 0%, transparent 50%)',
              ],
            }}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          {/* Corner Decorations */}
          <div className="absolute top-0 left-0 w-32 h-32 sm:w-60 sm:h-60 bg-gradient-to-br from-teal-500/10 to-transparent rounded-br-full pointer-events-none"></div>
          <div className="absolute bottom-0 right-0 w-32 h-32 sm:w-60 sm:h-60 bg-gradient-to-tl from-cyan-500/10 to-transparent rounded-tl-full pointer-events-none"></div>

          {/* Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-screen sm:min-h-[600px]">

            {/* Left Side - Branding */}
            <div className="relative hidden lg:flex lg:flex-col lg:justify-center p-8 sm:p-12 lg:p-16 bg-gradient-to-br from-teal-500/5 to-cyan-500/5 border-b lg:border-b-0 lg:border-r border-slate-700">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
                className="space-y-8"
              >
                {/* Logo */}
                <div>
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl border border-teal-400/50 backdrop-blur-sm relative group"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.6, delay: 0.1, type: "spring", bounce: 0.4 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-500/50 to-cyan-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity duration-300"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-4xl relative z-10">🔬</span>
                  </motion.div>
                </div>

                {/* Heading */}
                <div>
                  <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-4">
                    <span className="relative inline-block">
                      <motion.span
                        className="absolute -inset-2 bg-gradient-to-r from-teal-400/40 via-cyan-400/40 to-blue-400/40 blur-xl"
                        animate={{ opacity: [0.4, 0.6, 0.4] }}
                        transition={{ duration: 3, repeat: Infinity }}
                      />
                      <span className="relative bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                        Join Our Platform
                      </span>
                    </span>
                  </h1>
                  <p className="text-slate-100 text-lg leading-relaxed">
                    Create your account and start analyzing bone tumors with cutting-edge AI technology
                  </p>
                </div>

                {/* Feature List */}
                <div className="space-y-3">
                  {[
                    { icon: "✨", text: "Advanced AI Diagnostics" },
                    { icon: "🎯", text: "Instant Analysis Results" },
                    { icon: "🔐", text: "Secure & Private Data" },
                    { icon: "📊", text: "Comprehensive Reports" },
                  ].map((item, idx) => (
                    <motion.div
                      key={idx}
                      className="flex items-center gap-3 text-slate-200"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 + idx * 0.1, duration: 0.5 }}
                    >
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-lg flex items-center justify-center border border-teal-500/50 flex-shrink-0">
                        <span className="text-xl">{item.icon}</span>
                      </div>
                      <span className="font-medium">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                {/* Status Badge */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-full border border-teal-400/50">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300"></span>
                    </span>
                    <span className="text-xs font-bold text-teal-300 tracking-widest uppercase">Free Registration</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="relative p-6 sm:p-10 lg:p-16 flex flex-col justify-center w-full">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="w-full max-w-sm mx-auto"
              >
                {/* Form Header */}
                <div className="mb-8">
                  <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">Create Account</h2>
                  <p className="text-slate-300 text-sm sm:text-base">Join us and get started today</p>
                </div>

                {/* Input Fields */}
                <div className="space-y-4 mb-6">

                  {/* Username */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300"
                      animate={focusedInput === "username" ? {
                        background: [
                          "linear-gradient(90deg, rgba(20,184,166,0.6) 0%, rgba(6,182,212,0.6) 100%)",
                          "linear-gradient(180deg, rgba(6,182,212,0.6) 0%, rgba(59,130,246,0.6) 100%)",
                          "linear-gradient(90deg, rgba(20,184,166,0.6) 0%, rgba(6,182,212,0.6) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <motion.span
                          className="text-2xl"
                          animate={focusedInput === "username" ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >👤</motion.span>
                      </div>
                      <input
                        {...register("username")}
                        type="text"
                        placeholder="Enter your username"
                        onFocus={() => setFocusedInput("username")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full text-base py-3 px-4 pl-14 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-teal-400 focus:bg-slate-800 transition-all duration-200"
                        autoComplete="username"
                      />
                      {focusedInput === "username" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300"
                      animate={focusedInput === "email" ? {
                        background: [
                          "linear-gradient(90deg, rgba(6,182,212,0.6) 0%, rgba(59,130,246,0.6) 100%)",
                          "linear-gradient(180deg, rgba(59,130,246,0.6) 0%, rgba(20,184,166,0.6) 100%)",
                          "linear-gradient(90deg, rgba(6,182,212,0.6) 0%, rgba(59,130,246,0.6) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <motion.span
                          className="text-2xl"
                          animate={focusedInput === "email" ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >📧</motion.span>
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full text-base py-3 px-4 pl-14 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-200"
                        autoComplete="email"
                      />
                      {focusedInput === "email" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-blue-500/20 to-teal-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300"
                      animate={focusedInput === "password" ? {
                        background: [
                          "linear-gradient(90deg, rgba(59,130,246,0.6) 0%, rgba(20,184,166,0.6) 100%)",
                          "linear-gradient(180deg, rgba(20,184,166,0.6) 0%, rgba(6,182,212,0.6) 100%)",
                          "linear-gradient(90deg, rgba(59,130,246,0.6) 0%, rgba(20,184,166,0.6) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <motion.span
                          className="text-2xl"
                          animate={focusedInput === "password" ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >🔐</motion.span>
                      </div>
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="Create a password"
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full text-base py-3 px-4 pl-14 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-blue-400 focus:bg-slate-800 transition-all duration-200"
                        autoComplete="new-password"
                      />
                      {focusedInput === "password" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Age */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-2xl opacity-0 group-focus-within:opacity-100 blur transition-all duration-300"
                      animate={focusedInput === "age" ? {
                        background: [
                          "linear-gradient(90deg, rgba(168,85,247,0.6) 0%, rgba(236,72,153,0.6) 100%)",
                          "linear-gradient(180deg, rgba(236,72,153,0.6) 0%, rgba(20,184,166,0.6) 100%)",
                          "linear-gradient(90deg, rgba(168,85,247,0.6) 0%, rgba(236,72,153,0.6) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
                        <motion.span
                          className="text-2xl"
                          animate={focusedInput === "age" ? { scale: [1, 1.15, 1] } : {}}
                          transition={{ duration: 0.4 }}
                        >🎂</motion.span>
                      </div>
                      <input
                        {...register("age")}
                        type="number"
                        placeholder="Enter your age"
                        min="1"
                        max="150"
                        onFocus={() => setFocusedInput("age")}
                        onBlur={() => setFocusedInput(null)}
                        className="w-full text-base py-3 px-4 pl-14 rounded-xl bg-slate-800/70 border border-slate-700 text-white placeholder-slate-500 outline-none focus:border-purple-400 focus:bg-slate-800 transition-all duration-200"
                      />
                      {focusedInput === "age" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-4 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Terms Checkbox */}
                <div className="mb-6 px-1">
                  <label className="flex items-center gap-2 cursor-pointer group/check text-sm">
                    <input type="checkbox" className="sr-only peer" required />
                    <div className="w-6 h-6 border border-slate-600 rounded bg-slate-800 peer-checked:bg-gradient-to-br peer-checked:from-teal-500 peer-checked:to-cyan-500 peer-checked:border-teal-400 transition-all flex items-center justify-center">
                      <span className="text-white text-sm opacity-0 peer-checked:opacity-100">✓</span>
                    </div>
                    <span className="text-slate-300">
                      I agree to the{" "}
                      <Link to="/terms" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-teal-400 hover:text-teal-300 font-bold transition-colors">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                {/* Create Account Button */}
                <motion.button
                  type="submit"
                  className="relative group w-full py-3 rounded-xl overflow-hidden mb-6 flex items-center justify-center bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:shadow-lg hover:shadow-teal-500/50 transition-all duration-300"
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <span className="relative flex items-center justify-center gap-2 text-base sm:text-lg font-bold text-white">
                    <span>Create Account</span>
                    <motion.span
                      animate={{ x: [0, 4, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >→</motion.span>
                  </span>
                </motion.button>

                {/* Divider */}
                <div className="relative my-5">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-3 text-xs sm:text-sm text-slate-400 bg-slate-900">or register with</span>
                  </div>
                </div>

                {/* Social Buttons */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  {/* Google Button */}
                  <motion.button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={googleLoading}
                    className="relative py-2.5 sm:py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white font-semibold text-sm sm:text-base overflow-hidden backdrop-blur-sm hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    whileHover={{ scale: !googleLoading ? 1.03 : 1 }}
                    whileTap={{ scale: !googleLoading ? 0.97 : 1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300"></div>
                    <span className="relative flex items-center justify-center mx-auto">
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
                    className="mx-auto relative py-2.5 sm:py-3 rounded-lg bg-slate-800/80 border border-slate-600 text-white font-semibold text-sm sm:text-base overflow-hidden backdrop-blur-sm hover:border-cyan-500 transition-colors duration-200"
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                  >
                    <div className="mx-auto absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300"></div>
                    <span className="mx-auto relative flex items-center justify-center">⚡ Github</span>
                  </motion.button>
                </div>

                {/* Sign In Link */}
                <div className="text-center p-4 bg-slate-800/40 border border-slate-700 rounded-lg">
                  <p className="text-slate-300 text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-400 font-bold hover:text-teal-300 transition-colors">
                      Sign In
                    </Link>
                  </p>
                </div>

                {/* Security Badge */}
                <div className="mt-5 flex items-center justify-center gap-2 text-xs text-slate-400">
                  <motion.span
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ boxShadow: ['0 0 0 0 rgba(74, 222, 128, 0.8)', '0 0 0 6px rgba(74, 222, 128, 0)'] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  />
                  <span>Your data is encrypted & secure</span>
                </div>
              </motion.div>
            </div>

          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Register;


