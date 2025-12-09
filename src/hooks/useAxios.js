// src/hooks/useAxios.js
import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'https://homehero-server-v2.vercel.app';

// ✅ Public Axios (No Auth Required)
export const axiosPublic = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Secure Axios (With Auth Token)
const axiosSecure = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Request Interceptor - MUST Attach Token
axiosSecure.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access-token');
    
    console.log('🔐 Axios Request Interceptor:');
    console.log('   URL:', config.url);
    console.log('   Token exists:', !!token);
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ✅ Response Interceptor - Handle Errors
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    const message = error.response?.data?.message;
    
    console.error('🚨 API Error:', { status, message, url: error.config?.url });
    
    if (status === 401) {
      console.warn('🔒 401 Unauthorized - Redirecting to login...');
      // Token invalid বা expired
      localStorage.removeItem('access-token');
      
      // Optional: Redirect to login
      // window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export default axiosSecure;