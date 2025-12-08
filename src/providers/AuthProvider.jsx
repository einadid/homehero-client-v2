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

  // Create user with email and password
  const createUser = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // ✅ Error হলে loading false
      throw error;
    }
    // Note: Success হলে onAuthStateChanged loading false করবে
  };

  // Sign in with email and password
  const signIn = async (email, password) => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      return result;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // ✅ Error হলে loading false
      throw error;
    }
  };

  // Sign in with Google
  const signInWithGoogle = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      return result;
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // ✅ Error হলে loading false
      throw error;
    }
  };

  // Log out
  const logOut = async () => {
    setLoading(true);
    setAuthError(null);
    try {
      await signOut(auth);
      // onAuthStateChanged will set loading to false
    } catch (error) {
      setAuthError(error.message);
      setLoading(false); // ✅ Error হলে loading false
      throw error;
    }
  };

  // Update user profile (name and photo)
  const updateUserProfile = async (name, photo) => {
    setAuthError(null);
    try {
      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photo,
      });
      // Update local user state
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

  // Send password reset email
  const resetPassword = async (email) => {
    setAuthError(null);
    try {
      await sendPasswordResetEmail(auth, email);
    } catch (error) {
      setAuthError(error.message);
      throw error;
    }
  };

  // Update email (requires recent login)
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

  // Update password (requires recent login)
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

  // Get formatted last sign in time
  const getLastSignInTime = () => {
    if (user?.metadata?.lastSignInTime) {
      return new Date(user.metadata.lastSignInTime).toLocaleString();
    }
    return 'N/A';
  };

  // Get account creation time
  const getCreationTime = () => {
    if (user?.metadata?.creationTime) {
      return new Date(user.metadata.creationTime).toLocaleString();
    }
    return 'N/A';
  };

  // ✅ Auth state observer with JWT integration - FIXED
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('Auth State Changed:', currentUser?.email || 'No user'); // Debug log
      
      setUser(currentUser);

      // JWT Token Management
      if (currentUser) {
        const userInfo = { email: currentUser.email };
        try {
          // Get JWT token from server
          const response = await axiosPublic.post('/jwt', userInfo);
          console.log('JWT Token Generated:', response.data); // Debug log
        } catch (error) {
          console.error('JWT generation error:', error);
        }
      } else {
        // Clear JWT token
        try {
          await axiosPublic.post('/logout');
          console.log('User logged out, token cleared'); // Debug log
        } catch (error) {
          console.error('Logout error:', error);
        }
      }

      // ✅ সব কাজ শেষে loading false - এটাই মূল fix
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ Clear auth error after 5 seconds
  useEffect(() => {
    if (authError) {
      const timer = setTimeout(() => {
        setAuthError(null);
      }, 5000);
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