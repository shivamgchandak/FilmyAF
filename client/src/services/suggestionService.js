import { api } from './api.js';

export const suggestionService = {
  /** Today's situation chips. Rotates at IST midnight, server-side. */
  daily: () => api.get('/suggestions/daily').then((r) => r.data.data),
};
