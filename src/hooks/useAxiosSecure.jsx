import axios from 'axios';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './useAuth';

// Create the axios instance
const axiosSecure = axios.create({
  // Use your environment variable for the API URL
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true, // Important: sends cookies to the server
});

const useAxiosSecure = () => {
  const { logOut } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // 1. Intercept responses to check for errors
    const interceptor = axiosSecure.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error) => {
        // 2. If the error is 401 (Unauthorized) or 403 (Forbidden)
        if (error.response?.status === 401 || error.response?.status === 403) {
          // Log the user out and redirect to login
          console.log('Unauthorized access, logging out...');
          await logOut();
          navigate('/login');
        }
        return Promise.reject(error);
      }
    );
    
    // Cleanup the interceptor when component unmounts
    return () => {
      axiosSecure.interceptors.response.eject(interceptor);
    };
  }, [logOut, navigate]);

  return axiosSecure;
};

export default useAxiosSecure;