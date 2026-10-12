/**
 * Worker API Service
 * Handles API requests for worker discovery, profiles, availability, and onboarding
 */

import api from './api';

export const fetchWorkers = async (params = {}) => {
  return await api.get('/workers', { params });
};

export const fetchWorkerById = async (id) => {
  return await api.get(`/workers/${id}`);
};

export const getMyWorkerProfile = async () => {
  return await api.get('/workers/profile/me');
};

export const updateWorkerProfile = async (profileData) => {
  return await api.post('/workers/profile', profileData);
};

export const updateWorkerAvailability = async (availability) => {
  return await api.patch('/workers/availability', { availability });
};
