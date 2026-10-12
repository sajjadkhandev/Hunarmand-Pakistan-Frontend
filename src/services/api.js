/**
 * Axios API Client Instance
 * Configured with baseURL, request/response interceptors, and error handling
 */

import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Request Interceptor: Attach JWT Token if available
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('hunarmand_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Format error messages
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    const customError = {
      message:
        error.response?.data?.message ||
        error.message ||
        'An unexpected error occurred while communicating with the server.',
      status: error.response?.status || null,
      data: error.response?.data || null,
    };
    return Promise.reject(customError);
  }
);

// Health check API call
export const getBackendHealth = async () => {
  return await api.get('/health');
};

export default api;
