const required = [
  'MONGODB_URI',
  'JWT_SECRET',
  'GEMINI_API_KEY',
];

const missing = required.filter((k) => !process.env[k] || process.env[k].trim() === '');
if (missing.length > 0) {
  console.error(
    `\n[env] Missing required environment variables: ${missing.join(', ')}\n` +
      `Copy server/.env.example to server/.env and fill them in.\n`
  );
}

export const env = {
  PORT: parseInt(process.env.PORT || '5000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/filmyaf',
  JWT_SECRET: process.env.JWT_SECRET || 'dev-only-insecure-secret-change-me',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  BCRYPT_ROUNDS: parseInt(process.env.BCRYPT_ROUNDS || '12', 10),

  GEMINI_API_KEY: process.env.GEMINI_API_KEY || '',
  GEMINI_MODEL: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  GEMINI_FALLBACK_MODEL: process.env.GEMINI_FALLBACK_MODEL || 'gemini-2.0-flash',

  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
};
