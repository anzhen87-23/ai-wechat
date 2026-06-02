const Router = require('@koa/router');
const { db } = require('../db');

const router = new Router({ prefix: '/api/users' });

// Search users by keyword (nickname, wechat_id, phone)
router.get('/search', async (ctx) => {
  const { q } = ctx.query;
  if (!q) {
    ctx.status = 400;
    ctx.body = { error: 'query parameter q is required' };
    return;
  }

  const users = db.prepare(`
    SELECT id, nickname, wechat_id as wechatId, avatar_url as avatarUrl, signature
    FROM users
    WHERE nickname LIKE ? OR wechat_id LIKE ? OR phone LIKE ?
    LIMIT 20
  `).all(`%${q}%`, `%${q}%`, `%${q}%`);

  ctx.body = users;
});

// Get user by ID
router.get('/:id', async (ctx) => {
  const user = db.prepare(`
    SELECT id, nickname, wechat_id as wechatId, avatar_url as avatarUrl, signature
    FROM users WHERE id = ?
  `).get(ctx.params.id);

  if (!user) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }
  ctx.body = user;
});

module.exports = router;
