import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL,
  timeout: 90_000,
  // The anonymous takes wallet rides on a signed httpOnly cookie, so
  // credentials must be sent even though this is a cross-origin API.
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('filmyaf_token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => {
    // Any paid endpoint reports what's left; broadcast it so the balance in
    // the navbar updates without a second round trip.
    const remaining = res.data?.data?.takesRemaining;
    if (typeof remaining === 'number') {
      window.dispatchEvent(new CustomEvent('filmyaf:takes', { detail: remaining }));
    }
    return res;
  },
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('filmyaf_token');
      window.dispatchEvent(new CustomEvent('filmyaf:unauthorized'));
    }
    const payload = err.response?.data?.error;
    if (payload?.code === 'OUT_OF_TAKES' && typeof payload.details?.balance === 'number') {
      window.dispatchEvent(new CustomEvent('filmyaf:takes', { detail: payload.details.balance }));
    }
    const message =
      payload?.message || err.message || 'Something went wrong';
    const wrapped = new Error(message);
    wrapped.code = payload?.code;
    wrapped.details = payload?.details;
    wrapped.status = err.response?.status;
    return Promise.reject(wrapped);
  }
);
