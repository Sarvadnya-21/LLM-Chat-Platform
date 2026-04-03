const dotenv = require('dotenv');

dotenv.config();

const env = {
  PORT: process.env.PORT ? Number(process.env.PORT) : 4000,
  FRONTEND_ORIGIN: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
  OLLAMA_URL: process.env.OLLAMA_URL || 'http://localhost:11434',
  OLLAMA_MODEL: process.env.OLLAMA_MODEL || 'mistral',
  OLLAMA_TIMEOUT_MS: process.env.OLLAMA_TIMEOUT_MS
    ? Number(process.env.OLLAMA_TIMEOUT_MS)
    : 60000,
  USE_MOCK_RESPONSE: process.env.USE_MOCK_RESPONSE
    ? process.env.USE_MOCK_RESPONSE === 'true'
    : false,
  GUEST_LIMIT_ENABLED: process.env.GUEST_LIMIT_ENABLED === 'true',
  DATABASE_URL: process.env.DATABASE_URL,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_COOKIE_NAME: process.env.JWT_COOKIE_NAME || 'token',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',
  GUEST_LIMIT_TTL_SECONDS: process.env.GUEST_LIMIT_TTL_SECONDS
    ? Number(process.env.GUEST_LIMIT_TTL_SECONDS)
    : 60 * 60 * 24, // 24 hours
};

module.exports = env;

