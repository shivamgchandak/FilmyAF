import { api } from './api.js';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Reads an SSE body off fetch's stream.
 *
 * EventSource is the obvious tool and the wrong one here: it can only issue a
 * GET, and it cannot attach an Authorization header - this endpoint needs a
 * POST body and the bearer token. So the frames are parsed by hand. Frames are
 * separated by a blank line, and a chunk boundary can land anywhere, so
 * whatever follows the last blank line stays in the buffer for the next read.
 */
export async function readSSE(response, onEvent) {
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });

    let split;
    while ((split = buffer.indexOf('\n\n')) !== -1) {
      const frame = buffer.slice(0, split);
      buffer = buffer.slice(split + 2);

      let event = 'message';
      const dataLines = [];
      for (const line of frame.split('\n')) {
        if (line.startsWith(':')) continue;            // heartbeat comment
        if (line.startsWith('event:')) event = line.slice(6).trim();
        else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
      }
      if (!dataLines.length) continue;

      try {
        onEvent(event, JSON.parse(dataLines.join('\n')));
      } catch {
        /* A frame we cannot parse is not worth killing the run over. */
      }
    }
  }
}

export const generateService = {
  generate: (situation, mood, save = false) =>
    api.post('/generate/script', { situation, mood, save }).then((r) => r.data.data),

  /**
   * Streaming generate. `onStage(stage, payload)` fires as each agent lands
   * (director → casting → screenwriter); resolves with the `done` payload.
   */
  async generateStream({ situation, mood, save = false, onStage }) {
    const token = localStorage.getItem('filmyaf_token');
    const res = await fetch(`${API_BASE}/generate/stream`, {
      method: 'POST',
      credentials: 'include', // the anonymous takes wallet rides on a cookie
      headers: {
        'Content-Type': 'application/json',
        Accept: 'text/event-stream',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({ situation, mood, save }),
    });

    // A pre-flight rejection (out of takes, validation) arrives as ordinary
    // JSON with a real status, because the stream had not opened yet.
    if (!res.ok || !res.body) {
      let payload = null;
      try {
        payload = (await res.json())?.error;
      } catch { /* not JSON - fall through to a generic message */ }
      const err = new Error(payload?.message || `Generation failed (${res.status})`);
      err.code = payload?.code;
      err.details = payload?.details;
      err.status = res.status;
      throw err;
    }

    let result = null;
    let failure = null;

    await readSSE(res, (event, data) => {
      if (event === 'done') result = data;
      else if (event === 'failed') failure = data;
      else onStage?.(event, data);
    });

    if (failure) {
      const err = new Error(failure.message || 'Generation failed');
      err.code = failure.code;
      throw err;
    }
    // Stream ended with neither done nor failed: the connection dropped.
    if (!result) throw new Error('The connection dropped mid-generation. Try again.');

    // Paid endpoints normally broadcast the balance through the axios
    // interceptor; this one bypasses axios, so do it here.
    if (typeof result.takesRemaining === 'number') {
      window.dispatchEvent(new CustomEvent('filmyaf:takes', { detail: result.takesRemaining }));
    }
    return result;
  },

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
