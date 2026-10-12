/**
 * Authentication API Service
 * Handles HTTP requests for User registration, login, logout, and profile loading
 */

import api from './api';

export const registerUser = async (userData) => {
  return await api.post('/auth/register', userData);
};

export const loginUser = async (credentials) => {
  return await api.post('/auth/login', credentials);
};

export const getCurrentUser = async () => {
  return await api.get('/auth/me');
};

export const logoutUser = async () => {
  try {
    return await api.post('/auth/logout');
  } catch (error) {
    // Ignore server error on logout and clean local state
    return { success: true };
  }
};
