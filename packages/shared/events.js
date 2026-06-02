// Socket.IO event names
const SocketEvents = {
  JOIN_CHAT: 'join_chat',
  LEAVE_CHAT: 'leave_chat',
  SEND_MESSAGE: 'send_message',
  NEW_MESSAGE: 'new_message',
  TYPING: 'typing',
  STOP_TYPING: 'stop_typing',
  ONLINE: 'online',
  OFFLINE: 'offline',
};

module.exports = { SocketEvents };
