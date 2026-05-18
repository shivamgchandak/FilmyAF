import mongoose from 'mongoose';
import { generateShareSlug } from '../utils/generateShareSlug.js';

export const MOODS = [
  'romantic',
  'action',
  'comedy',
  'thriller',
  'tragic',
  'masala',
  'mythological',
  '90s-throwback',
];

const dialogueSchema = new mongoose.Schema(
  {
    character: { type: String, required: true, trim: true },
    line: { type: String, required: true, trim: true },
    action: { type: String, default: '', trim: true },
  },
  { _id: false }
);

const sceneSchema = new mongoose.Schema(
  {
    index: { type: Number, required: true },
    heading: { type: String, required: true, trim: true },
    location: { type: String, default: '', trim: true },
    description: { type: String, required: true, trim: true },
    dialogue: { type: [dialogueSchema], default: [] },
  },
  { _id: false }
);

const characterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    role: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    signatureStyle: { type: String, default: '', trim: true },
    emoji: { type: String, default: '🎭' },
  },
  { _id: false }
);

const scriptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    shareSlug: {
      type: String,
      unique: true,
      index: true,
      default: () => generateShareSlug(),
    },
    title: { type: String, required: true, trim: true },
    tagline: { type: String, default: '', trim: true },
    situation: { type: String, required: true, trim: true },
    mood: { type: String, enum: MOODS, default: 'masala' },
    characters: { type: [characterSchema], default: [] },
    scenes: { type: [sceneSchema], default: [] },

    isPublic: { type: Boolean, default: true, index: true },

    clonedFrom: { type: mongoose.Schema.Types.ObjectId, ref: 'Script', default: null, index: true },
    originalAuthor: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },

    cloneCount: { type: Number, default: 0 },
    likeCount: { type: Number, default: 0 },
    commentCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },

    // Set explicitly whenever the owner edits the prompt/mood (full re-gen).
    // Distinct from `updatedAt` which bumps on every viewCount increment.
    lastEditedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

scriptSchema.index({ userId: 1, createdAt: -1 });
scriptSchema.index({ isPublic: 1, likeCount: -1 });
scriptSchema.index({ isPublic: 1, createdAt: -1 });
scriptSchema.index({ isPublic: 1, cloneCount: -1 });

export const Script = mongoose.model('Script', scriptSchema);
