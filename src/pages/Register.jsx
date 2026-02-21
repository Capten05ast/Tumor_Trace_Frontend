


import React, { useState, useEffect } from "react";
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
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const submitHandler = (user) => {
    dispatch(asyncRegisterBackend(user));
    navigate("/login");
  };

  const handleGoogleRegister = async () => {
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
  };

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
    <div className="min-h-screen flex items-center justify-center bg-slate-950 px-3 sm:px-4 py-8 sm:py-12 relative overflow-hidden">

      {/* Animated Background Orbs - DISABLED ON MOBILE */}
      {!isMobile && (
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
      )}

      {/* Static Background for Mobile */}
      {isMobile && (
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-40 -left-40 w-[300px] h-[300px] bg-gradient-to-br from-teal-500/30 via-cyan-400/20 to-teal-500/30 rounded-full blur-3xl" />
          <div className="absolute -bottom-40 -right-40 w-[300px] h-[300px] bg-gradient-to-tl from-cyan-500/30 via-blue-500/20 to-transparent rounded-full blur-3xl" />
        </div>
      )}

      {/* Particles - REDUCED ON MOBILE */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(isMobile ? 5 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-teal-400/60 rounded-full"
            style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
            animate={{ y: [0, -30, 0], opacity: [0, 1, 0] }}
            transition={{ duration: 3 + Math.random() * 2, repeat: Infinity, delay: Math.random() * 5 }}
          />
        ))}
      </div>

      {/* Grid Pattern - DISABLED ON MOBILE */}
      {!isMobile && (
        <div className="fixed inset-0 opacity-[0.05] pointer-events-none">
          <motion.div
            className="absolute inset-0"
            style={{
              backgroundImage: "radial-gradient(circle at 2px 2px, rgb(148, 163, 184) 1px, transparent 0)",
              backgroundSize: "50px 50px",
            }}
            animate={{ backgroundPosition: ["0px 0px", "50px 50px"] }}
            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          />
        </div>
      )}

      {/* Register Card */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative w-full max-w-7xl z-10"
      >
        <motion.div
          className="absolute -inset-4 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-300 rounded-[3rem] opacity-40 blur-3xl"
          animate={!isMobile ? { opacity: [0.4, 0.6, 0.4], scale: [1, 1.02, 1] } : {}}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />

        <form
          onSubmit={handleSubmit(submitHandler)}
          className="relative bg-slate-900 backdrop-blur-md border-2 border-slate-700 rounded-3xl overflow-hidden"
        >
          <motion.div
            className="absolute inset-0 opacity-80"
            animate={!isMobile ? {
              background: [
                "radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 80% 70%, rgba(6, 182, 212, 0.3) 0%, transparent 50%)",
                "radial-gradient(circle at 20% 30%, rgba(20, 184, 166, 0.3) 0%, transparent 50%)",
              ],
            } : {}}
            transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
          />

          <div className="absolute top-0 left-0 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-br from-teal-500/20 to-transparent rounded-br-full" />
          <div className="absolute bottom-0 right-0 w-40 h-40 sm:w-60 sm:h-60 bg-gradient-to-tl from-cyan-500/20 to-transparent rounded-tl-full" />

          <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[600px]">

            {/* Left Side — Branding */}
            <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center bg-gradient-to-br from-teal-500/10 to-cyan-500/10 border-b lg:border-b-0 lg:border-r border-slate-700">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.8 }}
              >
                <div className="mb-8">
                  <motion.div
                    className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-teal-500/30 via-cyan-500/30 to-blue-500/30 rounded-2xl border-2 border-teal-400/50 backdrop-blur-sm relative group"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.5 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-br from-teal-500/50 to-cyan-500/50 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-opacity"
                      animate={!isMobile ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                    <span className="text-4xl relative z-10">🔬</span>
                  </motion.div>
                </div>

                <h1 className="text-5xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight mb-5 sm:mb-6">
                  <span className="relative inline-block">
                    <motion.span
                      className="absolute -inset-2 bg-gradient-to-r from-teal-400/50 via-cyan-400/50 to-blue-400/50 blur-2xl"
                      animate={!isMobile ? { opacity: [0.5, 0.8, 0.5] } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <span className="relative bg-gradient-to-r from-teal-400 via-cyan-300 to-blue-400 bg-clip-text text-transparent">
                      Join Our Platform
                    </span>
                  </span>
                </h1>

                <p className="text-slate-100 text-lg sm:text-xl mb-8 leading-relaxed">
                  Create your account and start analyzing bone tumors with cutting-edge AI technology
                </p>

                <div className="space-y-4 font-mono text-lg sm:text-lg">
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
                      transition={{ delay: 0.5 + idx * 0.1, duration: 0.5 }}
                    >
                      <div className="w-11 h-11 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-xl flex items-center justify-center border border-teal-500/50 flex-shrink-0">
                        <span className="text-2xl sm:text-xl">{item.icon}</span>
                      </div>
                      <span className="font-medium text-lg sm:text-base">{item.text}</span>
                    </motion.div>
                  ))}
                </div>

                <motion.div className="mt-10 sm:mt-12" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9 }}>
                  <div className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 rounded-full border border-teal-400/50">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-300 opacity-75" />
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-teal-300" />
                    </span>
                    <span className="text-sm font-bold text-teal-300 tracking-widest uppercase">Free Registration</span>
                  </div>
                </motion.div>
              </motion.div>
            </div>

            {/* Right Side — Form */}
            <div className="relative p-8 sm:p-12 lg:p-16 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.8 }}
                className="max-w-md mx-auto w-full"
              >
                <div className="mb-10">
                  <h2 className="text-3xl font-bold text-white mb-3">Create Account</h2>
                  <p className="text-slate-300 text-lg sm:text-base">Join us and get started today</p>
                </div>

                <div className="space-y-5 mb-5">

                  {/* Username */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 rounded-[1.3rem] opacity-0 group-focus-within:opacity-100 blur transition-all duration-500"
                      animate={focusedInput === "username" ? {
                        background: [
                          "linear-gradient(90deg, rgba(20,184,166,0.9) 0%, rgba(6,182,212,0.9) 100%)",
                          "linear-gradient(180deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.9) 100%)",
                          "linear-gradient(90deg, rgba(20,184,166,0.9) 0%, rgba(6,182,212,0.9) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                        <motion.span className="text-2xl"
                          animate={focusedInput === "username" ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 0.5 }}>👤</motion.span>
                      </div>
                      <input
                        {...register("username")}
                        type="text"
                        placeholder="Enter your username"
                        onFocus={() => setFocusedInput("username")}
                        onBlur={() => setFocusedInput(null)}
                        className="relative w-full text-lg sm:text-lg p-5 pl-16 rounded-2xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder-slate-400 outline-none focus:border-teal-400 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                      />
                      {focusedInput === "username" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-5 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Email */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 rounded-[1.3rem] opacity-0 group-focus-within:opacity-100 blur transition-all duration-500"
                      animate={focusedInput === "email" ? {
                        background: [
                          "linear-gradient(90deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.9) 100%)",
                          "linear-gradient(180deg, rgba(59,130,246,0.9) 0%, rgba(20,184,166,0.9) 100%)",
                          "linear-gradient(90deg, rgba(6,182,212,0.9) 0%, rgba(59,130,246,0.9) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                        <motion.span className="text-2xl"
                          animate={focusedInput === "email" ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.5 }}>📧</motion.span>
                      </div>
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="Enter your email"
                        onFocus={() => setFocusedInput("email")}
                        onBlur={() => setFocusedInput(null)}
                        className="relative w-full text-lg sm:text-lg p-5 pl-16 rounded-2xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder-slate-400 outline-none focus:border-cyan-400 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                      />
                      {focusedInput === "email" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-5 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 rounded-[1.3rem] opacity-0 group-focus-within:opacity-100 blur transition-all duration-500"
                      animate={focusedInput === "password" ? {
                        background: [
                          "linear-gradient(90deg, rgba(59,130,246,0.9) 0%, rgba(20,184,166,0.9) 100%)",
                          "linear-gradient(180deg, rgba(20,184,166,0.9) 0%, rgba(6,182,212,0.9) 100%)",
                          "linear-gradient(90deg, rgba(59,130,246,0.9) 0%, rgba(20,184,166,0.9) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                        <motion.span className="text-2xl"
                          animate={focusedInput === "password" ? { scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] } : {}}
                          transition={{ duration: 0.5 }}>🔐</motion.span>
                      </div>
                      <input
                        {...register("password")}
                        type="password"
                        placeholder="Create a password"
                        onFocus={() => setFocusedInput("password")}
                        onBlur={() => setFocusedInput(null)}
                        className="relative w-full text-lg sm:text-lg p-5 pl-16 rounded-2xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder-slate-400 outline-none focus:border-blue-400 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                      />
                      {focusedInput === "password" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-5 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Age */}
                  <div className="relative group">
                    <motion.div
                      className="absolute -inset-0.5 rounded-[1.3rem] opacity-0 group-focus-within:opacity-100 blur transition-all duration-500"
                      animate={focusedInput === "age" ? {
                        background: [
                          "linear-gradient(90deg, rgba(168,85,247,0.9) 0%, rgba(236,72,153,0.9) 100%)",
                          "linear-gradient(180deg, rgba(236,72,153,0.9) 0%, rgba(20,184,166,0.9) 100%)",
                          "linear-gradient(90deg, rgba(168,85,247,0.9) 0%, rgba(236,72,153,0.9) 100%)",
                        ],
                      } : {}}
                      transition={{ duration: 3, repeat: Infinity }}
                    />
                    <div className="relative">
                      <div className="absolute left-5 top-1/2 -translate-y-1/2 z-10">
                        <motion.span className="text-2xl"
                          animate={focusedInput === "age" ? { scale: [1, 1.2, 1], rotate: [0, -10, 10, 0] } : {}}
                          transition={{ duration: 0.5 }}>🎂</motion.span>
                      </div>
                      <input
                        {...register("age")}
                        type="number"
                        placeholder="Enter your age"
                        min="1"
                        max="150"
                        onFocus={() => setFocusedInput("age")}
                        onBlur={() => setFocusedInput(null)}
                        className="relative w-full text-lg sm:text-lg p-5 pl-16 rounded-2xl bg-slate-800/80 border-2 border-slate-700 text-white placeholder-slate-400 outline-none focus:border-purple-400 focus:bg-slate-800 transition-all duration-300 backdrop-blur-sm"
                      />
                      {focusedInput === "age" && (
                        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute right-5 top-1/2 -translate-y-1/2">
                          <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse" />
                        </motion.div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mb-8 px-1">
                  <label className="flex items-center gap-2 cursor-pointer group/check">
                    <div className="relative w-5 h-5">
                      <input type="checkbox" className="sr-only peer" required />
                      <div className="w-7 h-7 border-2 border-slate-600 rounded bg-slate-800 peer-checked:bg-gradient-to-br peer-checked:from-teal-500 peer-checked:to-cyan-500 peer-checked:border-teal-400 transition-all" />
                      <div className="mx-auto my-3 absolute inset-0 flex items-center justify-center text-white text-xl font-bold opacity-0 peer-checked:opacity-100 pointer-events-none">&nbsp;✓</div>
                    </div>
                    <span className="mx-2 text-lg sm:text-base text-slate-200 group-hover/check:text-slate-300 transition-colors">
                      I agree to the{" "}
                      <Link to="/terms" className="text-teal-400 hover:text-teal-300 font-bold">Terms of Service</Link>
                      {" "}and{" "}
                      <Link to="/privacy" className="text-teal-400 hover:text-teal-300 font-bold">Privacy Policy</Link>
                    </span>
                  </label>
                </div>

                <motion.button
                  type="submit"
                  className="relative group w-full py-4 sm:py-3 rounded-2xl overflow-hidden mb-6 flex items-center justify-center"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500"
                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                    style={{ backgroundSize: "200% 200%" }}
                  />
                  <motion.div className="absolute inset-0 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute inset-0 opacity-50">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12 group-hover:translate-x-full transition-transform duration-1000" />
                  </div>
                  <span className="relative flex items-center justify-center gap-3 text-xl sm:text-xl font-bold text-white mx-auto">
                    <span>Create Account</span>
                    <motion.span
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                      className="text-4xl sm:text-4xl"
                    >→</motion.span>
                  </span>
                </motion.button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-700" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="px-4 text-lg sm:text-base text-slate-200 bg-slate-900 font-medium rounded-lg">or register with</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <motion.button
                    type="button"
                    onClick={handleGoogleRegister}
                    disabled={googleLoading}
                    className="group relative py-4 sm:py-3 rounded-xl bg-slate-800 border border-slate-600 text-white font-semibold overflow-hidden backdrop-blur-sm hover:border-teal-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    whileHover={{ scale: !googleLoading ? 1.05 : 1 }}
                    whileTap={{ scale: !googleLoading ? 0.95 : 1 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-teal-500/0 to-cyan-500/0 group-hover:from-teal-500/20 group-hover:to-cyan-500/20 transition-all duration-300" />
                    <span className="relative flex items-center justify-center text-lg sm:text-base font-bold text-white">
                      {googleLoading ? (
                        <motion.span animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }}>⏳</motion.span>
                      ) : (
                        <>🔍 Google</>
                      )}
                    </span>
                  </motion.button>

                  <motion.button
                    type="button"
                    onClick={() => window.open("https://github.com/capten05ast", "_blank")}
                    className="group relative py-4 sm:py-3 rounded-xl bg-slate-800 border border-slate-600 text-white font-semibold overflow-hidden backdrop-blur-sm hover:border-cyan-500"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 transition-all duration-300" />
                    <span className="relative flex items-center justify-center text-lg sm:text-base font-bold text-white">⚡ Github</span>
                  </motion.button>
                </div>

                <div className="text-center p-4 bg-slate-800/60 border border-slate-700 rounded-xl">
                  <p className="text-slate-300 text-lg sm:text-sm">
                    Already have an account?{" "}
                    <Link to="/login" className="text-teal-400 font-bold hover:text-teal-300 transition-colors relative group/link">
                      <span className="relative">
                        Sign In
                        <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-400 to-cyan-400 group-hover/link:w-full transition-all duration-300" />
                      </span>
                    </Link>
                  </p>
                </div>

                <div className="mt-6 flex items-center justify-center gap-2 text-sm sm:text-xs text-slate-400">
                  <motion.span
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ boxShadow: ["0 0 0 0 rgba(74, 222, 128, 0.9)", "0 0 0 8px rgba(74, 222, 128, 0)"] }}
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


