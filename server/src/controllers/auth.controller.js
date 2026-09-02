import { asyncHandler } from '../utils/asyncHandler.js';
import * as authService from '../services/auth.service.js';
import { grantDailyTakes, TAKE_COSTS, DAILY_GRANT } from '../services/takes.service.js';

export const signup = asyncHandler(async (req, res) => {
  const { firstName, lastName, username, email, password } = req.body;
  const { user, token } = await authService.signup({
    firstName,
    lastName,
    username,
    email,
    password,
  });
  res.status(201).json({ success: true, data: { user, token } });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const { user, token } = await authService.login({ email, password });
  res.json({ success: true, data: { user, token } });
});

export const me = asyncHandler(async (req, res) => {
  // Reading your own account is when the daily top-up lands.
  const user = await grantDailyTakes(req.user);
  res.json({
    success: true,
    data: { user, costs: TAKE_COSTS, dailyGrant: DAILY_GRANT },
  });
});
