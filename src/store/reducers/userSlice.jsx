

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    users: null,
    loading: false,
    error: null
};

const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        // Load user into Redux state
        loadUser: (state, action) => {
            state.users = action.payload;
            state.error = null;
            state.loading = false;
        },
        
        // Remove user from Redux state
        removeUser: (state) => {
            state.users = null;
            state.error = null;
            state.loading = false;
        },
        
        // Set loading state
        setLoading: (state, action) => {
            state.loading = action.payload;
        },
        
        // Set error
        setError: (state, action) => {
            state.error = action.payload;
        },
        
        // Clear error
        clearError: (state) => {
            state.error = null;
        }
    }
});

export const { loadUser, removeUser, setLoading, setError, clearError } = userSlice.actions;
export default userSlice.reducer;

