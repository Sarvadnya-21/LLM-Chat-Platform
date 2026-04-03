const { createClient } = require('redis');
const env = require('../config/env');

const inMemoryCounters = new Map();

let redisClient = null;
let redisConnectPromise = null;

function getIp(req) {
  // Express populates req.ip when `trust proxy` is configured; fall back for dev.
  return req.ip || req.connection?.remoteAddress || 'unknown';
}

async function getRedisClient() {
  if (redisClient) {
    // If a connection attempt is already in flight, avoid waiting indefinitely.
    if (!redisConnectPromise) return redisClient;
  }

  if (!redisClient) {
    redisClient = createClient({ url: env.REDIS_URL });
  }

  if (!redisConnectPromise) {
    redisConnectPromise = redisClient.connect();
  }

  const timeoutMs = 1500;
  const timeoutPromise = new Promise((_, reject) =>
    setTimeout(() => reject(new Error('Redis connect timeout')), timeoutMs),
  );

  try {
    await Promise.race([redisConnectPromise, timeoutPromise]);
    // If connect succeeded, redisClient is ready.
    return redisClient;
  } catch (e) {
    // Reset so we can retry later (still falls back to in-memory now).
    redisConnectPromise = null;
    return null;
  }
}

async function incrementGuestCount(ip) {
  const key = `guest:${ip}`;

  const ttlMs = env.GUEST_LIMIT_TTL_SECONDS * 1000;

  // Redis-first (production).
  try {
    const client = await getRedisClient();
    if (client) {
      const count = await client.incr(key);
      if (count === 1) {
        await client.expire(key, env.GUEST_LIMIT_TTL_SECONDS);
      }
      return count;
    }
  } catch (e) {
    // If Redis is down, fall back for development resilience.
  }

  // In-memory fallback (when Redis isn't reachable).
  const now = Date.now();
  const existing = inMemoryCounters.get(key);
  if (!existing || existing.expiresAt <= now) {
    const next = { count: 1, expiresAt: now + ttlMs };
    inMemoryCounters.set(key, next);
    return 1;
  }

  existing.count += 1;
  return existing.count;
}

module.exports = async function guestLimit(req, res, next) {
  if (!env.GUEST_LIMIT_ENABLED) return next();

  // When auth middleware sets req.user, guests are unlimited.
  if (req.user) return next();

  const ip = getIp(req);
  const count = await incrementGuestCount(ip);

  if (count > 5) {
    return res.status(429).json({ error: 'Login required to continue' });
  }

  return next();
};

