import { api } from './api.js';

export const commentService = {
  list: (scriptId) => api.get(`/scripts/${scriptId}/comments`).then((r) => r.data.data),
  add: (scriptId, content, parentId = null) =>
    api.post(`/scripts/${scriptId}/comments`, { content, parentId }).then((r) => r.data.data),
  remove: (commentId) => api.delete(`/comments/${commentId}`).then((r) => r.data.data),
};
