// src/hooks/useAxios.js - Update
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const axiosPublic = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Important for cookies
});

const axiosSecure = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

// Response interceptor for handling 401/403
axiosSecure.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;
    
    if (status === 401 || status === 403) {
      // Redirect to login
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

export const useAxiosPublic = () => axiosPublic;
export const useAxiosSecure = () => axiosSecure;

export { axiosPublic, axiosSecure };