/**
 * Axios API Client Instance
 * Configured with baseURL, request/response interceptors, and error handling
 */

import axios from 'axios';

const defaultBaseURL =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.PROD
    ? 'https://hunarmand-pakistan-backend.onrender.com/api'
    : 'http://localhost:5000/api');

const api = axios.create({
  baseURL: defaultBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
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
    let message =
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred while communicating with the server.';

    if (error.code === 'ECONNABORTED' || error.message?.toLowerCase().includes('timeout')) {
      message =
        'Server response timeout: Backend server se rabta nahi ho saka. Agar aapka backend Render par so raha hai to thori dair mein khud ba khud active ho jayega, baraye meharbani dobara koshish karein.';
    } else if (error.message?.includes('Network Error')) {
      message =
        'Network Error: Backend server reach nahi ho raha. Check karein ke live backend active hai.';
    }

    const customError = {
      message,
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
