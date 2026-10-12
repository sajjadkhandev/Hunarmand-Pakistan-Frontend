/**
 * Category API Service
 * Fetches available skilled service categories from backend
 */

import api from './api';

export const fetchCategories = async () => {
  return await api.get('/categories');
};

export const fetchCategoryBySlug = async (slug) => {
  return await api.get(`/categories/${slug}`);
};
