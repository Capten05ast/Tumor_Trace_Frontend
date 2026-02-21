


import { ToastContainer } from "react-toastify"
import { toast } from "react-toastify"
import { loadUser } from "../reducers/userSlice"
import { removeUser } from "../reducers/userSlice"

import axios from "../../api/axiosconfig"


export const asyncRegister = (user) => async (dispatch, getState) => {
    try {
        
        const res = await axios.post("/xray_images", user)
        console.log(res);
        toast.success("User Registered Successfully!");
    } catch (error) {
        console.log(error);
        toast.error("Registration Failed!");
    }
}


export const asyncLogin = (user) => async (dispatch, getState) => {
    try {
        const { data } = await axios.get(`/xray_images?password=${user.password}&email=${user.email}`)
        console.log(data);

        if (data.length === 0) {
            console.log("Invalid Records");
            return;
        } 

        localStorage.setItem("user", JSON.stringify(data[0]));
        dispatch(asyncCurrentUser())
    } catch (error) {
        console.log(error);
        toast.error("Login Failed!")
    }
}


// ✅ FETCH CURRENT USER (with token from localStorage)
export const asyncCurrentUser = () => async (dispatch) => {
  try {
    const token = localStorage.getItem('authToken');
    
    // ✅ If no token, user is not logged in
    if (!token) {
      console.log("ℹ️ No token found - user not logged in");
      return;
    }

    // ✅ Token will be automatically added by axios interceptor
    const { data } = await axios.get("/api/user/current");

    console.log("✅ User fetched:", data.user);
    dispatch(loadUser(data.user));
  } catch (error) {
    if (error.response?.status === 401) {
      console.log("ℹ️ No active session - user not logged in");
      return;
    }
    
    console.error("❌ Failed to fetch current user:", error);
  }
};


export const asyncLogout = () => async (dispatch, getState) => {
    try {
        localStorage.removeItem("user");
        localStorage.removeItem("authToken"); // ✅ Also remove token
        dispatch(removeUser());
        console.log("user logged out!");
        toast.success("user logged out!")
    } catch (error) {
        console.log(error);
    }
}


export const asyncdelete = (id) => async (dispatch, getState) => {
    try {
        const data = axios.delete("/xray_images/" + id);
        dispatch(asyncLogout());
        toast.success("User deleted");
    } catch (error) {
        console.log(error);
    }
}


export const updateUser = (id, user) => async (dispatch, getState) => {
    try {
        const { data } = await axios.patch("/xray_images/" + id, user);
        localStorage.setItem("user", JSON.stringify(data));
        console.log("User updated Successfully");
        toast.success("User Updated!");
        dispatch(asyncCurrentUser());
    } catch (error) {
        console.log(error);
    }
}


// ============================================
// BACKEND API BASED CONNECTIONS
// ============================================

// ✅ BACKEND LOGIN USER
export const asyncLoginBackend = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      "/api/user/login",
      credentials
    );

    // ✅ Save token from response
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    dispatch(loadUser(data.user));
    toast.success("Logged in successfully");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Login failed");
  }
};


// ✅ BACKEND LOGOUT USER - IMPROVED (Graceful fallback)
export const asyncLogoutBackend = () => async (dispatch) => {
  try {
    console.log('🔓 Attempting backend logout...');
    
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        // Try to notify backend
        await axios.post("/api/user/logout");
        console.log('✅ Backend logout successful');
      } catch (backendError) {
        console.log('⚠️ Backend logout failed (but clearing frontend anyway):', backendError.response?.status);
        // Don't throw - continue with frontend logout
      }
    } else {
      console.log('⚠️ No token found, skipping backend logout');
    }

    // ✅ ALWAYS clear frontend data regardless of backend response
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    dispatch(removeUser());
    toast.success("Logged out successfully");
  } catch (error) {
    console.error('❌ Logout error:', error);
    // Still clear data even if there's an error
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    dispatch(removeUser());
    toast.success("Logged out successfully");
  }
};


// ✅ BACKEND DELETE USER
export const asyncDeleteUserBackend = () => async (dispatch) => {
  try {
    await axios.delete("/api/user/delete");

    // ✅ Clear token and user data
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    
    dispatch(removeUser());
    toast.success("User deleted successfully");
  } catch (error) {
    console.error(error);
    toast.error("User deletion failed");
  }
};


// ✅ BACKEND REGISTER USER
export const asyncRegisterBackend = (user) => async (dispatch) => {
  try {
    const { data } = await axios.post(
      "/api/user/register",
      user
    );

    // ✅ Save token from response
    if (data.token) {
      localStorage.setItem('authToken', data.token);
    }

    dispatch(loadUser(data.user));
    toast.success("User registered successfully");
  } catch (error) {
    console.error(error);
    toast.error(error.response?.data?.message || "Registration failed");
  }
};


// ✅ BACKEND UPDATE USER
export const asyncUpdateUserBackend = (userData) => async (dispatch) => {
  try {
    const { data } = await axios.put(
      "/api/user/update",
      userData
    );

    dispatch(loadUser(data.user));
    toast.success("User updated");
  } catch (error) {
    console.error(error);
    toast.error("Update failed");
  }
};


// ✅ HANDLE GOOGLE OAUTH CALLBACK (called from Login.jsx and Register.jsx useEffect)
export const asyncHandleGoogleAuth = (tokenFromUrl, userDataFromUrl) => async (dispatch) => {
  try {
    // ✅ Save token to localStorage
    if (tokenFromUrl) {
      localStorage.setItem('authToken', tokenFromUrl);
      console.log('✅ Token saved to localStorage');
    }

    // ✅ Save user data and dispatch to Redux
    if (userDataFromUrl) {
      localStorage.setItem('user', JSON.stringify(userDataFromUrl));
      dispatch(loadUser(userDataFromUrl));
      console.log('✅ User data saved:', userDataFromUrl);
    }

    toast.success("Logged in with Google successfully!");
  } catch (error) {
    console.error('❌ Google auth error:', error);
    toast.error("Google login failed");
  }
};


