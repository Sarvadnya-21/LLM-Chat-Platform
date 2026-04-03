const env = require('../config/env');
const authService = require('../services/authService');

function getTokenFromCookies(req) {
  const cookieName = env.JWT_COOKIE_NAME;
  return req.cookies?.[cookieName];
}

module.exports = function authOptional(req, res, next) {
  const token = getTokenFromCookies(req);
  if (!token) return next();

  try {
    const decoded = authService.verifyToken(token);
    if (!decoded) return next();
    req.user = {
      id: decoded.userId,
      username: decoded.username,
    };
  } catch (e) {
    // Invalid/expired token: treat as unauthenticated.
  }

  return next();
};

