import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth'; // ✅ Fixed Import

// এনভায়রনমেন্ট ভেরিয়েবল থেকে URL নেওয়া
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const axiosSecure = axios.create({
  baseURL: API_URL,
  withCredentials: true, // কুকি পাঠানোর জন্য জরুরি
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Request Interceptor (টোকেন হেডারে যোগ করা)
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        if (token) {
          config.headers.authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 2. Response Interceptor (401/403 এরর হ্যান্ডলিং)
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response ? error.response.status : null;
        
        // যদি টোকেন ভুল বা মেয়াদোত্তীর্ণ হয়
        if (status === 401 || status === 403) {
          console.log('Unauthorized access, logging out...');
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // ক্লিনআপ
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;