

import React, { useState, useEffect } from "react";
import axios from "../api/axiosconfig";
import { toast } from "react-toastify";

const PaymentButton = ({ 
  fileId, 
  userId,
  amount = 111, 
  onPaymentSuccess,
  onPaymentFailure,
  disabled = false 
}) => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayReady, setRazorpayReady] = useState(false);

  const RAZORPAY_KEY_ID = "rzp_test_SD6yyrDvL2sZlr";
  const BACKEND_URL = "http://localhost:5000";

  // ✅ Check if Razorpay is loaded on component mount
  useEffect(() => {
    const checkRazorpay = () => {
      if (typeof window.Razorpay !== 'undefined') {
        console.log('✅ Razorpay SDK loaded successfully');
        setRazorpayReady(true);
      } else {
        console.error('❌ Razorpay SDK not found! Make sure CDN is in index.html <head>');
        setRazorpayReady(false);
        toast.error('⚠️ Payment gateway loading... Please wait a moment and try again');
      }
    };

    // Check immediately
    checkRazorpay();

    // Check again after 1 second (in case of slow loading)
    const timeout = setTimeout(checkRazorpay, 1000);
    
    return () => clearTimeout(timeout);
  }, []);

  // Debug environment variables
  useEffect(() => {
    console.log('🔧 DEBUG INFO:');
    console.log('RAZORPAY_KEY_ID:', RAZORPAY_KEY_ID ? '✅ Set' : '❌ Missing');
    console.log('BACKEND_URL:', BACKEND_URL);
    console.log('fileId:', fileId);
    console.log('userId:', userId);
  }, [RAZORPAY_KEY_ID, BACKEND_URL, fileId, userId]);

  const createOrder = async () => {
    try {
      console.log("📦 Creating order...");
      console.log("  Amount:", amount * 100, "paise");
      console.log("  Backend URL:", BACKEND_URL + '/api/payment/create-order');
      
      const response = await axios.post(
        `${BACKEND_URL}/api/payment/create-order`,
        {
          amount: amount * 100,
          currency: "INR"
        },
        { withCredentials: true }
      );

      console.log("✅ Order created successfully");
      console.log("  Order ID:", response.data.id);
      console.log("  Amount:", response.data.amount);
      
      return response.data;
    } catch (error) {
      console.error("❌ Error creating order:");
      console.error("  Status:", error.response?.status);
      console.error("  Message:", error.response?.data?.message);
      console.error("  Error:", error.response?.data?.error);
      console.error("  Full:", error.message);
      
      toast.error("Failed to create payment order");
      throw error;
    }
  };

  const verifyPayment = async (paymentResponse) => {
    try {
      console.log("🔐 Verifying payment signature...");
      console.log("  Order ID:", paymentResponse.razorpay_order_id);
      console.log("  Payment ID:", paymentResponse.razorpay_payment_id);
      console.log("  Signature:", paymentResponse.razorpay_signature?.substring(0, 20) + "...");
      console.log("  fileId:", fileId);
      console.log("  userId:", userId);
      
      const response = await axios.post(
        `${BACKEND_URL}/api/payment/verify-payment`,
        {
          razorpay_order_id: paymentResponse.razorpay_order_id,
          razorpay_payment_id: paymentResponse.razorpay_payment_id,
          razorpay_signature: paymentResponse.razorpay_signature,
          fileId: fileId,
          userId: userId
        },
        { withCredentials: true }
      );

      console.log("✅ Payment verified successfully!");
      console.log("  Response:", response.data);
      
      if (response.data.success) {
        toast.success("✅ Payment verified successfully!");
        return response.data.paymentId;
      } else {
        throw new Error("Verification failed: " + response.data.message);
      }
    } catch (error) {
      console.error("❌ Payment verification error:");
      console.error("  HTTP Status:", error.response?.status);
      console.error("  Message:", error.response?.data?.message);
      console.error("  Error Details:", error.response?.data?.error);
      console.error("  Full Error:", error.message);
      
      // Log more details for debugging
      if (error.response?.data?.error) {
        console.error("  Backend Error Stack:", error.response.data.error);
      }
      
      toast.error("❌ Payment verification failed: " + (error.response?.data?.message || error.message));
      throw error;
    }
  };

  const handlePayment = async () => {
    // ✅ Validate everything before payment
    if (!razorpayReady) {
      console.error("❌ Razorpay not ready yet");
      toast.error("❌ Payment gateway not loaded. Please refresh and try again.");
      return;
    }

    if (!RAZORPAY_KEY_ID) {
      console.error("❌ RAZORPAY_KEY_ID is not set");
      toast.error("❌ Payment configuration error");
      return;
    }

    if (!fileId) {
      console.error("❌ fileId is missing");
      toast.error("❌ File ID not found. Please start from tumor detection.");
      return;
    }

    if (!userId) {
      console.error("❌ userId is missing");
      toast.error("❌ User ID not found. Please login again.");
      return;
    }

    setIsProcessing(true);
    console.log("🚀 Starting payment process...");

    try {
      // Step 1: Create order
      const order = await createOrder();

      // Step 2: Open Razorpay modal
      const options = {
        key: RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: "Bone Tumor Detection",
        description: `Tumor Classification - File: ${fileId}`,
        order_id: order.id,
        handler: async (response) => {
          console.log("💳 Payment completed by user");
          console.log("  Order ID:", response.razorpay_order_id);
          console.log("  Payment ID:", response.razorpay_payment_id);
          
          try {
            // Step 3: Verify payment
            const paymentId = await verifyPayment(response);

            // Step 4: Call success callback
            if (onPaymentSuccess) {
              console.log("✅ Calling onPaymentSuccess callback");
              onPaymentSuccess(paymentId);
            }
          } catch (error) {
            console.error("❌ Verification failed in handler");
            if (onPaymentFailure) {
              onPaymentFailure(error);
            }
          }
        },
        prefill: {
          name: "Patient",
          email: "patient@example.com",
          contact: "9999999999"
        },
        theme: {
          color: "#0d9488"
        },
        modal: {
          ondismiss: () => {
            console.log("❌ User closed payment modal");
            setIsProcessing(false);
            toast.error("❌ Payment cancelled");
          }
        }
      };

      console.log("🎯 Opening Razorpay modal with Key:", RAZORPAY_KEY_ID.substring(0, 15) + "...");
      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      setIsProcessing(false);
      console.error("❌ Payment process failed:", error);
    }
  };

  return (
    <button
      onClick={handlePayment}
      disabled={disabled || isProcessing || !razorpayReady}
      className={`w-full py-3 px-6 text-lg font-bold rounded-xl text-white bg-gradient-to-r from-orange-500 via-red-500 to-pink-600 hover:from-orange-400 hover:via-red-400 hover:to-pink-500 shadow-2xl shadow-orange-500/40 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] overflow-hidden group ${
        disabled || isProcessing || !razorpayReady ? 'opacity-70 cursor-not-allowed' : ''
      }`}
      title={!razorpayReady ? "Payment gateway loading..." : ""}
    >
      <span className="relative flex items-center justify-center gap-3">
        {!razorpayReady ? (
          <>
            <span className="text-2xl">⏳</span>
            <span>Loading Payment...</span>
          </>
        ) : isProcessing ? (
          <>
            <span className="animate-spin text-2xl">⚙️</span>
            <span>Processing...</span>
          </>
        ) : (
          <>
            <span>💳 Pay & Classify</span>
            <span className="text-2xl group-hover:translate-x-1 transition-transform">→</span>
          </>
        )}
      </span>
    </button>
  );
};

export default PaymentButton;



