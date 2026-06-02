const Router = require('@koa/router');
const { db } = require('../db');

const router = new Router({ prefix: '/api/messages' });

// Get conversation history with a contact
router.get('/:contactId', async (ctx) => {
  const userId = ctx.state.userId;
  const contactId = ctx.params.contactId;
  const { limit = 50, before } = ctx.query;

  let query = `
    SELECT m.id, m.sender_id as senderId, m.receiver_id as receiverId,
           m.content, m.type, m.created_at as createdAt
    FROM messages m
    WHERE ((m.sender_id = ? AND m.receiver_id = ?)
        OR (m.sender_id = ? AND m.receiver_id = ?))
  `;
  const params = [userId, contactId, contactId, userId];

  if (before) {
    query += ' AND m.created_at < ?';
    params.push(before);
  }

  query += ' ORDER BY m.created_at DESC LIMIT ?';
  params.push(parseInt(limit));

  const messages = db.prepare(query).all(...params);

  // Reverse to get chronological order
  messages.reverse();
  ctx.body = messages;
});

module.exports = router;
