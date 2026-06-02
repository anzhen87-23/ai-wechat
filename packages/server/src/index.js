const http = require('http');
const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const cors = require('@koa/cors');
const Router = require('@koa/router');
const path = require('path');
const fs = require('fs');
const { Server } = require('socket.io');
const { authMiddleware, generateToken, JWT_SECRET } = require('./middleware/auth');
const { setupSocketIO } = require('./socket/chat');

// Initialize database
require('./db');

const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const contactRoutes = require('./routes/contacts');
const messageRoutes = require('./routes/messages');
const profileRoutes = require('./routes/profile');

const app = new Koa();
const router = new Router();
const server = http.createServer(app.callback());

// Socket.IO setup
const io = new Server(server, {
  cors: { origin: '*' },
});

// Authenticate socket connections via token in handshake
io.use((socket, next) => {
  const token = socket.handshake.auth.token || socket.handshake.query.token;
  if (token) {
    try {
      const { jwt } = require('jsonwebtoken');
      const decoded = jwt.verify(token, JWT_SECRET);
      socket.userId = decoded.userId;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  } else {
    next(); // Allow unauthenticated for now, userId passed in events
  }
});

const { onlineUsers } = setupSocketIO(io);

// Middleware
app.use(cors());
app.use(bodyParser());

// Debug logging
app.use(async (ctx, next) => {
  console.log(`[REQ] ${ctx.method} ${ctx.path}`);
  await next();
  console.log(`[RES] ${ctx.status} ${ctx.method} ${ctx.path}`);
  if (ctx.status >= 400) {
    console.log('  Error:', JSON.stringify(ctx.body));
  }
});

// Health endpoint
router.get('/health', async (ctx) => {
  ctx.body = { status: 'ok', onlineCount: onlineUsers.size };
});

// Get online status for a user
router.get('/api/users/:id/online', async (ctx) => {
  ctx.body = { online: onlineUsers.has(ctx.params.id) };
});

// Public routes
router.use(authRoutes.routes());

// Protected routes
router.use(authMiddleware);
router.use(userRoutes.routes());
router.use(contactRoutes.routes());
router.use(messageRoutes.routes());
router.use(profileRoutes.routes());

app.use(router.routes());
app.use(router.allowedMethods());

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || '0.0.0.0';

server.listen(PORT, HOST, () => {
  console.log(`AnWeChat server running on http://${HOST}:${PORT}`);
  console.log(`Socket.IO server available on the same port`);
});

module.exports = { app, server, io };
