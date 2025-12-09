// src/providers/AuthProvider.jsx
import { createContext, useEffect, useState } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { axiosPublic } from '../hooks/useAxios';

export const AuthContext = createContext(null);
const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Create user
  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  // Sign in
  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  // Google Sign in
  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  // Log out
  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem('access-token'); // ✅ Clear token first
    
    try {
      await axiosPublic.post('/logout');
    } catch (error) {
      console.error('Logout API error:', error);
    }
    
    return signOut(auth);
  };

  // Update profile
  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, {
      displayName: name,
      photoURL: photo,
    });
  };

  // Reset password
  const resetPassword = (email) => {
    return sendPasswordResetEmail(auth, email);
  };

  // ✅ AUTH STATE OBSERVER - CRITICAL FIX
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔐 Auth State Changed:', currentUser?.email || 'No user');
      
      if (currentUser?.email) {
        try {
          // ✅ Request JWT token
          const response = await axiosPublic.post('/jwt', {
            email: currentUser.email,
          });

          console.log('📦 JWT Response:', response.data);

          if (response.data?.success && response.data?.token) {
            // ✅ Save token to localStorage
            localStorage.setItem('access-token', response.data.token);
            console.log('✅ Token SAVED:', response.data.token.substring(0, 20) + '...');
            
            // ✅ Double-check it was saved
            const verify = localStorage.getItem('access-token');
            if (verify) {
              console.log('✅ Token VERIFIED in localStorage');
            } else {
              console.error('❌ Token NOT SAVED - localStorage issue');
            }
          } else {
            console.error('❌ Invalid JWT response:', response.data);
          }
        } catch (error) {
          console.error('❌ JWT Request Failed:', error.response?.data || error.message);
          localStorage.removeItem('access-token');
        }
        
        // ✅ Set user AFTER token handling
        setUser(currentUser);
      } else {
        // No user - clear everything
        console.log('🚪 No user, clearing token');
        localStorage.removeItem('access-token');
        setUser(null);
        
        try {
          await axiosPublic.post('/logout');
        } catch (error) {
          // Ignore logout errors when no user
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Auto clear error
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  const authInfo = {
    user,
    loading,
    authError,
    createUser,
    signIn,
    signInWithGoogle,
    logOut,
    updateUserProfile,
    resetPassword,
    setAuthError,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;