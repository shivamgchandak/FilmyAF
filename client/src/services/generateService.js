import { api } from './api.js';

export const generateService = {
  generate: (situation, mood, save = false) =>
    api.post('/generate/script', { situation, mood, save }).then((r) => r.data.data),

  regenerateScene: (scriptId, sceneIndex, instruction) =>
    api
      .post('/generate/regenerate-scene', { scriptId, sceneIndex, instruction })
      .then((r) => r.data.data),

  regenerateTitle: (scriptId) =>
    api.post('/generate/regenerate-title', { scriptId }).then((r) => r.data.data),

  regenerateCharacters: (scriptId) =>
    api.post('/generate/regenerate-characters', { scriptId }).then((r) => r.data.data),

  editScript: (scriptId, situation, mood) =>
    api
      .post('/generate/edit-script', { scriptId, situation, mood })
      .then((r) => r.data.data),
};
