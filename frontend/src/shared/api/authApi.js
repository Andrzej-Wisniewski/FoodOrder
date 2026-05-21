import { httpClient } from './httpClient.js';
import { normalizeId } from '../utils/normalizeId.js';

const normalizeAuthResponse = (data) => {
  if (!data) return data;
  return {
    token: data.token,
    user: data.user ? normalizeId(data.user) : data.user,
  };
};

export const loginUser = async (credentials) => {
  const data = await httpClient.post('/api/auth/login', credentials);
  return normalizeAuthResponse(data);
};

export const registerUser = async (data) => {
  const res = await httpClient.post('/api/auth/register', data);
  return normalizeAuthResponse(res);
};

export const fetchCurrentUser = async () => {
  const data = await httpClient.get('/api/auth/current');
  return normalizeAuthResponse(data);
};
