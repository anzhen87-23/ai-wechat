const { db } = require('../db');

function setupSocketIO(io) {
  // Map of userId -> socketId for online users
  const onlineUsers = new Map();

  io.on('connection', (socket) => {
    console.log(`[Socket] connected: ${socket.id}`);

    // User comes online
    socket.on('online', (userId) => {
      onlineUsers.set(userId, socket.id);
      console.log(`[Socket] ${userId} online`);
    });

    // Join a chat room (room name is sorted concatenation of two user IDs)
    socket.on('join_chat', ({ contactId, userId }) => {
      const room = getRoomName(userId, contactId);
      socket.join(room);
      console.log(`[Socket] ${userId} joined room ${room}`);
    });

    // Leave a chat room
    socket.on('leave_chat', ({ contactId, userId }) => {
      const room = getRoomName(userId, contactId);
      socket.leave(room);
    });

    // Handle typing indicator
    socket.on('typing', ({ contactId, userId }) => {
      const room = getRoomName(userId, contactId);
      socket.to(room).emit('typing', { senderId: userId });
    });

    socket.on('stop_typing', ({ contactId, userId }) => {
      const room = getRoomName(userId, contactId);
      socket.to(room).emit('stop_typing', { senderId: userId });
    });

    // Send a message
    socket.on('send_message', ({ contactId, userId, content, type = 'text' }) => {
      const room = getRoomName(userId, contactId);

      // Save to database
      const result = db.prepare(
        'INSERT INTO messages (sender_id, receiver_id, content, type) VALUES (?, ?, ?, ?)'
      ).run(userId, contactId, content, type);

      const message = {
        id: result.lastInsertRowid,
        senderId: userId,
        receiverId: contactId,
        content,
        type,
        createdAt: new Date().toISOString(),
      };

      // Emit to everyone in the room (including sender)
      io.to(room).emit('new_message', message);
    });

    socket.on('disconnect', () => {
      // Remove from online users
      for (const [userId, socketId] of onlineUsers.entries()) {
        if (socketId === socket.id) {
          onlineUsers.delete(userId);
          console.log(`[Socket] ${userId} offline`);
          break;
        }
      }
    });
  });

  return { onlineUsers };
}

function getRoomName(userId1, userId2) {
  // Deterministic room name from two user IDs
  return [userId1, userId2].sort().join('_');
}

module.exports = { setupSocketIO };
