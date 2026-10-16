import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import { auth, googleProvider } from '../config/firebase';
import {
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
} from 'firebase/auth';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'USER' | 'TRAINER' | 'ADMIN';
  status: 'ACTIVE' | 'BLOCKED' | 'SUSPENDED';
  firebaseUid?: string;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  firebaseUser: FirebaseUser | null;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, pass: string) => Promise<{ success: boolean; error?: string }>;
  loginWithGoogle: () => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('fitmeister_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('fitmeister_token') || null;
  });

  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Sync Firebase authentication state
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        const storedToken = localStorage.getItem('fitmeister_token');
        if (!storedToken) {
          try {
            const res = await api.post('/auth/firebase', {
              email: fbUser.email,
              name: fbUser.displayName || fbUser.email?.split('@')[0],
              firebaseUid: fbUser.uid,
            });
            if (res.data?.success) {
              const { token: receivedToken, user: receivedUser } = res.data.data;
              setToken(receivedToken);
              setUser(receivedUser);
              localStorage.setItem('fitmeister_token', receivedToken);
              localStorage.setItem('fitmeister_user', JSON.stringify(receivedUser));
            }
          } catch (err: any) {
            console.error('Firebase session backend sync error:', err.response?.data?.error || err.message);
          }
        }
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // Validate existing backend session on initial load
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = localStorage.getItem('fitmeister_token');
      if (storedToken) {
        try {
          const res = await api.get('/auth/me');
          if (res.data?.success) {
            setUser(res.data.data);
            localStorage.setItem('fitmeister_user', JSON.stringify(res.data.data));
          }
        } catch (err: any) {
          if (err.response?.status === 401 || err.response?.status === 403) {
            console.warn('Session expired or invalidated; resetting authentication state.');
            localStorage.removeItem('fitmeister_token');
            localStorage.removeItem('fitmeister_user');
            setUser(null);
            setToken(null);
          }
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  const syncBackendFirebase = async (email: string, name: string | null, uid: string) => {
    try {
      const res = await api.post('/auth/firebase', {
        email,
        name: name || email.split('@')[0],
        firebaseUid: uid,
      });
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('fitmeister_token', receivedToken);
        localStorage.setItem('fitmeister_user', JSON.stringify(receivedUser));
        return { success: true };
      }
      return {
        success: false,
        error: res.data?.error?.message || 'Failed to authenticate with backend',
      };
    } catch (err: any) {
      return {
        success: false,
        error: err.response?.data?.error?.message || 'Authentication service error. Please try again.',
      };
    }
  };

  const login = async (email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();

    try {
      const res = await api.post('/auth/login', { email: normalizedEmail, password: pass });
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('fitmeister_token', receivedToken);
        localStorage.setItem('fitmeister_user', JSON.stringify(receivedUser));
        return { success: true };
      }
      return { success: false, error: 'Authentication failed. Please verify credentials.' };
    } catch (backendErr: any) {
      return {
        success: false,
        error: backendErr.response?.data?.error?.message || 'Invalid email or password. Please check your credentials.',
      };
    }
  };

  const register = async (name: string, email: string, pass: string) => {
    const normalizedEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    try {
      const res = await api.post('/auth/register', { name: cleanName, email: normalizedEmail, password: pass });
      if (res.data?.success) {
        const { token: receivedToken, user: receivedUser } = res.data.data;
        setToken(receivedToken);
        setUser(receivedUser);
        localStorage.setItem('fitmeister_token', receivedToken);
        localStorage.setItem('fitmeister_user', JSON.stringify(receivedUser));
        return { success: true };
      }
      return { success: false, error: 'Registration failed. Please check inputs.' };
    } catch (backendErr: any) {
      const errMsg =
        backendErr.response?.data?.error?.message ||
        (backendErr.response?.data?.error?.fieldErrors
          ? Object.values(backendErr.response.data.error.fieldErrors).flat().join(', ')
          : 'Registration failed. Please try again.');
      return { success: false, error: errMsg };
    }
  };

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user && result.user.email) {
        return await syncBackendFirebase(
          result.user.email,
          result.user.displayName,
          result.user.uid
        );
      }
      return { success: false, error: 'Google sign-in was cancelled' };
    } catch (err: any) {
      console.error('Google auth exception:', err);
      if (err.code === 'auth/unauthorized-domain') {
        return {
          success: false,
          error: 'Current domain is not authorized in Firebase Console. Please add it under Firebase Console > Authentication > Settings > Authorized Domains.',
        };
      }
      if (err.code === 'auth/popup-blocked') {
        return {
          success: false,
          error: 'Sign-in popup was blocked by browser. Please enable popups.',
        };
      }
      return {
        success: false,
        error: err.message || 'Google authentication failed',
      };
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (e) {
      console.warn('Firebase signout exception:', e);
    }
    localStorage.removeItem('fitmeister_token');
    localStorage.removeItem('fitmeister_user');
    setUser(null);
    setToken(null);
    setFirebaseUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        firebaseUser,
        isLoading,
        login,
        register,
        loginWithGoogle,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
