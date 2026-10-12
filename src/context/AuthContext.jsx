/**
 * Authentication Context & Provider
 * Manages global authentication state, token persistence, and session verification
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, getCurrentUser, logoutUser } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('hunarmand_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem('hunarmand_token') || null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize and verify session on initial mount
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem('hunarmand_token');
      if (storedToken) {
        try {
          const res = await getCurrentUser();
          if (res?.user) {
            setUser(res.user);
            localStorage.setItem('hunarmand_user', JSON.stringify(res.user));
          }
        } catch (err) {
          console.warn('Session expired or invalid, clearing local auth state.');
          logout();
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  const login = async (email, password) => {
    setAuthError(null);
    try {
      const res = await loginUser({ email, password });
      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('hunarmand_token', res.token);
        localStorage.setItem('hunarmand_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Login failed');
    } catch (err) {
      const message = err.message || 'Login failed. Please check your credentials.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  const register = async (userData) => {
    setAuthError(null);
    try {
      const res = await registerUser(userData);
      if (res?.token && res?.user) {
        setToken(res.token);
        setUser(res.user);
        localStorage.setItem('hunarmand_token', res.token);
        localStorage.setItem('hunarmand_user', JSON.stringify(res.user));
        return { success: true, user: res.user };
      }
      throw new Error(res?.message || 'Registration failed');
    } catch (err) {
      const message = err.message || 'Registration failed. Please check form details.';
      setAuthError(message);
      return { success: false, message };
    }
  };

  const logout = async () => {
    await logoutUser();
    setUser(null);
    setToken(null);
    setAuthError(null);
    localStorage.removeItem('hunarmand_token');
    localStorage.removeItem('hunarmand_user');
  };

  const value = {
    user,
    token,
    loading,
    authError,
    isAuthenticated: !!user,
    role: user?.role || null,
    isCustomer: user?.role === 'customer',
    isWorker: user?.role === 'worker',
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    clearError: () => setAuthError(null),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
