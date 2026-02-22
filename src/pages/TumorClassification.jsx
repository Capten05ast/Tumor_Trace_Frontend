


import axios from "../api/axiosconfig"
import React, { useState, useEffect } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import * as tmImage from "@teachablemachine/image";
import PaymentButton from "../componenets/PaymentButton";


const TumorClassification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = useSelector((state) => state.userReducer.users);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const {
    fileId,
    imageSource,
    prediction,
    age,
    gender,
  } = location.state || {};

  const [tumorClassifierModel, setTumorClassifierModel] = useState(null);
  const [isClassifying, setIsClassifying] = useState(false);
  const [tumorClassification, setTumorClassification] = useState(null);
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [paymentId, setPaymentId] = useState(null);

  const CLASSIFICATION_AMOUNT = 111;

  useEffect(() => {
    if (!fileId) {
      toast.error("No data found. Please start from tumor detection.");
      setTimeout(() => {
        navigate(`/detect/${id}`);
      }, 1500);
      return;
    }

    const loadModels = async () => {
      try {
        const classifierModelURL = "/ML_Model-II/model.json";
        const classifierMetadataURL = "/ML_Model-II/metadata.json";
        const loadedClassifierModel = await tmImage.load(classifierModelURL, classifierMetadataURL);
        setTumorClassifierModel(loadedClassifierModel);
      } catch (error) {
        toast.error("Failed to load classification model");
      }
    };
    loadModels();
  }, [fileId, id, navigate]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const runTumorClassification = async (imageSrc) => {
    if (!tumorClassifierModel) {
      toast.error("Classification model not loaded yet");
      return null;
    }
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try {
            const predictions = await tumorClassifierModel.predict(img);
            resolve(predictions);
          } catch (error) {
            reject(error);
          }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageSrc;
      });
    } catch (error) {
      throw error;
    }
  };

  const handlePaymentSuccess = async (paymentId) => {
    setPaymentId(paymentId);
    setPaymentCompleted(true);
    setTimeout(() => {
      handleClassifyTumor(paymentId);
    }, 1000);
  };

  const handlePaymentFailure = (error) => {
    toast.error("❌ Payment failed. Please try again.");
  };

  const handleClassifyTumor = async (pId) => {
    if (!imageSource) {
      toast.error("No image to classify");
      return;
    }
    setIsClassifying(true);
    try {
      toast.info("🔬 Analyzing tumor type (Benign/Malignant)...");
      const classificationPredictions = await runTumorClassification(imageSource);
      setTumorClassification(classificationPredictions);

      const topClassification = classificationPredictions.reduce((max, pred) =>
        pred.probability > max.probability ? pred : max
      );
      const isMalignant = topClassification.className.toLowerCase().includes("malignant");
      const tumorType = isMalignant ? "Malignant" : "Benign";

      toast.success(
        `${isMalignant ? "⚠️ MALIGNANT (Cancerous)" : "✅ BENIGN (Non-Cancerous)"} Tumor - ${(topClassification.probability * 100).toFixed(1)}% confidence`
      );

      try {
        const classificationRes = await axios.post(
          "/api/payment/save-classification",
          {
            fileId,
            tumorType,
            confidence: topClassification.probability,
            allPredictions: classificationPredictions,
            paymentId: pId,
            amount: CLASSIFICATION_AMOUNT,
            age,
            gender,
            userId: user?.id
          },
          { withCredentials: true }
        );
        toast.success("✅ Classification saved to database!");
      } catch (classificationError) {
        toast.error("Classification analyzed but failed to save");
      }
    } catch (error) {
      toast.error("Failed to classify tumor. Please try again.");
    } finally {
      setIsClassifying(false);
    }
  };

  if (!fileId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 flex items-center justify-center px-4">
        <div className="text-center">
          <div className="text-6xl mb-4">⚠️</div>
          <h2 className="text-white text-2xl font-bold mb-4">No Data Found</h2>
          <p className="text-slate-300 mb-6">Please complete tumor detection first</p>
          <button
            onClick={() => navigate(`/detect/${id}`)}
            className="px-6 py-3 bg-gradient-to-r from-teal-500 to-cyan-500 text-white font-bold rounded-xl hover:scale-105 transition-transform"
          >
            Go to Tumor Detection
          </button>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-[600px] md:h-[600px] bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* ✅ MOBILE: Larger padding */}
      <div className="relative z-10 px-3 py-4 sm:px-4 md:py-12">
        {/* Back Button */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-6">
          <button
            onClick={() => navigate(`/detect/${id}`)}
            className="flex items-center gap-2 px-4 py-3 text-teal-400 hover:text-teal-300 transition-colors text-lg sm:text-base"
          >
            <span className="text-3xl sm:text-2xl">←</span>
            <span className="text-base sm:text-base">Back to Detection</span>
          </button>
        </div>

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-8 sm:mb-12 animate-slide-down">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-6 sm:p-8 md:p-12 hover:border-orange-500/50 transition-all duration-500 group">
            <div className="absolute top-0 left-0 w-12 h-12 sm:w-20 sm:h-20 border-t-2 border-l-2 border-orange-500/50 group-hover:w-20 group-hover:h-20 sm:group-hover:w-32 sm:group-hover:h-32 transition-all duration-500"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-20 sm:h-20 border-b-2 border-r-2 border-red-500/50 group-hover:w-20 group-hover:h-20 sm:group-hover:w-32 sm:group-hover:h-32 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="flex items-center justify-center mb-6 sm:mb-8">
                <span className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-orange-500/20 to-red-500/20 text-orange-300 rounded-full text-sm sm:text-sm font-bold border border-orange-400/40 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-orange-400"></span>
                  </span>
                  <span>🔍 Stage 2: Classification</span>
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                {/* ✅ MOBILE: Larger heading */}
                <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-4 leading-tight">
                  Benign or{' '}
                  <span className="relative inline-block">
                    <span className="absolute -inset-1 bg-gradient-to-r from-orange-400 via-red-400 to-pink-400 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></span>
                    <span className="relative bg-gradient-to-r from-orange-300 via-red-300 to-pink-300 bg-clip-text text-transparent">
                      Malignant?
                    </span>
                  </span>
                </h1>
                {/* ✅ MOBILE: Larger text */}
                <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                  Advanced AI analysis to determine tumor classification. Secure payment required.
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { icon: '🧬', value: 'AI-Powered', label: 'Classification', color: 'orange' },
                  { icon: '🔒', value: 'Secure', label: 'Payment', color: 'red' },
                  { icon: '📊', value: 'Detailed', label: 'Results', color: 'pink' },
                ].map((item, idx) => (
                  <div key={idx} className={`bg-slate-700/30 backdrop-blur-sm border border-slate-600 rounded-xl p-4 sm:p-4 hover:border-${item.color}-500/50 hover:scale-105 transition-all duration-300`}>
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 sm:w-10 sm:h-10 bg-${item.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl sm:text-2xl">{item.icon}</span>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg sm:text-xl font-bold text-${item.color}-400`}>{item.value}</div>
                        <div className="text-xs sm:text-xs text-slate-400">{item.label}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="h-1 bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 animate-gradient"></div>

            {/* ✅ MOBILE: Larger padding */}
            <div className="p-6 sm:p-6 lg:p-12">
              {/* ✅ MOBILE: Single column on mobile */}
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-8">

                {/* LEFT COLUMN */}
                <div className="space-y-6 sm:space-y-6 animate-slide-right">

                  {/* Medical Image */}
                  <div className="relative group">
                    <div className="rounded-2xl overflow-hidden border-2 border-orange-500/30 bg-slate-700/30 p-4 sm:p-4 hover:border-orange-500/60 transition-colors">
                      {imageSource && (
                        <img
                          src={imageSource}
                          alt="Medical scan"
                          className="w-full h-auto rounded-xl object-cover max-h-80 sm:max-h-96"
                        />
                      )}
                    </div>
                    <div className="absolute -top-4 right-3 sm:-top-4 sm:right-4 px-4 py-2 sm:px-4 sm:py-2 bg-orange-500 text-white font-bold rounded-full text-sm sm:text-sm shadow-lg">
                      ✅ Verified
                    </div>
                  </div>

                  {/* Patient Details */}
                  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 sm:p-6">
                    <h3 className="text-white font-bold text-lg sm:text-lg mb-5 sm:mb-4">📋 Patient Details</h3>
                    <div className="space-y-4 sm:space-y-4">
                      {[
                        { label: 'Age', value: `${age} years` },
                        { label: 'Gender', value: gender, capitalize: true },
                        { label: 'File ID', value: `${fileId?.substring(0, 12)}...`, mono: true, teal: true },
                      ].map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center pb-4 border-b border-slate-600">
                          <span className="text-slate-400 text-lg sm:text-base">{item.label}:</span>
                          <span className={`font-semibold text-lg sm:text-lg ${item.teal ? 'text-teal-400 font-mono' : 'text-white'} ${item.capitalize ? 'capitalize' : ''}`}>
                            {item.value}
                          </span>
                        </div>
                      ))}
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 text-lg sm:text-base">Status:</span>
                        <span className="inline-flex items-center gap-1.5 px-3 sm:px-3 py-2 bg-orange-500/20 text-orange-400 rounded-full text-sm sm:text-sm font-semibold border border-orange-500/30">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-400"></span>
                          </span>
                          {paymentCompleted ? "Classification" : "Pending Payment"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Detection Results Preview */}
                  {prediction && (
                    <div className="bg-gradient-to-br from-purple-500/45 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 sm:p-6">
                      <h3 className="text-white font-bold text-lg sm:text-lg mb-4 sm:mb-4">🔬 Stage 1: Detection Results</h3>
                      <div className="space-y-3">
                        {prediction
                          .sort((a, b) => b.probability - a.probability)
                          .slice(0, 2)
                          .map((pred, index) => (
                            <div key={index} className="bg-slate-800/50 rounded-lg p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-semibold text-sm sm:text-sm">{pred.className}</span>
                                <span className="text-purple-300 font-bold text-lg sm:text-sm">
                                  {(pred.probability * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-2 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-500"
                                  style={{ width: `${pred.probability * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6 sm:space-y-6 animate-slide-left">

                  {/* Model Info */}
                  <div className="bg-gradient-to-br from-orange-500 to-red-500/20 border border-orange-500/40 rounded-xl p-6 sm:p-5 hover:border-orange-500/60 transition-colors">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="w-14 h-14 sm:w-14 sm:h-14 bg-orange-500/30 rounded-xl flex items-center justify-center mb-2">
                        <span className="text-3xl sm:text-3xl">🧬</span>
                      </div>
                      <div className="text-white font-bold text-base">Stage 2</div>
                      <div className="text-white text-lg sm:text-lg leading-relaxed">Classification Model</div>
                      <div className={`mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        tumorClassifierModel
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30'
                      }`}>
                        {tumorClassifierModel ? '✓ Ready' : '⏳ Loading...'}
                      </div>
                    </div>
                  </div>

                  {/* Payment Card / Success */}
                  {!paymentCompleted ? (
                    <div className="bg-gradient-to-br from-orange-600/30 to-red-600/30 backdrop-blur-sm border-2 border-orange-500/50 rounded-2xl p-6 sm:p-6">
                      <div className="flex items-center gap-3 mb-6 sm:mb-6">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-orange-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl sm:text-2xl pl-2">💳</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg sm:text-lg">Payment Required</h3>
                          <p className="text-orange-300 text-sm">Secure Razorpay Integration</p>
                        </div>
                      </div>

                      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-4 mb-6 sm:mb-6">
                        <div className="flex justify-between items-center mb-4 sm:mb-4">
                          <span className="text-slate-300 text-lg sm:text-base">Classification Analysis</span>
                          <span className="text-white font-bold text-2xl sm:text-xl">Rs. {CLASSIFICATION_AMOUNT}</span>
                        </div>
                        <div className="h-px bg-slate-700 mb-4 sm:mb-4"></div>
                        <div className="flex justify-between items-center">
                          <span className="text-slate-300 font-semibold text-lg sm:text-base">Total Amount</span>
                          <div className="text-right">
                            <div className="text-2xl sm:text-2xl font-bold text-orange-400">Rs. {CLASSIFICATION_AMOUNT}</div>
                            <div className="text-sm text-slate-400">Only ({CLASSIFICATION_AMOUNT * 100} paise)</div>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3 mb-6 sm:mb-6">
                        {[
                          { icon: '🔒', text: '100% Secure & Encrypted' },
                          { icon: '⚡', text: 'Instant Payment Processing' },
                          { icon: '📋', text: 'Automated Receipt Generation' },
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center gap-3 text-sm sm:text-sm text-slate-300">
                            <span className="text-xl sm:text-xl">{item.icon}</span>
                            <span className="text-lg sm:text-sm">{item.text}</span>
                          </div>
                        ))}
                      </div>

                      <PaymentButton
                        fileId={fileId}
                        userId={user?.id}
                        amount={CLASSIFICATION_AMOUNT}
                        onPaymentSuccess={handlePaymentSuccess}
                        onPaymentFailure={handlePaymentFailure}
                        disabled={!tumorClassifierModel}
                      />

                      <p className="text-sm text-slate-400 text-center mt-4">
                        By clicking "Pay & Classify", you agree to the classification analysis terms
                      </p>
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-green-600/30 to-emerald-600/30 backdrop-blur-sm border-2 border-green-500/50 rounded-2xl p-6 sm:p-6">
                      <div className="flex items-center gap-3 mb-6 sm:mb-6">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-green-900/50 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl sm:text-2xl">✅</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg sm:text-lg">Payment Successful</h3>
                          <p className="text-green-300 text-sm">Payment ID: {paymentId?.substring(0, 15)}...</p>
                        </div>
                      </div>
                      <div className="bg-slate-800/50 rounded-xl p-4 sm:p-4 mb-4 text-sm sm:text-sm text-slate-300">
                        <p>✅ Your payment has been verified successfully. Classification analysis is being performed...</p>
                      </div>
                    </div>
                  )}

                  {/* Classification Results */}
                  {tumorClassification && (
                    <div className="bg-gradient-to-br from-orange-600 to-red-500/20 backdrop-blur-sm border-2 border-orange-500/50 rounded-2xl p-6 sm:p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-orange-900 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl sm:text-2xl pl-1">🧬</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg sm:text-lg">🔬 Classification Results</h3>
                          <p className="text-white text-sm">Benign vs Malignant Analysis</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {tumorClassification
                          .sort((a, b) => b.probability - a.probability)
                          .map((pred, index) => {
                            const isMalignant = pred.className.toLowerCase().includes("malignant");
                            return (
                              <div key={index} className={`rounded-lg p-4 sm:p-4 border-2 ${isMalignant ? "bg-red-500/45 border-red-500/50" : "bg-green-500/20 border-green-500/50"}`}>
                                <div className="flex justify-between items-center mb-2">
                                  <span className="font-bold text-sm sm:text-sm text-white">
                                    {isMalignant ? "⚠️ MALIGNANT" : "✅ BENIGN"}
                                  </span>
                                  <span className={`font-bold text-2xl sm:text-xl ${isMalignant ? "text-red-200" : "text-green-400"}`}>
                                    {(pred.probability * 100).toFixed(1)}%
                                  </span>
                                </div>
                                <div className="w-full bg-slate-900 rounded-full h-3 sm:h-3 overflow-hidden">
                                  <div
                                    className={`h-full rounded-full ${isMalignant ? "bg-gradient-to-r from-red-700 to-orange-500" : "bg-gradient-to-r from-green-500 to-teal-500"}`}
                                    style={{ width: `${pred.probability * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    </div>
                  )}

                  {/* Info Cards */}
                  <div className="space-y-3">
                    <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 sm:p-4 hover:border-emerald-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-10 sm:h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl sm:text-2xl">✓</span>
                        </div>
                        <div>
                          <div className="text-emerald-300 font-bold text-sm sm:text-sm">Medical-Grade AI</div>
                          <div className="text-emerald-400/60 text-xs">Trained on clinical datasets</div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 sm:p-4 hover:border-blue-500/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 sm:w-10 sm:h-10 bg-blue-500/20 rounded-lg flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl sm:text-2xl">🔐</span>
                        </div>
                        <div>
                          <div className="text-blue-300 font-bold text-sm sm:text-sm">HIPAA Compliant</div>
                          <div className="text-blue-400/60 text-xs">Enterprise-grade security</div>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Bottom Section */}
              <div className="mt-10 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6">
                {[
                  {
                    icon: '🛡️',
                    iconBg: 'from-orange-500/20 to-red-500/20',
                    iconBorder: 'border-orange-500/30',
                    title: 'Data Protection',
                    desc: 'All data is encrypted with AES-256 encryption. Payment processed via Razorpay.',
                  },
                  {
                    icon: '📋',
                    iconBg: 'from-cyan-500/20 to-blue-500/20',
                    iconBorder: 'border-cyan-500/30',
                    title: 'Regulatory Compliance',
                    badges: ['HIPAA', 'GDPR', 'ISO 27001'],
                  },
                ].map((item, idx) => (
                  <div key={idx} className="p-6 sm:p-6 bg-gradient-to-br from-slate-700/30 to-slate-800/30 border border-slate-600 rounded-2xl">
                    <div className="flex items-start gap-4 sm:gap-4">
                      <div className={`flex-shrink-0 w-12 h-12 sm:w-12 sm:h-12 bg-gradient-to-br ${item.iconBg} rounded-xl flex items-center justify-center border ${item.iconBorder}`}>
                        <span className="text-2xl sm:text-2xl pl-1">{item.icon}</span>
                      </div>
                      <div>
                        <h4 className="text-white font-bold text-lg sm:text-base mb-2 sm:mb-2">{item.title}</h4>
                        {item.desc && <p className="text-sm sm:text-sm text-slate-400 leading-relaxed">{item.desc}</p>}
                        {item.badges && (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {item.badges.map((badge, i) => (
                              <span key={i} className="px-3 py-2 bg-slate-700/50 rounded-md text-sm font-semibold text-slate-300 border border-slate-600">
                                {badge}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="h-16"></div>
      </div>

      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        @keyframes slide-down {
          from { opacity: 0; transform: translateY(-30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-down { animation: slide-down 0.6s ease-out; }
        @keyframes slide-right {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-right { animation: slide-right 0.6s ease-out; }
        @keyframes slide-left {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slide-left { animation: slide-left 0.6s ease-out; }
      `}</style>
    </div>
  );
};

export default TumorClassification;

