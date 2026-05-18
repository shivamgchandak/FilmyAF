import { asyncHandler } from '../utils/asyncHandler.js';
import { Comment } from '../models/Comment.js';
import { findByIdOrFail } from '../services/scripts.service.js';
import { ApiError } from '../utils/ApiError.js';

export const listComments = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  const comments = await Comment.find({ scriptId: script._id })
    .sort({ createdAt: -1 })
    .populate('userId', 'firstName lastName username avatarEmoji');
  res.json({ success: true, data: { comments } });
});

export const addComment = asyncHandler(async (req, res) => {
  const script = await findByIdOrFail(req.params.id);
  const { content, parentId } = req.body;
  const comment = await Comment.create({
    scriptId: script._id,
    userId: req.user._id,
    content,
    parentId: parentId || null,
  });
  await comment.populate('userId', 'firstName lastName username avatarEmoji');
  res.status(201).json({ success: true, data: { comment } });
});

export const deleteComment = asyncHandler(async (req, res) => {
  const comment = await Comment.findById(req.params.id);
  if (!comment) throw ApiError.notFound('Comment not found');
  if (!comment.userId.equals(req.user._id)) {
    throw ApiError.forbidden('Not your comment');
  }
  await Comment.findOneAndDelete({ _id: comment._id });
  res.json({ success: true, data: { deleted: true } });
});
