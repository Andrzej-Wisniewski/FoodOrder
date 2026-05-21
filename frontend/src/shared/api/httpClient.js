import { STORAGE_KEYS } from '../const/index';

function getAuthHeaders() {
  const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
  return token ? { Authorization: `Bearer ${token}` } : {};
}

function serializeBody(body) {
  if (body === undefined || body === null) return undefined;
  if (body instanceof FormData) return body;
  if (typeof body === 'string') return body;
  return JSON.stringify(body);
}

export async function request(url, options = {}) {
  const body = serializeBody(options.body);
  const isFormData = body instanceof FormData;

  const res = await fetch(url, {
    ...options,
    body,
    headers: {
      ...(isFormData || body === undefined
        ? {}
        : { 'Content-Type': 'application/json' }),
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  let json;
  try {
    json = await res.json();
  } catch {
    throw new Error(
      res.ok ? 'Nieprawidłowa odpowiedź serwera.' : 'Wystąpił błąd.',
    );
  }

  if (!res.ok) {
    if (res.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
      localStorage.removeItem(STORAGE_KEYS.USER);
      window.location.reload();
      throw new Error('Token wygasł, zaloguj się ponownie.');
    }

    const error = new Error(json.message || 'Wystąpił błąd');
    error.status = res.status;
    error.errors = json.errors;
    throw error;
  }

  return json.data !== undefined ? json.data : json;
}

export const httpClient = Object.assign(request, {
  get: (url, options = {}) => request(url, { ...options, method: 'GET' }),
  post: (url, body, options = {}) =>
    request(url, { ...options, method: 'POST', body }),
  put: (url, body, options = {}) =>
    request(url, { ...options, method: 'PUT', body }),
  delete: (url, options = {}) => request(url, { ...options, method: 'DELETE' }),
});

export const AUTH_TOKEN_KEY = STORAGE_KEYS.AUTH_TOKEN;
