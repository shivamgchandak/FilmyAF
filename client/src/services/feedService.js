import { api } from './api.js';

export const feedService = {
  popular: (period = 'week') =>
    api.get(`/feed/popular?period=${period}`).then((r) => r.data.data),
  recent: () => api.get('/feed/recent').then((r) => r.data.data),
  mostCloned: () => api.get('/feed/most-cloned').then((r) => r.data.data),
};
