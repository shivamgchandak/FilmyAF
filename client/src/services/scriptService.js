import { api } from './api.js';

export const scriptService = {
  bySlug: (slug) => api.get(`/scripts/share/${slug}`).then((r) => r.data.data),
  byId: (id) => api.get(`/scripts/${id}`).then((r) => r.data.data),
  save: (payload) => api.post('/scripts', payload).then((r) => r.data.data),
  update: (id, payload) => api.patch(`/scripts/${id}`, payload).then((r) => r.data.data),
  remove: (id) => api.delete(`/scripts/${id}`).then((r) => r.data.data),
  clone: (id, { situation, mood } = {}) =>
    api.post(`/scripts/${id}/clone`, { situation, mood }).then((r) => r.data.data),
  myHistory: () => api.get('/scripts/my/history').then((r) => r.data.data),
  byUsername: (username) => api.get(`/scripts/user/${username}`).then((r) => r.data.data),
};
