// src/hooks/useAxiosSecure.js
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axiosSecure from './useAxios';
import useAuth from './useAuth';

const useAxiosSecure = () => {
  const navigate = useNavigate();
  const { logOut } = useAuth();

  useEffect(() => {
    // Response interceptor for handling auth errors
    const responseInterceptor = axiosSecure.interceptors.response.use(
      (response) => response,
      async (error) => {
        const status = error.response?.status;
        
        if (status === 401 || status === 403) {
          console.log('🚪 Auth error, logging out...');
          await logOut();
          navigate('/login', { 
            state: { message: 'Session expired. Please login again.' } 
          });
        }
        
        return Promise.reject(error);
      }
    );

    return () => {
      axiosSecure.interceptors.response.eject(responseInterceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;