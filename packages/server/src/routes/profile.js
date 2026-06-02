const Router = require('@koa/router');
const { db } = require('../db');

const router = new Router({ prefix: '/api/profile' });

// Get current user profile
router.get('/', async (ctx) => {
  const user = db.prepare(`
    SELECT id, phone, email, nickname, wechat_id as wechatId,
           avatar_url as avatarUrl, signature, created_at as createdAt
    FROM users WHERE id = ?
  `).get(ctx.state.userId);

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }
  ctx.body = user;
});

// Update profile
router.put('/', async (ctx) => {
  const { nickname, signature } = ctx.request.body;
  const updates = [];
  const params = [];

  if (nickname !== undefined) {
    updates.push('nickname = ?');
    params.push(nickname);
  }
  if (signature !== undefined) {
    updates.push('signature = ?');
    params.push(signature);
  }

  if (updates.length === 0) {
    ctx.status = 400;
    ctx.body = { error: 'No fields to update' };
    return;
  }

  params.push(ctx.state.userId);
  db.prepare(`UPDATE users SET ${updates.join(', ')} WHERE id = ?`).run(...params);

  const user = db.prepare(`
    SELECT id, nickname, wechat_id as wechatId, avatar_url as avatarUrl, signature
    FROM users WHERE id = ?
  `).get(ctx.state.userId);

  ctx.body = user;
});

module.exports = router;
