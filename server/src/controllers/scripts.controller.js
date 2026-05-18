import { asyncHandler } from '../utils/asyncHandler.js';
import { Script } from '../models/Script.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  findByIdOrFail,
  findBySlugOrFail,
  assertOwner,
  cloneScript,
} from '../services/scripts.service.js';

const authorPopulate = [
  { path: 'userId', select: 'firstName lastName username avatarEmoji' },
  { path: 'originalAuthor', select: 'firstName lastName username avatarEmoji' },
];

export const getBySlug = asyncHandler(async (req, res) => {
  const script = await findBySlugOrFail(req.params.slug);
  if (!script.isPublic && (!req.user || !script.userId?.equals(req.user._id))) {
    throw ApiError.forbidden('This script is private');
  }
  // Throttle view-count inflation: only count if no fresh view from same IP this session
  // (simple in-memory throttle would need a cache; for now we just increment)
  script.viewCount += 1;
  await script.save();

  await script.populate(authorPopulate);
  res.json({ success: true, data: { script } });
});

export const getById = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  if (!script.isPublic && (!req.user || !script.userId?.equals(req.user._id))) {
    throw ApiError.forbidden('This script is private');
  }
  await script.populate(authorPopulate);
  res.json({ success: true, data: { script } });
});

export const createOne = asyncHandler(async (req, res) => {
  const { title, tagline, situation, mood, characters, scenes, isPublic = true } = req.body;
  const doc = await Script.create({
    userId: req.user._id,
    title,
    tagline,
    situation,
    mood,
    characters,
    scenes,
    isPublic,
  });
  res.status(201).json({ success: true, data: { script: doc } });
});

export const updateOne = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  assertOwner(script, req.user._id);
  const allowed = ['title', 'tagline', 'isPublic'];
  for (const k of allowed) {
    if (k in req.body) script[k] = req.body[k];
  }
  await script.save();
  res.json({ success: true, data: { script } });
});

export const deleteOne = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  assertOwner(script, req.user._id);
  await script.deleteOne();
  res.json({ success: true, data: { deleted: true } });
});

/**
 * POST /api/scripts/:id/clone
 * Body (all optional): { situation, mood }
 *   - if provided + different from original → re-runs LLM pipeline
 *   - else → plain copy
 */
export const cloneOne = asyncHandler(async (req, res) => {
  const original = await findByIdOrFail(req.params.id);
  if (!original.isPublic) throw ApiError.forbidden('Cannot clone a private script');
  const { situation, mood } = req.body || {};
  const clone = await cloneScript(original, req.user._id, { situation, mood });
  res.status(201).json({ success: true, data: { script: clone } });
});

export const myHistory = asyncHandler(async (req, res) => {
  const scripts = await Script.find({ userId: req.user._id })
    .sort({ createdAt: -1 })
    .limit(100)
    .select('-scenes.dialogue'); // lighter payload
  res.json({ success: true, data: { scripts } });
});

export const byUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) throw ApiError.notFound('User not found');
  const scripts = await Script.find({ userId: user._id, isPublic: true })
    .sort({ createdAt: -1 })
    .limit(50);
  res.json({ success: true, data: { user, scripts } });
});
