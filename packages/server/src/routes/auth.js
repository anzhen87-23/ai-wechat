const Router = require('@koa/router');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const { db, generateWechatId } = require('../db');
const { generateToken } = require('../middleware/auth');

const router = new Router({ prefix: '/api/auth' });

router.post('/register', async (ctx) => {
  const { phone, email, password, nickname } = ctx.request.body;

  if (!password || !nickname) {
    ctx.status = 400;
    ctx.body = { error: 'password and nickname are required' };
    return;
  }

  if (!phone && !email) {
    ctx.status = 400;
    ctx.body = { error: 'phone or email is required' };
    return;
  }

  const saltRounds = 10;
  const passwordHash = await bcrypt.hash(password, saltRounds);
  const id = uuidv4();
  const wechatId = generateWechatId();

  try {
    db.prepare(
      'INSERT INTO users (id, phone, email, password_hash, nickname, wechat_id) VALUES (?, ?, ?, ?, ?, ?)'
    ).run(id, phone || null, email || null, passwordHash, nickname, wechatId);

    const token = generateToken(id);
    ctx.body = {
      token,
      user: {
        id,
        phone: phone || null,
        email: email || null,
        nickname,
        wechatId,
        avatarUrl: null,
        signature: '',
      },
    };
  } catch (err) {
    if (err.message.includes('UNIQUE constraint')) {
      ctx.status = 409;
      ctx.body = { error: 'User already exists' };
    } else {
      throw err;
    }
  }
});

router.post('/login', async (ctx) => {
  const { phone, email, password } = ctx.request.body;

  if (!password) {
    ctx.status = 400;
    ctx.body = { error: 'password is required' };
    return;
  }

  const user = db.prepare(
    'SELECT * FROM users WHERE phone = ? OR email = ?'
  ).get(phone || null, email || null);

  if (!user) {
    ctx.status = 401;
    ctx.body = { error: 'User not found' };
    return;
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    ctx.status = 401;
    ctx.body = { error: 'Invalid password' };
    return;
  }

  const token = generateToken(user.id);
  ctx.body = {
    token,
    user: {
      id: user.id,
      phone: user.phone,
      email: user.email,
      nickname: user.nickname,
      wechatId: user.wechat_id,
      avatarUrl: user.avatar_url,
      signature: user.signature,
    },
  };
});

module.exports = router;
