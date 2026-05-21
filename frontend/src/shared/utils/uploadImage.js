import { httpClient } from '../api/httpClient.js';

export async function uploadImage(url, file) {
  const formData = new FormData();
  formData.append('image', file);

  return httpClient(url, { method: 'PUT', body: formData });
}
