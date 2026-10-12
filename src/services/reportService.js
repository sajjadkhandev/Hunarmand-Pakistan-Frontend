/**
 * Report Service
 * Trust & Safety dispute filing and resolution
 */

import api from './api';

export const createReport = async (reportData) => {
  return await api.post('/reports', reportData);
};

export const fetchMyReports = async () => {
  return await api.get('/reports/my');
};

export default {
  createReport,
  fetchMyReports,
};
