import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 90_000,
});

// Attach JWT from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('filmyaf_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Bubble up a clean error shape
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      // Token expired/invalid — drop it; UI components will see logged-out state
      localStorage.removeItem('filmyaf_token');
      // Soft signal — let the slices/components handle redirect
      window.dispatchEvent(new CustomEvent('filmyaf:unauthorized'));
    }
    const payload = err.response?.data?.error;
    const message =
      payload?.message || err.message || 'Something went wrong';
    const wrapped = new Error(message);
    wrapped.code = payload?.code;
    wrapped.details = payload?.details;
    wrapped.status = err.response?.status;
    return Promise.reject(wrapped);
  }
);
