import { asyncHandler } from '../utils/asyncHandler.js';
import { getDailySuggestions, secondsUntilNextISTDay } from '../services/suggestions.service.js';

export const daily = asyncHandler(async (_req, res) => {
  const { suggestions, dateKey, source } = await getDailySuggestions();

  // Let the CDN and the browser hold it until it actually changes. A fallback
  // set is deliberately not cached - the next visitor should get a real try.
  if (source === 'fallback') {
    res.set('Cache-Control', 'no-store');
  } else {
    res.set('Cache-Control', `public, max-age=${secondsUntilNextISTDay()}`);
  }

  res.json({ success: true, data: { suggestions, dateKey } });
});
