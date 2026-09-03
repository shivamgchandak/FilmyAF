import crypto from 'node:crypto';
import { AnonSession } from '../models/AnonSession.js';
import { env } from '../config/env.js';

export const ANON_COOKIE = 'filmyaf_anon';
const ONE_YEAR = 365 * 24 * 60 * 60 * 1000;

/**
 * Gives every signed-out visitor a durable identity so their 5 free takes
 * follow the device rather than the tab.
 *
 * The cookie is signed and httpOnly, so it cannot be read or forged from
 * JavaScript - localStorage would be one console line away from an infinite
 * refill. Clearing cookies still earns a fresh wallet; that is the ceiling on
 * an anonymous limit, and the reason an account is worth having.
 *
 * Skipped entirely when a user is signed in - they pay from their account.
 */
export const anonSession = async (req, res, next) => {
  if (req.user) return next();

  try {
    let anonId = req.signedCookies?.[ANON_COOKIE];

    if (!anonId) {
      anonId = crypto.randomUUID();
      res.cookie(ANON_COOKIE, anonId, {
        httpOnly: true,
        signed: true,
        sameSite: env.NODE_ENV === 'production' ? 'none' : 'lax',
        secure: env.NODE_ENV === 'production',
        maxAge: ONE_YEAR,
        path: '/',
      });
    }

    req.anonId = anonId;

    await AnonSession.findOneAndUpdate(
      { anonId },
      {
        $setOnInsert: { anonId },
        $set: { ip: req.ip, userAgent: req.headers['user-agent']?.slice(0, 200) },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );
  } catch (err) {
    // A wallet we cannot read must not take the whole request down; the
    // debit will fail loudly on its own if it matters.
    console.error('[anonSession]', err.message);
  }

  return next();
};
