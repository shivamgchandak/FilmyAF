import 'dotenv/config';
import { env } from './config/env.js';
import { connectDB } from './config/db.js';
import { app } from './app.js';

const start = async () => {
  try {
    await connectDB(env.MONGODB_URI);
    app.listen(env.PORT, () => {
      console.log(`🎬 FilmyAF server running on http://localhost:${env.PORT}`);
      console.log(`   Environment: ${env.NODE_ENV}`);
    });
  } catch (err) {
    console.error('Fatal startup error:', err);
    process.exit(1);
  }
};

start();

process.on('unhandledRejection', (reason) => {
  console.error('UnhandledRejection:', reason);
});
