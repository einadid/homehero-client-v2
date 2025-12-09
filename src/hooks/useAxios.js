import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// পরিবেশ ভেরিয়েবল থেকে URL নেওয়া (Fallback সহ)
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// পাবলিক ইনস্ট্যান্স (লগইন ছাড়া ব্যবহার করা যাবে)
export const axiosPublic = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// সিকিউর ইনস্ট্যান্স (লগইন করা অবস্থায় ব্যবহার হবে)
export const axiosSecure = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Request Interceptor: প্রতিটি রিকোয়েস্টে টোকেন যোগ করা
    const requestInterceptor = axiosSecure.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('access-token');
        // কনসোলে চেক করুন টোকেন আছে কিনা (ডিবাগিং এর জন্য)
        // console.log('Sending Token:', token); 
        
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // 2. Response Interceptor: 401 বা 403 আসলে লগআউট করানো
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        const status = error.response ? error.response.status : null;
        console.error("Interceptor Error Status:", status);

        if (status === 401 || status === 403) {
          console.warn("Unauthorized access detected. Logging out...");
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );

    // ক্লিনআপ ফাংশন (যাতে মেমরি লিক না হয়)
    return () => {
      axiosSecure.interceptors.request.eject(requestInterceptor);
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;