/**
 * Admin Service
 * Handles platform overview metrics, user moderation, worker verification,
 * category management, and complaints triage
 */

import api from './api';

export const fetchAdminStats = async () => {
  return await api.get('/admin/stats');
};

export const fetchAllUsers = async (params = {}) => {
  return await api.get('/admin/users', { params });
};

export const toggleUserStatus = async (userId, isActive) => {
  return await api.patch(`/admin/users/${userId}/status`, { isActive });
};

export const fetchAdminWorkers = async (params = {}) => {
  return await api.get('/admin/workers', { params });
};

export const verifyWorkerStatus = async (workerId, verificationStatus, reason) => {
  return await api.patch(`/admin/workers/${workerId}/verify`, {
    verificationStatus,
    reason,
  });
};

export const fetchAllRequests = async (params = {}) => {
  return await api.get('/admin/requests', { params });
};

export const fetchAllReports = async (params = {}) => {
  return await api.get('/admin/reports', { params });
};

export const updateReportStatus = async (reportId, status, adminNotes) => {
  return await api.patch(`/admin/reports/${reportId}/status`, {
    status,
    adminNotes,
  });
};

export const createAdminCategory = async (categoryData) => {
  return await api.post('/admin/categories', categoryData);
};

export const updateAdminCategory = async (categoryId, categoryData) => {
  return await api.patch(`/admin/categories/${categoryId}`, categoryData);
};

export const deleteAdminCategory = async (categoryId) => {
  return await api.delete(`/admin/categories/${categoryId}`);
};

export default {
  fetchAdminStats,
  fetchAllUsers,
  toggleUserStatus,
  fetchAdminWorkers,
  verifyWorkerStatus,
  fetchAllRequests,
  fetchAllReports,
  updateReportStatus,
  createAdminCategory,
  updateAdminCategory,
  deleteAdminCategory,
};
