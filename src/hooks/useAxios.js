// src/hooks/useAxios.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://homehero-server-v2.vercel.app';

// ✅ Public Axios - No Auth
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Secure Axios - With Auth
const axiosSecure = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor - Always attach token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token attached:', token.substring(0, 15) + '...');
    } else {
      console.warn('⚠️ No token in localStorage');
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

// ✅ Response Interceptor - Handle errors
axiosSecure.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('❌ API Error:', error.response?.status, error.response?.data?.message);
    return Promise.reject(error);
  }
);

export default axiosSecure;