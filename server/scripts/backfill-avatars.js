/**
 * One-off: clear the legacy avatar placeholder.
 *
 * Every account created before this change stores '🎬', the app's own logo,
 * which nobody chose. The client already ignores it and renders a User mark
 * instead, so this is tidying rather than a fix: it stops the field carrying a
 * value that looks like a preference and isn't.
 *
 *   cd server && node --env-file=.env scripts/backfill-avatars.js
 */
import mongoose from 'mongoose';
import { connectDB } from '../src/config/db.js';
import { User } from '../src/models/User.js';

const PLACEHOLDER = '🎬';

const run = async () => {
  const uri = process.env.MONGODB_URI;
  if (!uri) throw new Error('MONGODB_URI is not set. Run with: node --env-file=.env');

  await connectDB(uri);

  const res = await User.updateMany({ avatarEmoji: PLACEHOLDER }, { $set: { avatarEmoji: '' } });
  console.log(
    res.modifiedCount
      ? `Cleared the placeholder on ${res.modifiedCount} account(s).`
      : 'Nothing to clear.'
  );
};

run()
  .catch((err) => {
    console.error('Backfill failed:', err.message);
    process.exitCode = 1;
  })
  .finally(() => mongoose.connection.close());
