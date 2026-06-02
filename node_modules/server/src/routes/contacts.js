const Router = require('@koa/router');
const { db } = require('../db');

const router = new Router({ prefix: '/api/contacts' });

// List my contacts
router.get('/', async (ctx) => {
  const userId = ctx.state.userId;
  const contacts = db.prepare(`
    SELECT u.id, u.nickname, u.wechat_id as wechatId, u.avatar_url as avatarUrl, u.signature,
           (SELECT m.content FROM messages m
            WHERE (m.sender_id = ? AND m.receiver_id = u.id)
               OR (m.sender_id = u.id AND m.receiver_id = ?)
            ORDER BY m.created_at DESC LIMIT 1) as lastMessage,
           (SELECT m.created_at FROM messages m
            WHERE (m.sender_id = ? AND m.receiver_id = u.id)
               OR (m.sender_id = u.id AND m.receiver_id = ?)
            ORDER BY m.created_at DESC LIMIT 1) as lastMessageTime,
           (SELECT COUNT(*) FROM messages m
            WHERE m.receiver_id = ? AND m.sender_id = u.id AND m.created_at > ?) as unreadCount
    FROM contacts c
    JOIN users u ON c.friend_id = u.id
    WHERE c.user_id = ?
    ORDER BY lastMessageTime DESC
  `).all(userId, userId, userId, userId, userId, '1970-01-01', userId);

  ctx.body = contacts;
});

// Add a contact
router.post('/', async (ctx) => {
  const userId = ctx.state.userId;
  const { friendId } = ctx.request.body;

  if (!friendId) {
    ctx.status = 400;
    ctx.body = { error: 'friendId is required' };
    return;
  }

  const existing = db.prepare(
    'SELECT id FROM users WHERE id = ?'
  ).get(friendId);

  if (!existing) {
    ctx.status = 404;
    ctx.body = { error: 'User not found' };
    return;
  }

  if (friendId === userId) {
    ctx.status = 400;
    ctx.body = { error: 'Cannot add yourself' };
    return;
  }

  try {
    db.prepare('INSERT INTO contacts (user_id, friend_id) VALUES (?, ?)').run(userId, friendId);
    ctx.body = { success: true };
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      ctx.status = 409;
      ctx.body = { error: 'Already in contacts' };
    } else {
      throw err;
    }
  }
});

// Remove a contact
router.delete('/:friendId', async (ctx) => {
  const userId = ctx.state.userId;
  const result = db.prepare(
    'DELETE FROM contacts WHERE user_id = ? AND friend_id = ?'
  ).run(userId, ctx.params.friendId);

  if (result.changes === 0) {
    ctx.status = 404;
    ctx.body = { error: 'Contact not found' };
    return;
  }
  ctx.body = { success: true };
});

module.exports = router;
