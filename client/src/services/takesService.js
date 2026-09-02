import { api } from './api.js';

export const takesService = {
  get: () => api.get('/takes').then((r) => r.data.data),
};
