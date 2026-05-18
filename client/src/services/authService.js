import { api } from './api.js';

export const authService = {
  signup: (payload) => api.post('/auth/signup', payload).then((r) => r.data.data),
  login: (payload) => api.post('/auth/login', payload).then((r) => r.data.data),
  me: () => api.get('/auth/me').then((r) => r.data.data),
};
