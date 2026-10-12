/**
 * Review API Service
 * Handles customer review submissions, worker reviews retrieval, and ratings
 */

import api from './api';

export const createReview = async (reviewData) => {
  return await api.post('/reviews', reviewData);
};

export const fetchWorkerReviews = async (workerId) => {
  return await api.get(`/reviews/worker/${workerId}`);
};

export const fetchMyReviews = async () => {
  return await api.get('/reviews/my');
};

export const deleteReview = async (reviewId) => {
  return await api.delete(`/reviews/${reviewId}`);
};

export default {
  createReview,
  fetchWorkerReviews,
  fetchMyReviews,
  deleteReview,
};
