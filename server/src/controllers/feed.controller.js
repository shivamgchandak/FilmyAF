import { asyncHandler } from '../utils/asyncHandler.js';
import { Script } from '../models/Script.js';

const FEED_LIMIT = 6;

const baseProjection =
  '-scenes.dialogue -__v'; 

const populateAuthor = {
  path: 'userId',
  select: 'firstName lastName username avatarEmoji',
};

export const popular = asyncHandler(async (req, res) => {
  const period = req.query.period || 'week';
  const days = period === 'day' ? 1 : period === 'month' ? 30 : 7;
  const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);

  const scripts = await Script.aggregate([
    {
      $match: {
        isPublic: true,
        userId: { $ne: null }, // only scripts owned by registered users
        createdAt: { $gte: since },
      },
    },
    {
      $addFields: {
        trendScore: {
          $add: [
            { $ifNull: ['$commentCount', 0] },
            { $ifNull: ['$likeCount', 0] },
            { $divide: [{ $ifNull: ['$viewCount', 0] }, 10] },
          ],
        },
      },
    },
    { $sort: { trendScore: -1, createdAt: -1 } },
    { $limit: FEED_LIMIT },
    { $project: { 'scenes.dialogue': 0, __v: 0 } },
  ]);

  await Script.populate(scripts, populateAuthor);

  res.json({ success: true, data: { scripts, period } });
});

export const recent = asyncHandler(async (_req, res) => {
  const scripts = await Script.find({ isPublic: true, userId: { $ne: null } })
    .sort({ createdAt: -1 })
    .limit(FEED_LIMIT)
    .select(baseProjection)
    .populate(populateAuthor);
  res.json({ success: true, data: { scripts } });
});

export const mostCloned = asyncHandler(async (_req, res) => {
  const scripts = await Script.find({
    isPublic: true,
    userId: { $ne: null },
    cloneCount: { $gt: 0 },
  })
    .sort({ cloneCount: -1, createdAt: -1 })
    .limit(FEED_LIMIT)
    .select(baseProjection)
    .populate(populateAuthor);
  res.json({ success: true, data: { scripts } });
});

/* ── All scripts ───────────────────────────────────────────────
   Everything public, newest first, paged with a keyset cursor rather than
   skip/limit: skip re-scans from the top on every page and shifts rows when
   something new is written mid-scroll, which duplicates cards. Sorting on
   (createdAt, _id) makes the cursor exact and stable. */

const encodeCursor = (doc) =>
  Buffer.from(`${new Date(doc.createdAt).toISOString()}|${doc._id}`).toString('base64url');

const decodeCursor = (raw) => {
  try {
    const [iso, id] = Buffer.from(raw, 'base64url').toString('utf8').split('|');
    const date = new Date(iso);
    if (Number.isNaN(date.getTime()) || !id) return null;
    return { date, id };
  } catch {
    return null;
  }
};

export const allScripts = asyncHandler(async (req, res) => {
  const limit = Math.min(parseInt(req.query.limit, 10) || FEED_LIMIT, 24);
  const cursor = req.query.cursor ? decodeCursor(req.query.cursor) : null;

  const filter = { isPublic: true, userId: { $ne: null } };
  if (cursor) {
    filter.$or = [
      { createdAt: { $lt: cursor.date } },
      { createdAt: cursor.date, _id: { $lt: cursor.id } },
    ];
  }

  // Ask for one extra to learn whether another page exists, without a count().
  const rows = await Script.find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .limit(limit + 1)
    .select(baseProjection)
    .populate(populateAuthor);

  const hasMore = rows.length > limit;
  const scripts = hasMore ? rows.slice(0, limit) : rows;

  res.json({
    success: true,
    data: {
      scripts,
      nextCursor: hasMore && scripts.length ? encodeCursor(scripts[scripts.length - 1]) : null,
      hasMore,
    },
  });
});
