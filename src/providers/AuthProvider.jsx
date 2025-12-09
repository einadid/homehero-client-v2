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

  const createUser = (email, password) => {
    setLoading(true);
    return createUserWithEmailAndPassword(auth, email, password);
  };

  const signIn = (email, password) => {
    setLoading(true);
    return signInWithEmailAndPassword(auth, email, password);
  };

  const signInWithGoogle = () => {
    setLoading(true);
    return signInWithPopup(auth, googleProvider);
  };

  const logOut = async () => {
    setLoading(true);
    localStorage.removeItem('access-token');
    try { await axiosPublic.post('/logout'); } catch (e) {}
    return signOut(auth);
  };

  const updateUserProfile = (name, photo) => {
    return updateProfile(auth.currentUser, { displayName: name, photoURL: photo });
  };

  const resetPassword = (email) => sendPasswordResetEmail(auth, email);

  // ✅ Auth State Observer - Token Handling
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      console.log('🔐 Auth:', currentUser?.email || 'No user');
      
      if (currentUser?.email) {
        try {
          const res = await axiosPublic.post('/jwt', { email: currentUser.email });
          
          if (res.data?.success && res.data?.token) {
            localStorage.setItem('access-token', res.data.token);
            console.log('✅ Token saved!');
          }
        } catch (err) {
          console.error('❌ JWT Error:', err);
          localStorage.removeItem('access-token');
        }
        setUser(currentUser);
      } else {
        localStorage.removeItem('access-token');
        setUser(null);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{
      user, loading, createUser, signIn, signInWithGoogle, 
      logOut, updateUserProfile, resetPassword
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;