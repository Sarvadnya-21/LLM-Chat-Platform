const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const env = require('../config/env');
const userModel = require('../models/userModel');

async function hashPassword(password) {
  const saltRounds = 10;
  return bcrypt.hash(password, saltRounds);
}

function signToken({ id, username }) {
  if (!env.JWT_SECRET) {
    const e = new Error('Authentication not configured');
    e.statusCode = 500;
    throw e;
  }

  return jwt.sign(
    { userId: id, username },
    env.JWT_SECRET,
    { expiresIn: env.JWT_EXPIRES_IN },
  );
}

async function signup({ username, password }) {
  if (!env.DATABASE_URL || !env.JWT_SECRET) {
    const e = new Error('Authentication not configured');
    e.statusCode = 500;
    throw e;
  }

  const existing = await userModel.findByUsername(username);
  if (existing) {
    const e = new Error('Username already taken');
    e.statusCode = 409;
    throw e;
  }

  const passwordHash = await hashPassword(password);
  const user = await userModel.createUser({ username, passwordHash });

  const token = signToken(user);
  return { user, token };
}

async function login({ username, password }) {
  if (!env.DATABASE_URL || !env.JWT_SECRET) {
    const e = new Error('Authentication not configured');
    e.statusCode = 500;
    throw e;
  }

  const user = await userModel.findByUsername(username);
  if (!user) {
    const e = new Error('Invalid credentials');
    e.statusCode = 401;
    throw e;
  }

  const ok = await bcrypt.compare(password, user.password_hash);
  if (!ok) {
    const e = new Error('Invalid credentials');
    e.statusCode = 401;
    throw e;
  }

  const token = signToken({ id: user.id, username: user.username });
  return { user: { id: user.id, username: user.username }, token };
}

function verifyToken(token) {
  if (!env.JWT_SECRET) return null;
  return jwt.verify(token, env.JWT_SECRET);
}

module.exports = {
  signup,
  login,
  verifyToken,
};

