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
    { $match: { isPublic: true, createdAt: { $gte: since } } },
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
  const scripts = await Script.find({ isPublic: true })
    .sort({ createdAt: -1 })
    .limit(FEED_LIMIT)
    .select(baseProjection)
    .populate(populateAuthor);
  res.json({ success: true, data: { scripts } });
});

export const mostCloned = asyncHandler(async (_req, res) => {
  const scripts = await Script.find({ isPublic: true, cloneCount: { $gt: 0 } })
    .sort({ cloneCount: -1, createdAt: -1 })
    .limit(FEED_LIMIT)
    .select(baseProjection)
    .populate(populateAuthor);
  res.json({ success: true, data: { scripts } });
});
