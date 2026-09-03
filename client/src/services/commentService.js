import { api } from './api.js';

export const commentService = {
  list: (scriptId) => api.get(`/scripts/${scriptId}/comments`).then((r) => r.data.data),
  /**
   * @param {string} scriptId
   * @param {string} content
   * @param {string | null} [parentId] id of the comment being replied to
   */
  add: (scriptId, content, parentId = null) =>
    api
      .post(`/scripts/${scriptId}/comments`, {
        content,
        // Omitted rather than sent as null: a top-level comment simply has no
        // parent, and the server should not have to special-case a null id.
        ...(parentId ? { parentId } : {}),
      })
      .then((r) => r.data.data),
  remove: (commentId) => api.delete(`/comments/${commentId}`).then((r) => r.data.data),
};
