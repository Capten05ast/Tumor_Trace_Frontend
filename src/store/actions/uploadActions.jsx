

// CODE FOR REDUX TOOLKIT AS BACKEND :-

// // src/actions/userUpload.jsx

// import { 
//     setUploadStatus, 
//     setPredictionResult, 
//     setFileMetadata 
// } from "../reducers/uploadSlice" 

// import axios from "../../api/axiosconfig" // Your Axios instance for JSON Server
// import { toast } from "react-toastify"


// // // Firebase imports
// // import { storage, db } from "../../firebase-config" 
// // import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// // import { doc, setDoc } from "firebase/firestore" // For writing the final result


// // Teachable Machine/TensorFlow.js imports (assuming you have them set up)
// import * as tf from "@tensorflow/tfjs"
// import { loadGraphModel } from "@tensorflow/tfjs-converter" 


// // --- MODEL SETUP (Replace with your actual model URL/path) ---
// const MODEL_URL = "http://localhost:3000/my_ml_model/model.json"; // Example local or hosted path
// let model = null;
// const IMAGE_SIZE = 224; // Teachable Machine standard size

// // Helper to ensure the model is loaded before use
// async function ensureModelLoaded() {
//     if (!model) {
//         toast.info("Loading ML Model...");
//         model = await loadGraphModel(MODEL_URL);
//         toast.success("ML Model Loaded!");
//     }
//     return model;
// }

// // Helper to run the image through the model
// async function runPrediction(imageFile, model) {
//     const image = await new Promise(resolve => {
//         const img = new Image();
//         img.onload = () => resolve(img);
//         img.src = URL.createObjectURL(imageFile);
//     });

//     const tensor = tf.browser.fromPixels(image)
//         .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]) // Resize to model input
//         .toFloat()
//         .div(tf.scalar(255)) // Normalize
//         .expandDims(); // Add batch dimension

//     const predictions = await model.predict(tensor).data();
//     tensor.dispose(); 
    
//     // Example logic to process predictions
//     const classes = ["Normal", "Osteoporosis", "Fracture"]; // Your classes
//     const maxPrediction = Math.max(...predictions);
//     const predictedIndex = predictions.indexOf(maxPrediction);
    
//     return {
//         prediction: classes[predictedIndex],
//         confidence: maxPrediction,
//         allPredictions: predictions,
//     };
// }


// // --- THE CUSTOM ASYNC ACTION CREATOR (NO THUNK) ---
// export const asyncUploadPrediction = (file) => async (dispatch, getState) => {
    
//     dispatch(setUploadStatus({ status: 'loading', error: null }));
    
//     const fileExtension = file.name.split('.').pop();
//     const fileName = `${Date.now()}_${fileExtension}`; 
//     const storageRef = ref(storage, `bone_scans/${fileName}`);

//     try {
//         // // 1. FIREBASE STORAGE UPLOAD
//         // toast.info("1/3: Uploading image...");
//         // const snapshot = await uploadBytes(storageRef, file);
//         // const downloadURL = await getDownloadURL(snapshot.ref);


//         // Update Redux state with the URL
//         dispatch(setFileMetadata({ fileURL: downloadURL }));
        
        
//         // 2. CLIENT-SIDE ML PREDICTION
//         toast.info("2/3: Running AI analysis...");
//         const mlModel = await ensureModelLoaded();
//         const predictionResult = await runPrediction(file, mlModel);
        
        
//         // 3. FIRESTORE DATA SAVE (Prediction + Metadata)
//         const finalData = {
//             fileName: fileName,
//             downloadURL: downloadURL,
//             uploadTime: new Date().toISOString(),
//             prediction: predictionResult.prediction,
//             confidence: predictionResult.confidence,
//             status: 'analysis_complete',
//         };

//         // Save the result directly to Firestore
//         await setDoc(doc(db, 'predictions', fileName), finalData);
        
//         // You can still post to JSON Server if needed for your local backend tracking
//         // await axios.post("/uploads", finalData); 

        
//         // 4. FINAL REDUX UPDATE
//         dispatch(setPredictionResult(finalData));
//         dispatch(setUploadStatus({ status: 'succeeded', error: null }));
//         toast.success(`Analysis Complete! Prediction: ${predictionResult.prediction}`);

//     } catch (error) {
//         console.error("Upload and Prediction Error:", error);
        
//         const errorMessage = error.message || "An unknown error occurred during upload or analysis.";
//         dispatch(setUploadStatus({ status: 'failed', error: errorMessage }));
//         toast.error(`Analysis Failed: ${errorMessage}`);
//     }
// }













// CODE FOR MONGO_EXPRESS_NODE AS BACKEND :-

// src/actions/userUpload.jsx

import { 
    setUploadStatus, 
    setPredictionResult, 
    setFileMetadata 
} from "../reducers/uploadSlice" 

import axios from "../../api/axiosconfig" // Your Axios instance for JSON Server
import { toast } from "react-toastify"


// // Firebase imports
// import { storage, db } from "../../firebase-config" 
// import { ref, uploadBytes, getDownloadURL } from "firebase/storage"
// import { doc, setDoc } from "firebase/firestore" // For writing the final result


// Teachable Machine/TensorFlow.js imports (assuming you have them set up)
import * as tf from "@tensorflow/tfjs"
import { loadGraphModel } from "@tensorflow/tfjs-converter" 


// --- MODEL SETUP (Replace with your actual model URL/path) ---
const MODEL_URL = "http://localhost:3000/my_ml_model/model.json"; // Example local or hosted path
let model = null;
const IMAGE_SIZE = 224; // Teachable Machine standard size

// Helper to ensure the model is loaded before use
async function ensureModelLoaded() {
    if (!model) {
        toast.info("Loading ML Model...");
        model = await loadGraphModel(MODEL_URL);
        toast.success("ML Model Loaded!");
    }
    return model;
}

// Helper to run the image through the model
async function runPrediction(imageFile, model) {
    const image = await new Promise(resolve => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.src = URL.createObjectURL(imageFile);
    });

    const tensor = tf.browser.fromPixels(image)
        .resizeNearestNeighbor([IMAGE_SIZE, IMAGE_SIZE]) // Resize to model input
        .toFloat()
        .div(tf.scalar(255)) // Normalize
        .expandDims(); // Add batch dimension

    const predictions = await model.predict(tensor).data();
    tensor.dispose(); 
    
    // Example logic to process predictions
    const classes = ["Normal", "Osteoporosis", "Fracture"]; // Your classes
    const maxPrediction = Math.max(...predictions);
    const predictedIndex = predictions.indexOf(maxPrediction);
    
    return {
        prediction: classes[predictedIndex],
        confidence: maxPrediction,
        allPredictions: predictions,
    };
}


// --- THE CUSTOM ASYNC ACTION CREATOR (NO THUNK) ---
export const asyncUploadPrediction = (file) => async (dispatch, getState) => {
    
    dispatch(setUploadStatus({ status: 'loading', error: null }));
    
    const fileExtension = file.name.split('.').pop();
    const fileName = `${Date.now()}_${fileExtension}`; 
    const storageRef = ref(storage, `bone_scans/${fileName}`);

    try {
        // 1️⃣ RUN ML PREDICTION (frontend)
        toast.info("Running AI analysis...");
        const mlModel = await ensureModelLoaded();
        const predictionResult = await runPrediction(file, mlModel);


        // 2️⃣ BUILD ML PAYLOAD (CONTRACT)
        const mlPayload = {
        imageUrl: URL.createObjectURL(file), // or ImageKit URL if you use it
        prediction: {
            result: predictionResult.prediction,
            confidence: predictionResult.confidence,
            allPredictions: predictionResult.allPredictions
        },
        createdAt: new Date().toISOString()
        };


        // 3️⃣ SEND TO BACKEND 
        await axios.post(
            "/api/ml/result",
            mlPayload,
            { withCredentials: true }
        );

        
        // 4. FINAL REDUX UPDATE
        dispatch(setPredictionResult(finalData));
        dispatch(setUploadStatus({ status: 'succeeded', error: null }));
        toast.success(`Analysis Complete! Prediction: ${predictionResult.prediction}`);

    } catch (error) {
        console.error("Upload and Prediction Error:", error);
        
        const errorMessage = error.message || "An unknown error occurred during upload or analysis.";
        dispatch(setUploadStatus({ status: 'failed', error: errorMessage }));
        toast.error(`Analysis Failed: ${errorMessage}`);
    }
}
