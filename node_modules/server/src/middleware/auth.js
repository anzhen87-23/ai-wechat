const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'an-wechat-secret-key-2026';

function authMiddleware(ctx, next) {
  const header = ctx.headers.authorization;
  if (!header || !header.startsWith('Bearer ')) {
    ctx.status = 401;
    ctx.body = { error: 'No token provided' };
    return;
  }

  try {
    const token = header.slice(7);
    const decoded = jwt.verify(token, JWT_SECRET);
    ctx.state.userId = decoded.userId;
    return next();
  } catch (err) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid or expired token' };
  }
}

function generateToken(userId) {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '30d' });
}

module.exports = { authMiddleware, generateToken, JWT_SECRET };
