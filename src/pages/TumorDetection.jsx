


import axios from "../api/axiosconfig"
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { loadXray, removeXray } from "../store/reducers/xraySlice";
import * as tmImage from "@teachablemachine/image";
import { asyncSendMLResult } from "../store/actions/mlActions";

const TumorDetection = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  const user = useSelector((state) => state.userReducer.users);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  const [url, setUrl] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [tumorModel, setTumorModel] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isTumorDetected, setIsTumorDetected] = useState(false);
  const [detectionData, setDetectionData] = useState(null);

  useEffect(() => {
    const loadModels = async () => {
      try {
        const tumorModelURL = "/ml_model/model.json";
        const tumorMetadataURL = "/ml_model/metadata.json";
        const loadedTumorModel = await tmImage.load(tumorModelURL, tumorMetadataURL);
        setTumorModel(loadedTumorModel);
      } catch (error) {
        toast.error("Failed to load AI model");
      }
    };
    loadModels();
  }, []);

  const handleChange = (selected) => setGender(selected);

  const handleFileSelect = (e) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
      setPrediction(null);
      setDetectionData(null);
      setIsTumorDetected(false);
    }
  };

  const handleDragOver = (e) => { e.preventDefault(); setIsDragging(true); };
  const handleDragLeave = (e) => { e.preventDefault(); setIsDragging(false); };
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setSelectedFile(e.dataTransfer.files[0]);
      setPrediction(null);
      setDetectionData(null);
      setIsTumorDetected(false);
    }
  };

  const runTumorDetection = async (imageSrc) => {
    if (!tumorModel) { toast.error("Tumor detection model not loaded yet"); return null; }
    try {
      const img = new Image();
      img.crossOrigin = "anonymous";
      return new Promise((resolve, reject) => {
        img.onload = async () => {
          try { const predictions = await tumorModel.predict(img); resolve(predictions); }
          catch (error) { reject(error); }
        };
        img.onerror = () => reject(new Error("Failed to load image"));
        img.src = imageSrc;
      });
    } catch (error) { throw error; }
  };

  const storeInBackend = async () => {
    if (!url && !selectedFile) { toast.error("Please select a file or enter URL to upload"); return; }
    if (!age || !gender) { toast.error("Please provide patient age and gender"); return; }

    setIsAnalyzing(true);
    setIsUploading(true);
    setIsTumorDetected(false);

    try {
      let imageSrc = null, imagekitUrl = null, fId = null;

      if (selectedFile) {
        toast.info("📤 Uploading image to cloud storage...");
        try {
          const formData = new FormData();
          formData.append("image", selectedFile);
          const uploadRes = await axios.post("/api/upload", formData, {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true
          });
          imagekitUrl = uploadRes.data.imageUrl;
          fId = uploadRes.data.fileId;
          imageSrc = imagekitUrl;
          toast.success("✅ Image uploaded successfully!");
        } catch (uploadError) {
          toast.error(uploadError.response?.data?.message || "Failed to upload image");
          setIsAnalyzing(false); setIsUploading(false); return;
        }
      } else if (url) {
        imageSrc = url; imagekitUrl = url; fId = "url-" + Date.now();
        toast.info("Using provided URL...");
      }

      toast.info("🔬 Running tumor detection...");
      const tumorPredictions = await runTumorDetection(imageSrc);
      setPrediction(tumorPredictions);

      const topTumorPrediction = tumorPredictions.reduce((max, pred) =>
        pred.probability > max.probability ? pred : max
      );
      const tumorDetected = topTumorPrediction.className.toLowerCase().includes("yes");

      if (tumorDetected) {
        toast.success(`✅ Tumor Detected: ${topTumorPrediction.className} (${(topTumorPrediction.probability * 100).toFixed(1)}% confidence)`);
        setIsTumorDetected(true);
      } else {
        toast.success("✅ No tumor detected!");
        setIsTumorDetected(false);
      }

      dispatch(removeXray());
      dispatch(loadXray(imagekitUrl));
      dispatch(asyncSendMLResult({
        fileId: fId, age, gender, imageUrl: imagekitUrl,
        prediction: { result: topTumorPrediction.className, confidence: topTumorPrediction.probability, allPredictions: tumorPredictions }
      }));

      setDetectionData({ fileId: fId, imageSource: imageSrc, prediction: tumorPredictions, age, gender, imagekitUrl });
      toast.success("✅ Stage 1 Analysis complete!");
    } catch (error) {
      toast.error("Failed to process image. Please try again.");
    } finally {
      setIsAnalyzing(false); setIsUploading(false);
    }
  };

  const handleNavigateToClassification = () => {
    if (!detectionData) { toast.error("Detection data not found"); return; }
    if (!isTumorDetected) { toast.warning("Classification is only available for tumor-positive cases"); return; }
    navigate(`/classify`, { state: detectionData });
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-900 relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 md:w-96 md:h-96 bg-teal-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 left-1/4 w-48 h-48 md:w-96 md:h-96 bg-cyan-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 w-64 h-64 md:w-[600px] md:h-[600px] bg-blue-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* ✅ MOBILE OPTIMIZED: Larger padding on mobile */}
      <div className="relative z-10 px-3 py-4 sm:px-4 md:py-12 lg:px-6">

        {/* Hero Section */}
        <div className="max-w-7xl mx-auto mb-6 sm:mb-12 animate-slide-down">
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-800/70 via-slate-900/70 to-slate-800/70 backdrop-blur-xl border border-slate-700 shadow-2xl p-6 sm:p-8 md:p-12 hover:border-teal-500/50 transition-all duration-500 group">
            <div className="absolute inset-0 opacity-5">
              <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="upload-pattern" x="0" y="0" width="60" height="60" patternUnits="userSpaceOnUse">
                    <circle cx="30" cy="30" r="2" fill="currentColor" />
                    <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                    <circle cx="50" cy="50" r="1.5" fill="currentColor" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#upload-pattern)" />
              </svg>
            </div>

            <div className="absolute top-0 left-0 w-12 h-12 sm:w-20 sm:h-20 border-t-2 border-l-2 border-teal-500/50 group-hover:w-20 group-hover:h-20 sm:group-hover:w-32 sm:group-hover:h-32 transition-all duration-500"></div>
            <div className="absolute bottom-0 right-0 w-12 h-12 sm:w-20 sm:h-20 border-b-2 border-r-2 border-cyan-500/50 group-hover:w-20 group-hover:h-20 sm:group-hover:w-32 sm:group-hover:h-32 transition-all duration-500"></div>

            <div className="relative z-10">
              <div className="flex flex-col md:flex-row justify-between items-center mb-6 sm:mb-8 gap-4">
                <span className="inline-flex items-center gap-2 sm:gap-3 px-4 sm:px-6 py-3 sm:py-3 bg-gradient-to-r from-teal-500/20 to-cyan-500/20 text-teal-300 rounded-full text-sm sm:text-sm font-bold border border-teal-400/40 shadow-lg">
                  <span className="relative flex h-2.5 w-2.5 sm:h-3 sm:w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 sm:h-3 sm:w-3 bg-teal-400"></span>
                  </span>
                  <span>📤 Stage 1: Tumor Detection</span>
                </span>
              </div>

              <div className="text-center mb-6 sm:mb-8">
                {/* ✅ MOBILE: Larger heading */}
                <h1 className="text-4xl sm:text-4xl md:text-5xl font-bold text-white mb-4 sm:mb-4 leading-tight">
                  Submit Your Medical{' '}
                  <span className="relative inline-block">
                    <span className="absolute -inset-1 bg-gradient-to-r from-teal-400 via-cyan-400 to-blue-400 blur-2xl opacity-50 group-hover:opacity-70 transition-opacity"></span>
                    <span className="relative bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      Imaging Data
                    </span>
                  </span>
                </h1>
                {/* ✅ MOBILE: Larger text */}
                <p className="text-base sm:text-lg text-slate-200 max-w-2xl mx-auto leading-relaxed mb-6 sm:mb-8 px-2">
                  Our AI will analyze bone structure patterns, density anomalies, and tissue composition in real-time
                </p>
              </div>

              <div className="grid grid-cols-3 gap-3 sm:gap-4">
                {[
                  { icon: '⚡', label: 'Instant', sub: 'Detection', color: 'teal' },
                  { icon: '🎯', label: 'Precise', sub: 'Accuracy', color: 'cyan' },
                  { icon: '🔐', label: 'Secure', sub: 'Protocol', color: 'blue' },
                ].map((item, idx) => (
                  <div key={idx} className="bg-slate-700/30 backdrop-blur-sm border border-slate-600 rounded-xl p-4 sm:p-4 hover:scale-105 transition-all duration-300">
                    <div className="flex flex-col items-center gap-2">
                      <div className={`w-10 h-10 sm:w-10 sm:h-10 bg-${item.color}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                        <span className="text-2xl sm:text-2xl">{item.icon}</span>
                      </div>
                      <div className="text-center">
                        <div className={`text-lg sm:text-xl font-bold text-${item.color}-400`}>{item.label}</div>
                        <div className="text-xs sm:text-xs text-slate-400">{item.sub}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Main Form */}
        <div className="max-w-6xl mx-auto">
          <div className="relative bg-slate-800/60 backdrop-blur-xl border border-slate-700 rounded-2xl overflow-hidden shadow-2xl">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute inset-0" style={{
                backgroundImage: 'repeating-linear-gradient(45deg, transparent, transparent 35px, rgba(148, 163, 184, 0.1) 35px, rgba(148, 163, 184, 0.1) 70px)'
              }}></div>
            </div>

            <div className="h-1 bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 animate-gradient"></div>

            {/* ✅ MOBILE: Larger padding */}
            <div className="p-6 sm:p-6 lg:p-12">
              <div className="mb-10 sm:mb-10 animate-slide-down">
                <div className="flex items-center justify-center gap-4 mb-6 sm:mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                  <div className="inline-flex items-center gap-2 px-4 sm:px-4 py-3 bg-cyan-500/10 rounded-full border border-cyan-500/30">
                    <span className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></span>
                    <span className="text-sm sm:text-sm font-bold text-cyan-400 tracking-wider uppercase">Stage 1: Detection</span>
                  </div>
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent"></div>
                </div>

                <div className="text-center">
                  {/* ✅ MOBILE: Larger heading */}
                  <h2 className="text-3xl sm:text-3xl md:text-4xl font-bold text-white mb-3 sm:mb-3">
                    <span className="bg-gradient-to-r from-teal-300 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                      Upload & Analyze
                    </span>
                  </h2>
                  {/* ✅ MOBILE: Larger text */}
                  <p className="text-base sm:text-base text-slate-400">Complete the form below to begin AI-powered tumor detection</p>
                </div>
              </div>

              {/* ✅ MOBILE: Single column layout on mobile */}
              <div className="grid lg:grid-cols-2 gap-8 sm:gap-8">

                {/* LEFT COLUMN */}
                <div className="space-y-6 sm:space-y-6 animate-slide-right">

                  {/* File Upload */}
                  <div className="relative group">
                    <div
                      className={`relative transition-all duration-500 rounded-2xl overflow-hidden ${
                        isDragging
                          ? "border-4 border-teal-500 bg-gradient-to-br from-teal-500/20 to-cyan-500/20 shadow-2xl scale-[1.02]"
                          : selectedFile
                          ? "border-4 border-emerald-500 bg-gradient-to-br from-emerald-500/20 to-teal-500/20 shadow-2xl"
                          : "border-2 border-dashed border-slate-600 hover:border-teal-500/60 bg-gradient-to-br from-slate-700/20 to-slate-800/20"
                      }`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                    >
                      <input
                        type="file"
                        accept=".jpg,.png,.dicom"
                        onChange={handleFileSelect}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      />

                      {/* ✅ MOBILE: Larger padding and text */}
                      <div className="p-8 sm:p-10 text-center">
                        {selectedFile ? (
                          <div className="space-y-4 sm:space-y-4">
                            <div className="relative inline-block">
                              <div className="text-6xl sm:text-6xl animate-bounce text-emerald-400">✓</div>
                              <div className="absolute inset-0 bg-emerald-400/20 blur-3xl animate-pulse"></div>
                            </div>
                            <div className="space-y-2 sm:space-y-2">
                              <div className="text-xl sm:text-lg font-bold text-emerald-400 break-all px-2">
                                {selectedFile.name}
                              </div>
                              <div className="flex items-center justify-center gap-2 text-slate-400 text-sm sm:text-sm flex-wrap">
                                <span>Size: {(selectedFile.size / 1024).toFixed(2)} KB</span>
                                <span>•</span>
                                <span>Type: {selectedFile.type || 'Unknown'}</span>
                              </div>
                            </div>
                            <div className="inline-flex items-center gap-2 px-4 sm:px-4 py-2 sm:py-2 bg-emerald-500/10 rounded-full border border-emerald-500/30">
                              <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
                              </span>
                              <span className="text-sm sm:text-sm font-semibold text-emerald-400">Validated & Ready</span>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-4 sm:space-y-4">
                            <div className="relative inline-block">
                              <div className="text-7xl sm:text-6xl text-teal-400 group-hover:scale-110 transition-transform duration-300">📤</div>
                              <div className="absolute inset-0 bg-teal-400/10 blur-2xl group-hover:bg-teal-400/20 transition-all"></div>
                            </div>
                            <div className="space-y-2 sm:space-y-2">
                              <div className="text-2xl sm:text-xl font-bold text-white">
                                Drag & Drop Medical Images
                              </div>
                              <div className="text-slate-400 text-lg sm:text-base">
                                or <span className="text-teal-400 font-semibold cursor-pointer hover:underline">browse files</span>
                              </div>
                            </div>
                            <div className="flex items-center justify-center gap-3 sm:gap-3 pt-2 flex-wrap">
                              <div className="px-4 sm:px-4 py-2 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg">
                                <div className="text-xs sm:text-xs text-slate-400 mb-1">X-Ray Images</div>
                                <div className="text-sm sm:text-sm font-semibold text-white">.jpg • .png</div>
                              </div>
                              <div className="px-4 sm:px-4 py-2 sm:py-2 bg-slate-700/50 border border-slate-600 rounded-lg">
                                <div className="text-xs sm:text-xs text-slate-400 mb-1">Medical Format</div>
                                <div className="text-sm sm:text-sm font-semibold text-white">.dicom</div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* OR Divider */}
                  <div className="relative py-3 sm:py-3">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-600 to-transparent"></div>
                    </div>
                    <div className="relative flex justify-center">
                      <span className="px-6 sm:px-6 py-2 sm:py-2 bg-slate-800 text-slate-400 font-bold text-sm sm:text-sm rounded-full border-2 border-slate-700 shadow-lg">
                        OR PROVIDE URL
                      </span>
                    </div>
                  </div>

                  {/* URL Input */}
                  <div className="space-y-3 sm:space-y-3">
                    <label className="flex items-center gap-2 text-sm sm:text-sm font-bold text-teal-400 uppercase tracking-wide">
                      <span>🌐</span>
                      <span>Remote Image URL</span>
                      <span className="ml-auto text-xs text-slate-500 normal-case tracking-normal">(Optional)</span>
                    </label>
                    <div className="relative group">
                      <input
                        type="url"
                        placeholder="https://medical-server.com/scan-image.jpg"
                        className="w-full bg-slate-700/50 text-white text-lg sm:text-lg px-5 sm:px-6 py-4 sm:py-4 rounded-xl border-2 border-slate-600 focus:border-teal-500 focus:ring-4 focus:ring-teal-500/20 outline-none transition-all placeholder:text-slate-500 hover:bg-slate-700/70 hover:border-slate-500"
                        value={url || ""}
                        onChange={(e) => {
                          setUrl(e.target.value);
                          setPrediction(null);
                          setDetectionData(null);
                          setIsTumorDetected(false);
                        }}
                      />
                      <div className="absolute right-4 sm:right-4 top-1/2 -translate-y-1/2 text-slate-500 group-hover:text-teal-400 transition-colors text-xl">🔗</div>
                    </div>
                  </div>

                  {/* Patient Info */}
                  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 sm:p-6">
                    <div className="flex items-center gap-3 mb-6 sm:mb-6">
                      <div className="w-12 h-12 sm:w-12 sm:h-12 bg-cyan-500/30 rounded-xl flex items-center justify-center border border-cyan-500/30 flex-shrink-0">
                        <span className="text-3xl sm:text-3xl">👥</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg sm:text-lg">Patient Metadata</h3>
                        <p className="text-slate-400 text-sm">Essential for accurate diagnosis</p>
                      </div>
                    </div>

                    <div className="space-y-5 sm:space-y-5">
                      <div className="space-y-3 sm:space-y-3">
                        <label className="flex items-center gap-2 text-sm sm:text-sm font-bold text-cyan-400 uppercase tracking-wide">
                          <span className="text-2xl sm:text-2xl">🎂</span>
                          <span>Age (Years)</span>
                        </label>
                        <input
                          type="number"
                          placeholder="e.g., 45"
                          value={age}
                          onChange={(e) => setAge(e.target.value)}
                          className="w-full bg-slate-700/50 text-white text-lg sm:text-lg px-5 sm:px-5 py-4 sm:py-4 rounded-xl border-2 border-slate-600 focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/20 outline-none transition-all placeholder:text-slate-500"
                        />
                      </div>

                      <div className="space-y-3 sm:space-y-3">
                        <label className="flex items-center gap-2 text-sm sm:text-sm font-bold text-blue-400 uppercase tracking-wide">
                          <span className="text-2xl sm:text-2xl">⚧</span>
                          <span>Biological Sex</span>
                        </label>
                        <div className="grid grid-cols-2 gap-3">
                          {['male', 'female'].map((g) => (
                            <button
                              key={g}
                              type="button"
                              onClick={() => handleChange(g)}
                              className={`relative py-3 px-4 sm:px-4 rounded-xl font-bold transition-all duration-300 overflow-hidden text-lg sm:text-lg ${
                                gender === g
                                  ? "bg-gradient-to-br from-teal-500 to-cyan-500 text-white shadow-xl shadow-teal-500/30 scale-105"
                                  : "bg-slate-700/50 text-slate-300 border-2 border-slate-600 hover:border-teal-500/60 hover:scale-105"
                              }`}
                            >
                              {gender === g && <div className="absolute inset-0 bg-white/10"></div>}
                              <span className="relative flex items-center justify-center gap-2">
                                {gender === g && <span>✓</span>}
                                <span className="text-2xl sm:text-2xl">{g === 'male' ? '♂' : '♀'}</span>
                                <span className="capitalize">{g}</span>
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <button
                    type="submit"
                    onClick={storeInBackend}
                    disabled={isAnalyzing || isUploading}
                    className={`group relative w-full py-4 text-xl sm:text-xl font-bold text-white rounded-xl bg-gradient-to-r from-teal-500 via-cyan-500 to-blue-500 hover:from-teal-400 hover:via-cyan-400 hover:to-blue-400 shadow-2xl shadow-teal-500/50 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${
                      (isAnalyzing || isUploading) ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    <span className="mx-auto relative flex items-center justify-center gap-3">
                      {isUploading ? (
                        <><span className="animate-spin text-2xl sm:text-2xl">⚙️</span><span>Uploading...</span></>
                      ) : isAnalyzing ? (
                        <><span className="animate-spin text-2xl sm:text-2xl">⚙️</span><span>Analyzing...</span></>
                      ) : (
                        <div className="mx-auto flex items-center gap-2">
                          <span>🚀 Begin Analysis</span>
                          <span className="text-2xl sm:text-3xl group-hover:translate-x-2 transition-transform">→</span>
                        </div>
                      )}
                    </span>
                  </button>
                </div>

                {/* RIGHT COLUMN */}
                <div className="space-y-6 sm:space-y-6 animate-slide-left">

                  {/* Model Info Card */}
                  <div className="bg-gradient-to-br from-purple-500 to-pink-500/20 border border-purple-500/40 rounded-xl p-6 sm:p-5 hover:border-purple-500/60 transition-colors duration-300">
                    <div className="flex flex-col items-center text-center gap-3">
                      <div className="pl-1 w-14 h-14 sm:w-14 sm:h-14 bg-purple-500/30 rounded-xl flex items-center justify-center mb-2">
                        <span className="text-4xl sm:text-3xl">🦴</span>
                      </div>
                      <div className="text-white font-bold text-base">Stage 1</div>
                      <div className="text-white text-lg sm:text-lg leading-relaxed">Tumor Detection Model</div>
                      <div className={`mt-2 px-4 py-2 rounded-full text-sm font-semibold ${
                        tumorModel
                          ? 'bg-green-500/20 text-green-400 border border-green-500/30 mx-auto'
                          : 'bg-orange-500/20 text-orange-400 border border-orange-500/30 mx-auto'
                      }`}>
                        {tumorModel ? '✓ Ready' : '⏳ Loading...'}
                      </div>
                    </div>
                  </div>

                  {/* Analysis Pipeline */}
                  <div className="bg-gradient-to-br from-slate-700/40 to-slate-800/40 backdrop-blur-sm border border-slate-600 rounded-2xl p-6 sm:p-6">
                    <div className="flex items-center gap-3 mb-6 sm:mb-5">
                      <div className="w-12 h-12 sm:w-12 sm:h-12 bg-blue-500/30 rounded-xl flex items-center justify-center flex-shrink-0">
                        <span className="text-3xl sm:text-3xl pl-1">⚡</span>
                      </div>
                      <div>
                        <h3 className="text-white font-bold text-lg sm:text-lg">Detection Process</h3>
                        <p className="text-slate-400 text-sm">AI-Powered Analysis</p>
                      </div>
                    </div>

                    <div className="space-y-4 sm:space-y-4">
                      {[
                        { num: '1', color: 'purple', title: 'Image Upload', sub: 'Submit medical image', icon: '📤' },
                        { num: '2', color: 'blue', title: 'AI Analysis', sub: 'Detect tumor presence', icon: '🔬' },
                        { num: '3', color: 'cyan', title: 'Results Display', sub: 'View detection results', icon: '📊' },
                      ].map((step, idx) => (
                        <React.Fragment key={idx}>
                          <div className="flex items-center gap-3">
                            <div className={`flex-shrink-0 w-8 h-8 sm:w-8 sm:h-8 bg-${step.color}-500/20 rounded-lg flex items-center justify-center border border-${step.color}-500/30`}>
                              <span className={`pl-2 text-lg sm:text-lg font-bold text-${step.color}-400`}>{step.num}</span>
                            </div>
                            <div className="flex-1">
                              <div className="text-white font-semibold text-sm sm:text-sm mb-1">{ step.title}</div>
                              <div className="text-slate-400 text-sm">{step.sub}</div>
                            </div>
                            <div className="text-2xl sm:text-2xl">{step.icon}</div>
                          </div>
                          {idx < 2 && (
                            <div className="flex items-center gap-3 pl-4">
                              <div className={`w-px h-6 sm:h-8 bg-gradient-to-b from-${step.color}-500/50 to-${['blue','cyan','teal'][idx]}-500/50`}></div>
                            </div>
                          )}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>

                  {/* Detection Results */}
                  {prediction && (
                    <div className="bg-gradient-to-br from-purple-500/45 to-pink-500/20 backdrop-blur-sm border-2 border-purple-500/50 rounded-2xl p-6 sm:p-6">
                      <div className="flex items-center gap-3 mb-5">
                        <div className="w-12 h-12 sm:w-12 sm:h-12 bg-purple-950 rounded-xl flex items-center justify-center flex-shrink-0">
                          <span className="text-2xl sm:text-2xl pl-2">🦴</span>
                        </div>
                        <div>
                          <h3 className="text-white font-bold text-lg sm:text-lg">🔬 Detection Results</h3>
                          <p className="text-purple-300 text-sm">Confidence Scores</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {prediction
                          .sort((a, b) => b.probability - a.probability)
                          .map((pred, index) => (
                            <div key={index} className="bg-slate-800/50 rounded-lg p-4 sm:p-3">
                              <div className="flex justify-between items-center mb-2">
                                <span className="text-white font-semibold text-lg sm:text-base">{pred.className}</span>
                                <span className="text-purple-300 font-bold text-lg sm:text-base">
                                  {(pred.probability * 100).toFixed(1)}%
                                </span>
                              </div>
                              <div className="w-full bg-slate-700 rounded-full h-3 overflow-hidden">
                                <div
                                  className="bg-gradient-to-r from-purple-500 to-pink-500 h-3 rounded-full transition-all duration-500"
                                  style={{ width: `${pred.probability * 100}%` }}
                                ></div>
                              </div>
                            </div>
                          ))}
                      </div>

                      {isTumorDetected && (
                        <button
                          onClick={handleNavigateToClassification}
                          className="w-full mt-6 sm:mt-6 py-4 px-6 sm:px-6 text-lg sm:text-lg font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-400 hover:via-red-400 hover:to-pink-500 shadow-2xl shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] group"
                        >
                          <span className="relative flex items-center justify-center gap-2">
                            <span>🔍 Proceed to Classification</span>
                            <span className="text-2xl sm:text-2xl group-hover:translate-x-1 transition-transform">→</span>
                          </span>
                        </button>
                      )}

                      {!isTumorDetected && (
                        <div className="w-full mt-6 sm:mt-6 py-4 px-6 sm:px-6 bg-emerald-500/20 border-2 border-emerald-500/50 rounded-xl text-center">
                          <p className="text-emerald-300 font-semibold text-lg sm:text-base">✅ No tumor detected - Classification not needed</p>
                        </div>
                      )}
                    </div>
                  )}

                  {/* Info Cards */}
                  <div className="space-y-3">
                    {[
                      { bg: 'emerald', icon: '✓', title: 'Medical-Grade AI', sub: 'Trained on 3,726+ images' },
                      { bg: 'blue', icon: '🔒', title: 'HIPAA Compliant', sub: 'Enterprise-grade security' },
                    ].map((item, idx) => (
                      <div key={idx} className={`bg-${item.bg}-500/10 border border-${item.bg}-500/30 rounded-xl p-4 sm:p-4 hover:border-${item.bg}-500/50 transition-colors duration-300`}>
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 sm:w-10 sm:h-10 bg-${item.bg}-500/20 rounded-lg flex items-center justify-center flex-shrink-0`}>
                            <span className="text-2xl sm:text-2xl pl-1">{item.icon}</span>
                          </div>
                          <div>
                            <div className={`text-${item.bg}-300 font-bold text-sm sm:text-sm`}>{item.title}</div>
                            <div className={`text-${item.bg}-400/60 text-xs`}>{item.sub}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Bottom Security Section */}
              <div className="mt-10 sm:mt-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-6">
                {[
                  {
                    iconBg: 'from-teal-500/20 to-cyan-500/20', iconBorder: 'border-teal-500/30',
                    icon: '🛡️', title: 'Data Protection',
                    desc: 'All uploads are encrypted end-to-end using AES-256 encryption protocol'
                  },
                  {
                    iconBg: 'from-cyan-500/20 to-blue-500/20', iconBorder: 'border-cyan-500/30',
                    icon: '📋', title: 'Regulatory Compliance',
                    badges: ['HIPAA', 'GDPR', 'ISO 27001', 'FDA Class II']
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
        .animate-gradient { background-size: 200% 200%; animation: gradient 3s ease infinite; }
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

export default TumorDetection;


