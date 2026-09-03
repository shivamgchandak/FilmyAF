import mongoose from 'mongoose';

/**
 * One day's worth of situation suggestions for the Generate page.
 *
 * Cached in Mongo rather than in process memory on purpose: the API runs on a
 * platform that can cold-start or run more than one instance, and an in-memory
 * cache there means a fresh LLM call per instance per restart - the chips would
 * disagree between two tabs on the same day. A row keyed by day makes the set
 * genuinely daily, shared by every visitor, at one LLM call per day.
 *
 * `dateKey` is a YYYY-MM-DD string in IST, not a Date: the audience is Indian,
 * so the set should turn over at midnight in Mumbai rather than at UTC midnight
 * (which is 5:30am there). Its unique index is also the concurrency guard -
 * see suggestions.service.js.
 */
const dailyPromptSchema = new mongoose.Schema(
  {
    dateKey: { type: String, required: true, unique: true, index: true },
    suggestions: {
      type: [String],
      required: true,
      validate: [(v) => v.length > 0, 'A day needs at least one suggestion'],
    },
    model: { type: String },
    // Kept for a month: long enough to tell the model what it already used,
    // short enough that the collection never needs tending.
    createdAt: { type: Date, default: Date.now, expires: '30d' },
  },
  { timestamps: { createdAt: false, updatedAt: true } }
);

export const DailyPrompt = mongoose.model('DailyPrompt', dailyPromptSchema);
