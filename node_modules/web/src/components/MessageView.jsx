import { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import { messageApi } from '../../api';
import MessageBubble from './MessageBubble';

export default function MessageView({ contact, currentUserId }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  // Initialize Socket.IO connection
  useEffect(() => {
    const token = localStorage.getItem('token');
    const s = io(import.meta.env.VITE_SOCKET_URL || window.location.origin, {
      auth: { token },
    });

    s.on('connect', () => {
      s.emit('join_chat', { contactId: contact.id, userId: currentUserId });
    });

    s.on('new_message', (msg) => {
      setMessages(prev => [...prev, msg]);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [contact.id, currentUserId]);

  // Load message history
  useEffect(() => {
    messageApi.getHistory(contact.id).then(setMessages).catch(() => {});
  }, [contact.id]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;

    const msg = {
      contactId: contact.id,
      userId: currentUserId,
      content: input.trim(),
      type: 'text',
    };

    socket.emit('send_message', msg);
    setInput('');
    inputRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="message-view">
      <div className="message-header">
        <h3>{contact.nickname}</h3>
        {contact.wechatId && <span className="wechat-id">{contact.wechatId}</span>}
      </div>

      <div className="message-list">
        {messages.map((msg, i) => (
          <MessageBubble
            key={msg.id || i}
            message={msg}
            isOwn={msg.senderId === currentUserId}
          />
        ))}
        <div ref={messagesEndRef} />
      </div>

      <div className="message-input">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="输入消息... (Enter 发送)"
          rows={2}
        />
        <button className="send-btn" onClick={sendMessage} disabled={!input.trim()}>
          发送
        </button>
      </div>
    </div>
  );
}
