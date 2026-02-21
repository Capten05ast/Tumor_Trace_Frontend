

// src/reducers/uploadSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    fileURL: null,           // The Firebase Storage download URL
    metadata: null,          // Data posted to JSON Server (optional for this flow)
    predictionResult: null,  // The final ML prediction object
    status: 'idle',          // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,             // Any error message
};

const uploadSlice = createSlice({
    name: "upload",
    initialState,
    reducers: {
        // Sets the overall status of the operation
        setUploadStatus: (state, action) => {
            state.status = action.payload.status;
            state.error = action.payload.error || null;
        },
        
        // Stores the file URL and any associated metadata
        setFileMetadata: (state, action) => {
            state.fileURL = action.payload.fileURL;
            state.metadata = action.payload.metadata || null;
            // Note: status is often set to 'loading' here by the action creator
        },

        // Stores the final prediction result after the ML model runs
        setPredictionResult: (state, action) => {
            state.predictionResult = action.payload;
        },

        // Resets the state for a new upload attempt
        resetUploadState: (state, action) => {
            // This is a simple way to return to the initial state
            return initialState; 
        }
    }
});

// Export the actions for use in userUpload.jsx
export const { 
    setUploadStatus, 
    setFileMetadata, 
    setPredictionResult, 
    resetUploadState 
} = uploadSlice.actions;

// Export the reducer to be included in your store.js
export default uploadSlice.reducer;