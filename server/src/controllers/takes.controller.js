import { asyncHandler } from '../utils/asyncHandler.js';
import { balanceFor, TAKE_COSTS } from '../services/takes.service.js';

export const getTakes = asyncHandler(async (req, res) => {
  const takes = await balanceFor(req);
  res.json({ success: true, data: { takes, costs: TAKE_COSTS } });
});
