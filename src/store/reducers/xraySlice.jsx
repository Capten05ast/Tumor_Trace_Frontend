



import { createSlice } from "@reduxjs/toolkit";


const initialState = {
    xrays: []
}

const xraySlice = createSlice({
    name: "xray",
    initialState,
    reducers: {
        loadXray: (state, action) => {
            state.xrays = action.payload;
        },
        removeXray: (state, actions) => {
            state.xrays = null;
        }
    }
})

export const {loadXray, removeXray} = xraySlice.actions;
export default xraySlice.reducer;