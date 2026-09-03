import { asyncHandler } from '../utils/asyncHandler.js';
import { Script } from '../models/Script.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';
import {
  findByIdOrFail,
  findBySlugOrFail,
  assertOwner,
  cloneScript,
  TREND_SCORE_STAGE,
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

const TOP_N = 3;

/**
 * A public profile: totals, the moods this writer actually reaches for, and
 * their three best-performing scripts.
 *
 * Totals come from an aggregate rather than from summing the returned list -
 * the old version summed a list capped at 50, so a writer with 60 scripts had
 * their likes quietly under-reported on their own profile.
 */
export const byUsername = asyncHandler(async (req, res) => {
  const user = await User.findOne({ username: req.params.username });
  if (!user) throw ApiError.notFound('User not found');

  const match = { userId: user._id, isPublic: true };

  const [totals, topMoods, topScripts] = await Promise.all([
    Script.aggregate([
      { $match: match },
      {
        $group: {
          _id: null,
          scripts: { $sum: 1 },
          likes: { $sum: { $ifNull: ['$likeCount', 0] } },
          clones: { $sum: { $ifNull: ['$cloneCount', 0] } },
        },
      },
    ]),

    // Ties break on mood name so the chips don't reshuffle between requests.
    Script.aggregate([
      { $match: { ...match, mood: { $nin: [null, ''] } } },
      { $group: { _id: '$mood', count: { $sum: 1 } } },
      { $sort: { count: -1, _id: 1 } },
      { $limit: TOP_N },
      { $project: { _id: 0, mood: '$_id', count: 1 } },
    ]),

    // Same ranking as the Trending feed - see TREND_SCORE_STAGE - but
    // all-time rather than windowed: a profile is a body of work, not a week.
    Script.aggregate([
      { $match: match },
      TREND_SCORE_STAGE,
      { $sort: { trendScore: -1, createdAt: -1 } },
      { $limit: TOP_N },
      { $project: { 'scenes.dialogue': 0, __v: 0 } },
    ]),
  ]);

  await Script.populate(topScripts, {
    path: 'userId',
    select: 'firstName lastName username avatarEmoji',
  });

  res.json({
    success: true,
    data: {
      user,
      stats: totals[0]
        ? { scripts: totals[0].scripts, likes: totals[0].likes, clones: totals[0].clones }
        : { scripts: 0, likes: 0, clones: 0 },
      topMoods,
      topScripts,
    },
  });
});
