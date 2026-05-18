import { api } from './api.js';

export const likeService = {
  toggle: (scriptId) => api.post(`/scripts/${scriptId}/like`).then((r) => r.data.data),
  status: (scriptId) => api.get(`/scripts/${scriptId}/likes`).then((r) => r.data.data),
};
