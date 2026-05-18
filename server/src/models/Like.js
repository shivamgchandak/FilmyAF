import mongoose from 'mongoose';
import { Script } from './Script.js';

const likeSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    scriptId: { type: mongoose.Schema.Types.ObjectId, ref: 'Script', required: true, index: true },
  },
  { timestamps: true }
);

likeSchema.index({ userId: 1, scriptId: 1 }, { unique: true });

likeSchema.post('save', async function () {
  await Script.findByIdAndUpdate(this.scriptId, { $inc: { likeCount: 1 } });
});

likeSchema.post('findOneAndDelete', async function (doc) {
  if (doc) {
    await Script.findByIdAndUpdate(doc.scriptId, { $inc: { likeCount: -1 } });
  }
});

export const Like = mongoose.model('Like', likeSchema);
