import { asyncHandler } from '../utils/asyncHandler.js';
import { Like } from '../models/Like.js';
import { findByIdOrFail } from '../services/scripts.service.js';

export const toggleLike = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  const existing = await Like.findOne({ userId: req.user._id, scriptId: script._id });
  if (existing) {
    await Like.findOneAndDelete({ _id: existing._id });
    const fresh = await findByIdOrFail(script._id);
    return res.json({ success: true, data: { liked: false, likeCount: fresh.likeCount } });
  }
  await Like.create({ userId: req.user._id, scriptId: script._id });
  const fresh = await findByIdOrFail(script._id);
  res.json({ success: true, data: { liked: true, likeCount: fresh.likeCount } });
});

export const getLikes = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  let hasLiked = false;
  if (req.user) {
    hasLiked = !!(await Like.exists({ userId: req.user._id, scriptId: script._id }));
  }
  res.json({ success: true, data: { likeCount: script.likeCount, hasLiked } });
});
