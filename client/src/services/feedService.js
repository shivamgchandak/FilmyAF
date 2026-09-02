import { api } from './api.js';

export const feedService = {
  popular: (period = 'week') =>
    api.get(`/feed/popular?period=${period}`).then((r) => r.data.data),
  recent: () => api.get('/feed/recent').then((r) => r.data.data),
  mostCloned: () => api.get('/feed/most-cloned').then((r) => r.data.data),
  /** Keyset-paged: pass the previous page's nextCursor to continue. */
  all: ({ cursor, limit = 6 } = {}) =>
    api
      .get('/feed/all', { params: { cursor: cursor || undefined, limit } })
      .then((r) => r.data.data),
};
