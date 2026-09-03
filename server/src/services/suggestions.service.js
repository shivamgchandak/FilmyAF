import { DailyPrompt } from '../models/DailyPrompt.js';
import { callLLM, parseJSON } from './llm/client.js';
import { suggestionsPrompt } from './llm/prompts.js';
import { env } from '../config/env.js';

const COUNT = 5;
const MIN_ACCEPTABLE = 3;
const AVOID_DAYS = 7;

/**
 * The set that ships with the app. Used on the very first request of a day
 * only if the model is unreachable - the page must never render an empty
 * "Or try one of these", because a user who has no idea what to type is
 * exactly who those chips exist for.
 */
export const FALLBACK_SUGGESTIONS = [
  'Fight between two founders over putting sugar in coffee',
  'Mom finds out son ordered Maggi instead of eating dal',
  "Office IT guy refuses to reset everyone's password",
  'Two roommates argue about whose turn it is to do dishes',
  'Guy forgets his anniversary and has to come up with an excuse',
];

/** YYYY-MM-DD in IST. en-CA is the locale that formats that way natively. */
export const dayKeyIST = (d = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(d);

/** Seconds until the next IST midnight - the exact life left in today's set. */
export const secondsUntilNextISTDay = (d = new Date()) => {
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Asia/Kolkata',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .format(d)
    .split(':')
    .map(Number);
  const [h, m, s] = parts;
  return 86400 - (h * 3600 + m * 60 + s);
};

/**
 * Model output is untrusted shape AND untrusted content: a reasoning model
 * asked for five lines will occasionally return four, or one 300-character
 * paragraph, or the same idea twice in different words. Everything that
 * survives this is safe to put in a button.
 */
export const sanitizeSuggestions = (raw) => {
  const list = Array.isArray(raw?.suggestions) ? raw.suggestions : [];
  const seen = new Set();
  const out = [];

  for (const item of list) {
    if (typeof item !== 'string') continue;
    const text = item
      .trim()
      .replace(/^["'\s\-–—*\d.)]+/, '')
      .replace(/[."'\s]+$/, '')
      .replace(/\s+/g, ' ');

    if (text.length < 15 || text.length > 120) continue;

    const key = text.toLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(text);
    if (out.length === COUNT) break;
  }
  return out;
};

const recentlyUsed = async () => {
  const rows = await DailyPrompt.find({})
    .sort({ dateKey: -1 })
    .limit(AVOID_DAYS)
    .select('suggestions -_id')
    .lean();
  return rows.flatMap((r) => r.suggestions);
};

/**
 * Today's five, generated once and then served from Mongo for the rest of the
 * IST day.
 *
 * Concurrency: two visitors arriving together both miss the cache and both
 * call the model. The unique index on dateKey settles it - the loser catches
 * E11000 and re-reads the winner's row, so everyone still sees one set. That
 * costs at most one wasted call per day, which is cheaper than a lock.
 */
export const getDailySuggestions = async () => {
  const dateKey = dayKeyIST();

  const cached = await DailyPrompt.findOne({ dateKey }).select('suggestions -_id').lean();
  if (cached?.suggestions?.length) {
    return { suggestions: cached.suggestions, dateKey, source: 'cache' };
  }

  let fresh = [];
  try {
    const { systemPrompt, userPrompt, temperature } = suggestionsPrompt(await recentlyUsed());
    const raw = await callLLM({ systemPrompt, userPrompt, temperature, maxTokens: 700 });
    fresh = sanitizeSuggestions(parseJSON(raw));
  } catch (err) {
    console.warn(`[suggestions] generation failed for ${dateKey}: ${err.message}`);
  }

  // Too few to be worth keeping: serve the built-in set WITHOUT writing a row,
  // so the next request tries the model again instead of freezing a bad day.
  if (fresh.length < MIN_ACCEPTABLE) {
    return { suggestions: FALLBACK_SUGGESTIONS, dateKey, source: 'fallback' };
  }

  try {
    await DailyPrompt.create({ dateKey, suggestions: fresh, model: env.GROQ_MODEL });
    return { suggestions: fresh, dateKey, source: 'generated' };
  } catch (err) {
    if (err?.code === 11000) {
      const winner = await DailyPrompt.findOne({ dateKey }).select('suggestions -_id').lean();
      if (winner?.suggestions?.length) {
        return { suggestions: winner.suggestions, dateKey, source: 'cache' };
      }
    }
    // Persisting failed but the set is good - serve it, just don't claim it's cached.
    return { suggestions: fresh, dateKey, source: 'generated' };
  }
};
