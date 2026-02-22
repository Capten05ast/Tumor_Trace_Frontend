


import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { asyncCurrentUser, asyncLogout, asyncLogoutBackend, asyncUpdateUserBackend } from '../store/actions/userActions';
import { Link, useNavigate } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import TrueFocus from '../componenets/TrueFocus';
import CircularGallery from '../componenets/CircularGallery';
import TextCursor from '../componenets/TextCursor';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.userReducer.users);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  const { scrollYProgress } = useScroll();
  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);

  const logouthandler = () => {
    dispatch(asyncLogout());
    dispatch(asyncLogoutBackend());
    navigate("/login");
  };

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!user || !user.id) {
      dispatch(asyncCurrentUser());
    }
  }, [dispatch]);

  useEffect(() => {
    if (isMobile) return;
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isMobile]);

  return (
    <div className="cursor-pointer min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-teal-700 relative overflow-hidden">

      {!isMobile && (
        <TextCursor
          text="⚪️"
          delay={0.01}
          spacing={20}
          followMouseDirection={true}
          randomFloat={true}
          exitDuration={0.2}
          removalInterval={20}
          maxPoints={10}
        />
      )}

      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-1/4 left-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-teal-500/15 rounded-full blur-3xl"
          animate={!isMobile ? { x: mousePosition.x * 0.02, y: mousePosition.y * 0.02 } : {}}
          transition={{ type: "spring", stiffness: 50 }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-[300px] h-[300px] md:w-[600px] md:h-[600px] bg-cyan-500/15 rounded-full blur-3xl"
          animate={!isMobile ? { x: mousePosition.x * -0.02, y: mousePosition.y * -0.02 } : {}}
          transition={{ type: "spring", stiffness: 50 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 w-[400px] h-[200px] md:w-[1000px] md:h-[500px] bg-blue-500/10 rounded-full blur-3xl"
          animate={!isMobile ? { x: mousePosition.x * 0.01, y: mousePosition.y * 0.01 } : {}}
          transition={{ type: "spring", stiffness: 50 }}
        />
      </div>

      {/* Floating Particles */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(isMobile ? 8 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 md:w-2 md:h-2 bg-yellow-200 rounded-full"
            initial={{
              x: Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400),
              y: Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)
            }}
            animate={{
              y: [null, Math.random() * (typeof window !== 'undefined' ? window.innerHeight : 800)],
              x: [null, Math.random() * (typeof window !== 'undefined' ? window.innerWidth : 400)],
            }}
            transition={{ duration: Math.random() * 10 + 20, repeat: Infinity, ease: "linear" }}
          />
        ))}
      </div>

      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-teal-900/20 via-transparent to-transparent pointer-events-none" />

      {/* Main Content */}
      <div className="relative z-10">

        {/* ── Hero Section ── */}
        <section className="min-h-screen flex flex-col items-center justify-center text-center px-3 sm:px-6 py-20 relative">

          <motion.div
            className="hidden sm:block absolute top-20 left-20 w-32 h-32 border-t-2 border-l-2 border-teal-500/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />
          <motion.div
            className="hidden sm:block absolute bottom-20 right-20 w-32 h-32 border-b-2 border-r-2 border-cyan-500/30"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          />

          <motion.div
            className="max-w-6xl mx-auto w-full"
            style={!isMobile ? { opacity, scale } : {}}
          >
            {/* Badge */}
            <motion.div
              className="mb-8 sm:mb-10"
              initial={{ opacity: 0, y: -50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              whileHover={{ scale: 1.1, rotate: 2 }}
            >
              <span className="inline-flex items-center gap-2 sm:gap-3 px-5 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-teal-500/20 via-cyan-500/20 to-blue-500/20 text-teal-300 rounded-full text-xs sm:text-sm font-bold border border-teal-400/40 shadow-2xl shadow-teal-500/30 backdrop-blur-xl">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-teal-400" />
                </span>
                <span className="text-lg sm:text-xl">🔬</span>
                <span className="tracking-wider">AI-POWERED MEDICAL DIAGNOSTICS</span>
              </span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="text-4xl sm:text-5xl md:text-8xl font-medium text-white mb-8 sm:mb-10 leading-[1.1] tracking-tight"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <motion.span
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                Advanced Bone Tumor
              </motion.span>
              <br />
              <motion.span
                className="relative inline-block"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.span
                  className="absolute -inset-2 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 blur-3xl opacity-60"
                  animate={{ opacity: [0.4, 0.8, 0.4], scale: [1, 1.05, 1] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                />
                <span className="relative bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                  Detection & Classification
                </span>
              </motion.span>
            </motion.h1>

            {/* Subheading */}
            <motion.p
              className="text-base sm:text-xl md:text-2xl text-slate-100 max-w-4xl mx-auto mb-12 sm:mb-16 leading-relaxed px-2"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.8 }}
            >
              Catch bone tumours before they grow — leverage state-of-the-art deep learning to{' '}
              <motion.span
                className="text-teal-400 font-bold"
                animate={{ textShadow: ["0 0 10px rgba(20,184,166,0.5)", "0 0 20px rgba(20,184,166,0.8)", "0 0 10px rgba(20,184,166,0.5)"] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                protect your bones
              </motion.span>, protect your life
            </motion.p>

            {/* CTA Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center items-center mb-14 sm:mb-24"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 1 }}
            >
              <motion.button
                onClick={logouthandler}
                className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-3 bg-red-600 text-slate-50 font-bold text-base sm:text-lg rounded-2xl overflow-hidden"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <motion.span className="absolute inset-0" initial={{ x: "-100%" }} whileHover={{ x: "100%" }} transition={{ duration: 0.5 }} />
                <span className="relative flex items-center justify-center gap-3">
                  <span>Log out</span>
                  <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl sm:text-3xl">→</motion.span>
                </span>
              </motion.button>

              <Link to={user ? `/detect/${user.id}` : "/login"} className="w-full sm:w-auto">
                <motion.button
                  className="group relative w-full sm:w-auto px-8 sm:px-12 py-4 sm:py-3 bg-green-500 text-black font-bold text-base sm:text-xl rounded-2xl overflow-hidden shadow-2xl shadow-teal-500/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 20px 60px rgba(20,184,166,0.6)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span className="absolute inset-0 bg-black/40" animate={{ x: ["-200%", "200%"] }} transition={{ duration: 2, repeat: Infinity, ease: "linear" }} />
                  <span className="relative flex items-center justify-center gap-3">
                    <span>Get Started</span>
                    <motion.span animate={{ x: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-2xl sm:text-3xl">→</motion.span>
                  </span>
                </motion.button>
              </Link>
            </motion.div>

            {/* Trust Indicators */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8 w-full max-w-6xl mx-auto">
              {[
                { value: '98.2%', label: 'Diagnostic Accuracy', icon: '🎯', color: 'from-white to-cyan-400' },
                { value: '<24h', label: 'Analysis Time', icon: '⚡', color: 'from-white to-cyan-400' },
                { value: '50K+', label: 'Cases Analyzed', icon: '📊', color: 'from-white to-cyan-400' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className="group relative"
                  initial={{ opacity: 0, y: 50, rotateX: 45 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 + (idx * 0.15) }}
                  whileHover={{ y: -15, rotateY: 5, transition: { duration: 0.3 } }}
                  style={{ transformStyle: "preserve-3d" }}
                >
                  <div className={`absolute -inset-1 bg-gradient-to-r ${item.color} rounded-3xl blur-xl opacity-0 group-hover:opacity-70 transition-opacity duration-500`} />
                  <div className="relative bg-slate-950/90 border-t-8 border-y-4 border-slate-200 rounded-3xl p-6 sm:p-10 group-hover:border-teal-500 transition-all duration-500 shadow-2xl">
                    <motion.div
                      className="text-3xl sm:text-5xl mb-3 sm:mb-4"
                      animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1.1, 1] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3, delay: idx * 0.5 }}
                    >
                      {item.icon}
                    </motion.div>
                    <motion.div
                      className={`text-4xl sm:text-6xl font-black bg-gradient-to-r ${item.color} bg-clip-text text-transparent mb-3 sm:mb-4`}
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    >
                      {item.value}
                    </motion.div>
                    <div className="text-base sm:text-xl text-slate-100 font-semibold font-mono tracking-wider uppercase">{item.label}</div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </section>

        {/* ── Circular Gallery ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="w-full overflow-hidden relative"
          style={{ marginTop: isMobile ? '-20px' : '-80px' }}
        >

          <div style={{ 
            height: isMobile ? '220px' : '500px',
            scale: isMobile ? 1.5 : 1,
          }}>
            <CircularGallery
              bend={isMobile ? 2 : 4}
              textColor="#ffffff"
              borderRadius={0.05}
              scrollEase={isMobile ? 0.1 : 0.1}
            />
          </div>

          {/* Label below gallery on mobile */}
          {isMobile && (
            <motion.p
              className="text-center text-xs text-slate-400 mt-2 pb-2 tracking-widest uppercase font-mono font-semibold"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              ← Swipe to explore →
            </motion.p>
          )}
        </motion.div>

        {/* ── Clinical Value Section ── */}
        <section className="py-10 px-3 sm:px-6 relative">
          <div className="max-w-7xl mx-auto">
            <motion.div
              className="text-center mb-14 sm:mb-24"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500/10 rounded-full border border-teal-500/30 mb-8"
                whileHover={{ scale: 1.05 }}
              >
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-teal-400 tracking-widest uppercase">Clinical Excellence</span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium text-white mb-6 tracking-tight">
                <motion.span initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }}>
                  Clinical
                </motion.span>{' '}
                <motion.span
                  className="bg-gradient-to-r from-teal-400 to-cyan-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  Impact
                </motion.span>
              </h2>

              <motion.div
                className="h-2 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 mx-auto mb-8 rounded-full"
                initial={{ width: 0 }}
                whileInView={{ width: isMobile ? 80 : 128 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.4 }}
                style={{ width: isMobile ? 80 : 128 }}
              />

              <motion.p
                className="text-base sm:text-xl text-slate-100 font-mono max-w-3xl mx-auto leading-relaxed px-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                Supporting healthcare professionals with evidence-based diagnostic insights
              </motion.p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-10 text-white">
              {[
                { emoji: '🛡️', title: 'FDA-Grade Standards', description: 'Our platform adheres to rigorous medical device standards, ensuring reliability and safety in clinical settings.', color: 'from-blue-600 to-cyan-500/10', hoverColor: 'group-hover:from-blue-500/20 group-hover:to-cyan-500/20' },
                { emoji: '⚡', title: 'Real-Time Analysis', description: 'Receive comprehensive diagnostic reports within hours, not days, accelerating treatment decisions.', color: 'from-teal-600 to-emerald-500/10', hoverColor: 'group-hover:from-teal-500/20 group-hover:to-emerald-500/20' },
                { emoji: '📈', title: 'Continuous Validation', description: 'Regular algorithm updates based on peer-reviewed research and clinical validation studies.', color: 'from-cyan-600 to-blue-400/10', hoverColor: 'group-hover:from-cyan-500/20 group-hover:to-blue-500/20' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  className={`group relative bg-gradient-to-br ${item.color} ${item.hoverColor} border border-slate-700/50 rounded-3xl p-8 sm:p-12 hover:border-teal-500/60 transition-all duration-500 backdrop-blur-sm`}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.15 }}
                  whileHover={{ y: -20, scale: 1.03, boxShadow: "0 25px 50px -12px rgba(20,184,166,0.25)" }}
                >
                  <motion.div
                    className="pl-1 w-16 h-16 sm:w-24 sm:h-24 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 rounded-2xl flex items-center justify-center mb-6 sm:mb-8 text-3xl sm:text-5xl border border-teal-500/40 shadow-lg"
                    whileHover={{ rotate: 360, scale: 1.1 }}
                    transition={{ duration: 0.8 }}
                  >
                    {item.emoji}
                  </motion.div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-5 tracking-tight">{item.title}</h3>
                  <p className="text-base sm:text-lg font-mono text-slate-100 leading-relaxed">{item.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Early Detection ── */}
        <section className="py-20 sm:py-32 px-3 sm:px-6 relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-slate-800/30 to-transparent" />
          <div className="max-w-7xl mx-auto relative">
            <motion.div
              className="text-center mb-14 sm:mb-24"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-3 bg-cyan-500/10 rounded-full border border-cyan-500/30 mb-8"
                whileHover={{ scale: 1.05, rotate: 2 }}
              >
                <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-cyan-400 tracking-widest uppercase">Critical Insights</span>
              </motion.div>

              <h2 className="text-4xl sm:text-5xl md:text-7xl font-medium text-white mb-6 tracking-tight leading-tight">
                Why Early Detection{' '}
                <motion.span
                  className="bg-gradient-to-r from-cyan-400 to-teal-400 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Matters
                </motion.span>
              </h2>

              <motion.div
                className="h-2 bg-gradient-to-r from-cyan-500 to-teal-500 mx-auto mb-8 rounded-full"
                initial={{ scaleX: 0 }}
                whileInView={{ scaleX: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.8 }}
                style={{ width: isMobile ? 80 : 128 }}
              />
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              {[
                { title: 'Enhanced Treatment Outcomes', description: 'Early detection of bone tumours is critical because it helps doctors treat the disease before it spreads or causes permanent damage. Our AI system identifies subtle radiological patterns.', icon: '🎯', color: 'from-teal-500/20 to-cyan-500/20' },
                { title: 'Differential Diagnosis Support', description: 'Our advanced algorithms distinguish between benign and malignant types with high specificity and sensitivity, providing radiologists with critical treatment planning information.', icon: '🔍', color: 'from-cyan-500/20 to-blue-500/20' },
                { title: 'Reduced Diagnostic Delay', description: 'Our automated analysis provides preliminary classification within 24 hours, drastically reducing the traditional weeks-long pathology workflow.', icon: '⏱️', color: 'from-blue-500/20 to-teal-500/20' },
                { title: 'Scalable Access to Expertise', description: 'Democratize access to specialist-level diagnostic capabilities across healthcare facilities worldwide, regardless of geographical location.', icon: '🌍', color: 'from-emerald-500/20 to-teal-500/20' },
                { title: 'Evidence-Based Decision Support', description: 'Our models are trained on extensive, peer-reviewed datasets and continuously validated against clinical outcomes.', icon: '📊', color: 'from-teal-500/20 to-cyan-500/20' },
                { title: 'Comprehensive Reporting', description: 'Generate detailed diagnostic reports with region of interest annotations, confidence metrics, and differential diagnoses.', icon: '📋', color: 'from-cyan-500/20 to-blue-500/20' },
              ].map((card, idx) => (
                <motion.div
                  key={idx}
                  className={`group relative bg-gradient-to-br ${card.color} backdrop-blur-md border border-slate-700/50 p-7 sm:p-10 rounded-3xl hover:border-teal-500/60 transition-all duration-500`}
                  initial={{ opacity: 0, x: idx % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-50px" }}
                  transition={{ duration: 0.6, delay: idx * 0.1 }}
                  whileHover={{ scale: 1.03, y: -8, boxShadow: "0 20px 50px -12px rgba(20,184,166,0.3)" }}
                >
                  <div className="flex items-start gap-4 sm:gap-6">
                    <motion.div
                      className="pl-1 flex-shrink-0 w-12 h-12 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500/30 to-cyan-500/30 rounded-2xl flex items-center justify-center text-2xl sm:text-4xl border border-teal-500/40"
                      whileHover={{ rotate: [0, -10, 10, -10, 0], scale: 1.1 }}
                      transition={{ duration: 0.5 }}
                    >
                      {card.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="text-lg sm:text-2xl font-bold text-white mb-2 sm:mb-4 tracking-tight">{card.title}</h3>
                      <p className="text-sm sm:text-base font-mono text-slate-100 leading-relaxed">{card.description}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TrueFocus Section ── */}
        <motion.div
          className="mx-auto w-11/12 sm:w-4/5 md:w-3/5 flex flex-col gap-1 justify-center items-center mx-auto pb-12 sm:pb-16"
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <TrueFocus
            sentence="Benign Malignant"
            manualMode={false}
            blurAmount={5}
            borderColor="red"
            animationDuration={2}
            pauseBetweenAnimations={1}
          />
        </motion.div>

        {/* ── Final CTA ── */}
        <section className="py-8 sm:py-1 px-3 sm:px-6 relative">
          <motion.div
            className="max-w-6xl mx-auto relative"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-teal-500/10 via-cyan-500/10 to-blue-500/10 blur-3xl" />

            <motion.div
              className="relative text-center bg-gradient-to-br from-slate-800/95 to-slate-900/95 backdrop-blur-2xl border border-slate-700/50 rounded-2xl sm:rounded-3xl p-8 sm:p-16 md:p-20 shadow-2xl hover:border-teal-500/50 transition-all duration-500"
              whileHover={{ scale: 1.01 }}
            >
              <motion.div
                className="inline-flex items-center gap-2 px-5 py-3 bg-teal-500/10 rounded-full border border-teal-500/30 mb-8 sm:mb-10"
                whileHover={{ scale: 1.1, rotate: 2 }}
              >
                <span className="w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
                <span className="text-xs sm:text-sm font-bold text-teal-400 tracking-widest uppercase">Transform Your Practice</span>
              </motion.div>

              <h2 className="text-3xl sm:text-4xl md:text-6xl font-medium text-white mb-6 sm:mb-8 tracking-tight leading-tight">
                Ready to Transform Your<br />
                <motion.span
                  className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ["0%", "100%", "0%"] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
                  style={{ backgroundSize: "200% 200%" }}
                >
                  Diagnostic Workflow?
                </motion.span>
              </h2>

              <motion.p
                className="text-base sm:text-xl md:text-2xl text-slate-100 mb-10 sm:mb-14 max-w-3xl mx-auto leading-relaxed px-2"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                Join leading healthcare institutions leveraging AI-powered diagnostics for improved patient care
              </motion.p>

              <Link to={user ? `/detect/${user.id}` : "/login"}>
                <motion.button
                  className="group relative w-full sm:w-auto px-10 sm:px-16 py-4 sm:py-6 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 text-white font-black text-lg sm:text-xl rounded-2xl overflow-hidden shadow-2xl shadow-teal-500/50"
                  whileHover={{ scale: 1.05, boxShadow: "0 25px 60px -15px rgba(20,184,166,0.8)" }}
                  whileTap={{ scale: 0.95 }}
                >
                  <motion.span
                    className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/30 to-white/0"
                    animate={{ x: ["-200%", "200%"] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  />
                  <span className="relative flex items-center justify-center gap-3 sm:gap-4">
                    <span>Upload Your First X-Ray</span>
                    <motion.span animate={{ x: [0, 8, 0] }} transition={{ duration: 1.5, repeat: Infinity }} className="text-xl sm:text-2xl">→</motion.span>
                  </span>
                </motion.button>
              </Link>

              <motion.div
                className="mt-8 sm:mt-14 flex items-center justify-center gap-3 sm:gap-6 flex-wrap"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                {['HIPAA compliant', 'SOC 2 certified', 'ISO 13485 certified'].map((text, idx) => (
                  <motion.span
                    key={idx}
                    className="inline-flex items-center gap-2 px-4 sm:px-5 py-2 sm:py-3 bg-slate-800/50 rounded-full border border-slate-700/50 backdrop-blur-sm hover:border-teal-500/50 transition-all"
                    whileHover={{ scale: 1.05, y: -3 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + idx * 0.1 }}
                  >
                    <motion.span
                      className="w-2 h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.3 }}
                    />
                    <span className="font-semibold text-slate-300 text-xs sm:text-sm">{text}</span>
                  </motion.span>
                ))}
              </motion.div>
            </motion.div>
          </motion.div>
        </section>

        <div className="h-16 sm:h-32" />
      </div>
    </div>
  );
};

export default Home;


