import { User } from '../models/User.js';
import { AnonSession } from '../models/AnonSession.js';
import { ApiError } from '../utils/ApiError.js';

/** What each action costs, priced by how many LLM calls it really makes. */
export const TAKE_COSTS = {
  generate: 3,      // Director + Casting + Screenwriter
  editScript: 3,    // re-runs the whole pipeline
  recast: 1,        // one call, plus a local rename pass
  rerollScene: 1,   // one call
  rerollTitle: 1,   // one call
};

export const DAILY_GRANT = 10;
export const ANON_GRANT = 5;
/** A new account opens with three days' worth, so the first session has room
 *  to generate, re-roll and recast without immediately hitting the wall. */
export const SIGNUP_GRANT = 30;

/** Calendar day in IST, as YYYY-MM-DD. The audience is Indian; the reset
 *  should happen at their midnight, not UTC's. */
export const istDayKey = (date = new Date()) =>
  new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date);

const daysBetween = (fromKey, toKey) => {
  const a = Date.parse(`${fromKey}T00:00:00Z`);
  const b = Date.parse(`${toKey}T00:00:00Z`);
  if (Number.isNaN(a) || Number.isNaN(b)) return 1;
  return Math.max(0, Math.round((b - a) / 86_400_000));
};

/**
 * Top a user up for every calendar day since their last grant.
 *
 * Takes accumulate and never expire, so a user away for 5 days comes back to
 * 50 more than they left with. Done lazily on read rather than by a cron: the
 * result is identical and there is no scheduler to keep alive.
 */
export const grantDailyTakes = async (user) => {
  const today = istDayKey();
  if (user.takesGrantedOn === today) return user;

  const days = user.takesGrantedOn ? daysBetween(user.takesGrantedOn, today) : 1;
  if (days <= 0) {
    user.takesGrantedOn = today;
    await user.save();
    return user;
  }

  const updated = await User.findByIdAndUpdate(
    user._id,
    { $inc: { takesBalance: DAILY_GRANT * days }, $set: { takesGrantedOn: today } },
    { new: true }
  );
  return updated || user;
};

/** Identify who is paying: a signed-in user, else the anonymous session. */
export const actorFor = (req) => {
  if (req.user) return { type: 'user', id: req.user._id };
  if (req.anonId) return { type: 'anon', id: req.anonId };
  return null;
};

export const balanceFor = async (req) => {
  if (req.user) {
    const user = await grantDailyTakes(req.user);
    return {
      balance: user.takesBalance,
      /** What this actor is granted: per day for an account, once for a device. */
      grant: DAILY_GRANT,
      grantPeriod: 'daily',
      dailyGrant: DAILY_GRANT,
      accumulates: true,
      anonymous: false,
      nextGrantOn: istDayKey(new Date(Date.now() + 86_400_000)),
    };
  }
  if (!req.anonId) {
    return {
      balance: 0, grant: ANON_GRANT, grantPeriod: 'device',
      dailyGrant: 0, accumulates: false, anonymous: true,
    };
  }

  const session = await AnonSession.findOne({ anonId: req.anonId });
  return {
    balance: session?.takesBalance ?? ANON_GRANT,
    grant: ANON_GRANT,
    grantPeriod: 'device',
    dailyGrant: 0,
    accumulates: false,
    anonymous: true,
  };
};

/**
 * Spend takes. The debit is a single conditional update - the document only
 * matches while it still holds enough - so two requests racing can never both
 * succeed on the last take. Returns the balance left.
 */
export const debit = async (req, cost, action = 'that') => {
  const actor = actorFor(req);
  if (!actor) throw ApiError.unauthorized('No session to charge');

  if (actor.type === 'user') {
    await grantDailyTakes(req.user);
    const updated = await User.findOneAndUpdate(
      { _id: actor.id, takesBalance: { $gte: cost } },
      { $inc: { takesBalance: -cost } },
      { new: true }
    );
    if (!updated) {
      const current = await User.findById(actor.id).select('takesBalance');
      throw ApiError.outOfTakes(
        `Not enough takes for ${action}. You have ${current?.takesBalance ?? 0}, this costs ${cost}.`,
        { balance: current?.takesBalance ?? 0, cost, anonymous: false }
      );
    }
    req.user.takesBalance = updated.takesBalance;
    return updated.takesBalance;
  }

  const updated = await AnonSession.findOneAndUpdate(
    { anonId: actor.id, takesBalance: { $gte: cost } },
    { $inc: { takesBalance: -cost, takesSpent: cost } },
    { new: true }
  );
  if (!updated) {
    const current = await AnonSession.findOne({ anonId: actor.id }).select('takesBalance');
    throw ApiError.outOfTakes(
      "That's your free takes spent. Create an account for 10 more every day.",
      { balance: current?.takesBalance ?? 0, cost, anonymous: true }
    );
  }
  return updated.takesBalance;
};

/** Give the takes back when the work did not happen. */
export const refund = async (req, cost) => {
  const actor = actorFor(req);
  if (!actor || !cost) return;
  try {
    if (actor.type === 'user') {
      const updated = await User.findByIdAndUpdate(
        actor.id,
        { $inc: { takesBalance: cost } },
        { new: true }
      );
      if (updated && req.user) req.user.takesBalance = updated.takesBalance;
    } else {
      await AnonSession.findOneAndUpdate(
        { anonId: actor.id },
        { $inc: { takesBalance: cost, takesSpent: -cost } }
      );
    }
  } catch (err) {
    // A failed refund must never mask the original error.
    console.error('[takes] refund failed', err);
  }
};

/**
 * Charge, run, and refund on failure. Every paid endpoint goes through this so
 * nobody is ever billed for a script they did not get.
 */
export const spend = async (req, cost, action, work) => {
  const remaining = await debit(req, cost, action);
  try {
    const result = await work();
    return { result, takesRemaining: remaining };
  } catch (err) {
    await refund(req, cost);
    throw err;
  }
};
