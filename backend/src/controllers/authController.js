const env = require('../config/env');
const authService = require('../services/authService');

function isSecureCookie() {
  return process.env.NODE_ENV === 'production';
}

function setAuthCookie(res, token) {
  res.cookie(env.JWT_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureCookie(),
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days (simple default)
  });
}

async function signup(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const { user, token } = await authService.signup({ username, password });
    setAuthCookie(res, token);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

async function login(req, res, next) {
  try {
    const { username, password } = req.body || {};

    if (!username || typeof username !== 'string') {
      return res.status(400).json({ error: 'Username is required' });
    }
    if (!password || typeof password !== 'string') {
      return res.status(400).json({ error: 'Password is required' });
    }

    const { user, token } = await authService.login({ username, password });
    setAuthCookie(res, token);
    return res.json({ user });
  } catch (err) {
    return next(err);
  }
}

function me(req, res) {
  // Keep this endpoint quiet for guests: return user=null when unauthenticated.
  return res.json({ user: req.user || null });
}

function logout(req, res) {
  res.clearCookie(env.JWT_COOKIE_NAME, {
    httpOnly: true,
    sameSite: 'lax',
    secure: isSecureCookie(),
  });
  return res.json({ ok: true });
}

module.exports = {
  signup,
  login,
  me,
  logout,
};

