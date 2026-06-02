export default function ChatList({ contacts, onSelect, selectedId }) {
  if (contacts.length === 0) {
    return (
      <div className="empty-list">
        <p>暂无消息</p>
      </div>
    );
  }

  return (
    <div className="chat-list">
      {contacts.map(contact => (
        <div
          key={contact.id}
          className={`chat-item ${selectedId === contact.id ? 'active' : ''}`}
          onClick={() => onSelect(contact)}
        >
          <div className="chat-avatar">
            {contact.avatarUrl ? (
              <img src={contact.avatarUrl} alt="" />
            ) : (
              <div className="avatar-placeholder">{contact.nickname?.[0] || '?'}</div>
            )}
          </div>
          <div className="chat-info">
            <div className="chat-name">{contact.nickname}</div>
            <div className="chat-preview">
              {contact.lastMessage?.slice(0, 30) || '暂无消息'}
            </div>
          </div>
          {contact.unreadCount > 0 && (
            <span className="chat-badge">{contact.unreadCount}</span>
          )}
        </div>
      ))}
    </div>
  );
}
