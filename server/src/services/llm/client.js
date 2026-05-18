import axios from 'axios';
import { env } from '../../config/env.js';
import { ApiError } from '../../utils/ApiError.js';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Low-level Google Gemini wrapper (direct REST API).
 * - Tries GEMINI_MODEL first, falls back to GEMINI_FALLBACK_MODEL on 5xx/429/timeout.
 * - Uses Gemini's native JSON mode via `responseMimeType: 'application/json'`.
 * - Returns the raw text from the first candidate.
 */
export const callLLM = async ({
  systemPrompt,
  userPrompt,
  temperature = 0.8,
  maxTokens = 2000,
  jsonMode = true,
}) => {
  if (!env.GEMINI_API_KEY) {
    throw ApiError.internal('GEMINI_API_KEY is not configured');
  }

  const body = {
    systemInstruction: {
      parts: [{ text: systemPrompt }],
    },
    contents: [
      {
        role: 'user',
        parts: [{ text: userPrompt }],
      },
    ],
    generationConfig: {
      temperature,
      maxOutputTokens: maxTokens,
      // Disable Gemini 2.5 "thinking" tokens (ignored by 2.0 models).
      // Thinking tokens count against maxOutputTokens but don't appear in
      // the output, so leaving it on can truncate our JSON mid-stream.
      thinkingConfig: { thinkingBudget: 0 },
      ...(jsonMode ? { responseMimeType: 'application/json' } : {}),
    },
    // Bollywood prompts mention "punches", "guns", "blood", etc. Loosen
    // safety filters so the screenwriter doesn't get blocked mid-scene.
    safetySettings: [
      { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_ONLY_HIGH' },
      { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_ONLY_HIGH' },
    ],
  };

  const headers = {
    'Content-Type': 'application/json',
  };

  const attempt = async (model) => {
    const url = `${GEMINI_BASE}/${model}:generateContent?key=${env.GEMINI_API_KEY}`;
    const { data } = await axios.post(url, body, { headers, timeout: 60_000 });
    const candidate = data?.candidates?.[0];
    const parts = candidate?.content?.parts;
    const text = Array.isArray(parts)
      ? parts.map((p) => p.text || '').join('').trim()
      : '';
    if (!text) {
      const reason = candidate?.finishReason || 'no-content';
      throw new Error(`Gemini returned empty content (finishReason=${reason})`);
    }
    return text;
  };

  try {
    return await attempt(env.GEMINI_MODEL);
  } catch (err) {
    const status = err.response?.status;
    const isTransient =
      !status || status >= 500 || status === 429 || err.code === 'ECONNABORTED';
    if (isTransient && env.GEMINI_FALLBACK_MODEL !== env.GEMINI_MODEL) {
      console.warn('[llm] primary Gemini failed, trying fallback:', err.message);
      try {
        return await attempt(env.GEMINI_FALLBACK_MODEL);
      } catch (err2) {
        throw ApiError.internal(
          `Gemini unavailable (primary + fallback failed): ${err2.response?.data?.error?.message || err2.message}`
        );
      }
    }
    const serverMsg = err.response?.data?.error?.message;
    throw ApiError.internal(`Gemini error: ${serverMsg || err.message}`);
  }
};

/**
 * Parses JSON from an LLM response, tolerating markdown code fences
 * (` ```json ... ``` `) some models still emit even in JSON mode.
 */
export const parseJSON = (raw) => {
  if (!raw) throw new Error('Empty LLM response');
  let txt = raw.trim();
  // Strip markdown fences
  if (txt.startsWith('```')) {
    txt = txt.replace(/^```(?:json)?/i, '').replace(/```$/, '').trim();
  }
  // Find first { and last }
  const first = txt.indexOf('{');
  const last = txt.lastIndexOf('}');
  if (first !== -1 && last !== -1 && last > first) {
    txt = txt.slice(first, last + 1);
  }
  return JSON.parse(txt);
};
