import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Environment Variable থেকে URL নেওয়া
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// 1. Create Instances
export const axiosPublic = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const axiosSecure = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

// 2. Hook for Secure Axios
const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    axiosSecure.interceptors.response.use(
      (res) => res,
      async (error) => {
        console.error('Axios Error:', error.response);
        if (error.response?.status === 401 || error.response?.status === 403) {
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
  }, [logOut, navigate]);

  return axiosSecure;
};

// 3. Default & Named Exports
export default useAxiosSecure;