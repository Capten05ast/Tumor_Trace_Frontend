

// import axios from "axios"

// const instance = axios.create({
//     baseURL : "http://localhost:3000/"
// })

// export default instance;









import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:5000",
  withCredentials: true // 🔥 REQUIRED for auth cookies
});

// ✅ ADD TOKEN TO ALL REQUESTS AUTOMATICALLY
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token added to request');
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;



