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
  updateEmail,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { auth } from '../config/firebase.config';
import { axiosPublic } from '../hooks/useAxios';

export const AuthContext = createContext(null);

const googleProvider = new GoogleAuthProvider();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // ✅ Create user
  const createUser = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      return await createUserWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // ✅ Sign in
  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      return await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // ✅ Google Sign in
  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      return await signInWithPopup(auth, googleProvider);
    } catch (error) {
      setAuthError(error.message);
      setLoading(false);
      throw error;
    }
  };

  // ✅ Log out
  const logOut = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      // ✅ Clear token first
      localStorage.removeItem('access-token');
      
      // ✅ Then logout from server
      try {
        await axiosPublic.post('/logout');
      } catch (error) {
        console.error('Server logout error:', error);
      }
      
      // ✅ Finally sign out from Firebase
      await signOut(auth);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // ✅ Update profile
  const updateUserProfile = async (name, photo) => {
    setAuthError(null);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      setUser((prev) => ({
        ...prev,
        displayName: name,
        photoURL: photo,
      }));
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ✅ Reset password
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ✅ Change email
  const changeEmail = async (newEmail, currentPassword) => {
    setAuthError(null);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updateEmail(auth.currentUser, newEmail);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ✅ Change password
  const changePassword = async (currentPassword, newPassword) => {
    setAuthError(null);
    try {
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);
      await updatePassword(auth.currentUser, newPassword);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // ✅ Metadata helpers
  const getLastSignInTime = () =>
    user?.metadata?.lastSignInTime
      ? new Date(user.metadata.lastSignInTime).toLocaleString()
      : 'N/A';

  const getCreationTime = () =>
    user?.metadata?.creationTime
      ? new Date(user.metadata.creationTime).toLocaleString()
      : 'N/A';

  // ============================================================
  // ✅ AUTH STATE OBSERVER (FIXED - Better Token Handling)
  // ============================================================
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔐 Auth State Changed:', currentUser?.email || 'No user');
      setUser(currentUser);

      if (currentUser?.email) {
        try {
          // ✅ Get JWT Token from server
          const response = await axiosPublic.post('/jwt', {
            email: currentUser.email,
          });

          console.log('📦 JWT Response:', response.data);

          if (response.data?.success && response.data?.token) {
            // ✅ Save token to localStorage
            localStorage.setItem('access-token', response.data.token);
            console.log('✅ Token saved to localStorage');
            
            // ✅ Verify token was saved
            const savedToken = localStorage.getItem('access-token');
            console.log('🔍 Token verification:', savedToken ? 'Token exists' : 'Token missing');
          } else {
            console.error('❌ No token in response:', response.data);
          }
        } catch (error) {
          console.error('❌ JWT Error:', error.response?.data || error.message);
          // ✅ Clear any stale token on error
          localStorage.removeItem('access-token');
        }
      } else {
        // ✅ User logged out - clear token
        console.log('🚪 User logged out, clearing token');
        localStorage.removeItem('access-token');
        
        try {
          await axiosPublic.post('/logout');
          console.log('✅ Server logout successful');
        } catch (error) {
          console.error('⚠️ Logout endpoint error:', error.message);
        }
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Auto clear error after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => setAuthError(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  // ============================================================
  // ✅ Check Token on Mount (For Page Refresh)
  // ============================================================
  useEffect(() => {
    const token = localStorage.getItem('access-token');
    console.log('🔄 Initial token check:', token ? 'Token found' : 'No token');
  }, []);

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
    changeEmail,
    changePassword,
    getLastSignInTime,
    getCreationTime,
    setAuthError,
  };

  return (
    <AuthContext.Provider value={authInfo}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;