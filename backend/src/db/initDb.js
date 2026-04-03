const env = require('../config/env');
const pool = require('./pool');

async function initDb() {
  if (!env.DATABASE_URL || !env.JWT_SECRET) {
    // Keep app running for Steps 1-3 even if auth/DB isn't configured yet.
    // Auth routes will fail with a clear 500 when called.
    // eslint-disable-next-line no-console
    console.warn('Auth not configured (DATABASE_URL/JWT_SECRET missing). Skipping DB init.');
    return;
  }

  // Ensure extensions and tables exist.
  await pool.query('CREATE EXTENSION IF NOT EXISTS pgcrypto;');

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      username text UNIQUE NOT NULL,
      password_hash text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS chats (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
      title text,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS messages (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      chat_id uuid NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
      role text NOT NULL CHECK (role IN ('user', 'assistant')),
      content text NOT NULL,
      created_at timestamptz NOT NULL DEFAULT now()
    );
  `);
}

module.exports = { initDb };

