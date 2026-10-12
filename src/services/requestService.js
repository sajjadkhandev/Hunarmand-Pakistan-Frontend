/**
 * Service Request API Service
 * Manages service request submissions, customer & worker dashboard fetching, and status updates
 */

import api from './api';

export const createServiceRequest = async (requestData) => {
  return await api.post('/requests', requestData);
};

export const getMyRequests = async (status) => {
  return await api.get('/requests/my', { params: { status } });
};

export const getRequestById = async (id) => {
  return await api.get(`/requests/${id}`);
};

export const updateRequestStatus = async (id, payload) => {
  return await api.patch(`/requests/${id}/status`, payload);
};
