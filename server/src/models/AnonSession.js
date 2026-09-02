import mongoose from 'mongoose';

/**
 * An anonymous visitor's takes wallet, keyed by a signed httpOnly cookie.
 *
 * Anonymous takes are granted ONCE and never refilled — 5 per device, for
 * the life of that device's cookie. Clearing cookies buys a new wallet, which
 * is the ceiling on how tight an anonymous limit can be without an account;
 * `ip` is stored as a secondary signal for spotting that if it ever matters.
 */
const anonSessionSchema = new mongoose.Schema(
  {
    anonId: { type: String, required: true, unique: true, index: true },
    takesBalance: { type: Number, default: 5, min: 0 },
    takesSpent: { type: Number, default: 0 },
    ip: { type: String },
    userAgent: { type: String },
    claimedByUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  },
  { timestamps: true }
);

export const AnonSession = mongoose.model('AnonSession', anonSessionSchema);
