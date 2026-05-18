import mongoose from 'mongoose';
import { Script } from './Script.js';

const commentSchema = new mongoose.Schema(
  {
    scriptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Script', required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true, maxlength: 500, trim: true },
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', default: null },
  },
  { timestamps: true }
);

commentSchema.post('save', async function () {
  await Script.findByIdAndUpdate(this.scriptId, { $inc: { commentCount: 1 } });
});

commentSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Script.findByIdAndUpdate(doc.scriptId, { $inc: { commentCount: -1 } });
  }
});

export const Comment = mongoose.model('Comment', commentSchema);
