import { useState } from 'react';

export default function ContactList({ contacts, searchResults, onSelect, onAddContact, onSearch }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searching, setSearching] = useState(false);

  const handleSearch = (q) => {
    setSearchQuery(q);
    setSearching(true);
    onSearch(q);
  };

  return (
    <div className="contact-list">
      <div className="search-box">
        <input
          type="text"
          placeholder="搜索用户"
          value={searchQuery}
          onChange={e => handleSearch(e.target.value)}
          className="search-input"
        />
      </div>

      {searching && searchResults.length > 0 && (
        <div className="search-results">
          <h4>搜索结果</h4>
          {searchResults.map(user => (
            <div key={user.id} className="contact-item">
              <div className="contact-avatar">
                <div className="avatar-placeholder">{user.nickname?.[0] || '?'}</div>
              </div>
              <div className="contact-info">
                <div className="contact-name">{user.nickname}</div>
                <div className="contact-id">{user.wechatId}</div>
              </div>
              <button className="add-btn" onClick={() => onAddContact(user.id)}>添加</button>
            </div>
          ))}
        </div>
      )}

      {searching && searchResults.length === 0 && searchQuery.trim() && (
        <div className="empty-list"><p>未找到用户</p></div>
      )}

      <h4 className="section-header">好友列表</h4>
      {contacts.length === 0 ? (
        <div className="empty-list"><p>暂无好友</p></div>
      ) : (
        contacts.map(contact => (
          <div
            key={contact.id}
            className="contact-item"
            onClick={() => onSelect(contact)}
          >
            <div className="contact-avatar">
              {contact.avatarUrl ? (
                <img src={contact.avatarUrl} alt="" />
              ) : (
                <div className="avatar-placeholder">{contact.nickname?.[0] || '?'}</div>
              )}
            </div>
            <div className="contact-info">
              <div className="contact-name">{contact.nickname}</div>
              <div className="contact-id">{contact.wechatId}</div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
