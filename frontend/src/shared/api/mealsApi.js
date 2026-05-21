import { httpClient } from './httpClient.js';
import { uploadImage } from '../utils/uploadImage.js';
import { normalizeId } from '../utils/normalizeId.js';

export const fetchMeals = async () => {
  const data = await httpClient.get('/api/meals');
  return data.map(normalizeId);
};

export const getMealsAdmin = async () => {
  const data = await httpClient.get('/api/admin/meals');
  return data.map(normalizeId);
};

export const createMealAdmin = async (mealData) => {
  const data = await httpClient.post('/api/admin/meals', mealData);
  return normalizeId(data);
};

export const updateMealAdmin = async (id, mealData) => {
  const data = await httpClient.put(`/api/admin/meals/${id}`, mealData);
  return normalizeId(data);
};

export const deleteMealAdmin = (id) =>
  httpClient.delete(`/api/admin/meals/${id}`);

export const uploadMealImage = async (id, file) => {
  if (!file) return null;
  const data = await uploadImage(`/api/admin/meals/${id}/image`, file);
  return normalizeId(data);
};
