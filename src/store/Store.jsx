

import { configureStore } from '@reduxjs/toolkit'
import userSlice from "./reducers/userSlice"
import xraySlice from "./reducers/xraySlice"
import uploadSlice from "./reducers/uploadSlice"

export const store = configureStore({
    reducer: {
        userReducer: userSlice,
        xrayReducer: xraySlice,
        uploadReducer: uploadSlice
    }
})