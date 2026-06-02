import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../auth/AuthProvider';
import ChatList from '../../components/ChatList';
import MessageView from '../../components/MessageView';
import ContactList from '../../components/ContactList';
import ProfilePanel from '../../components/ProfilePanel';

export default function ChatPage() {
  const { user, logout, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState('chats'); // chats, contacts, me
  const [selectedContact, setSelectedContact] = useState(null);
  const [contacts, setContacts] = useState([]);
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    if (activeTab === 'chats' || activeTab === 'contacts') {
      loadContacts();
    }
  }, [activeTab]);

  const loadContacts = async () => {
    const { contactApi } = await import('../../api');
    try {
      const list = await contactApi.list();
      setContacts(list);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  const handleSelectContact = (contact) => {
    setSelectedContact(contact);
  };

  const handleNewContact = (friendId) => {
    loadContacts();
    if (searchResults.length > 0) {
      setSearchResults([]);
    }
  };

  const handleSearch = async (q) => {
    if (!q.trim()) {
      setSearchResults([]);
      return;
    }
    const { userApi } = await import('../../api');
    try {
      const results = await userApi.search(q);
      setSearchResults(results.filter(u => u.id !== user?.id));
    } catch (err) {
      console.error('Search failed:', err);
    }
  };

  const handleAddContact = async (friendId) => {
    const { contactApi } = await import('../../api');
    try {
      await contactApi.add(friendId);
      handleNewContact(friendId);
    } catch (err) {
      alert(err.message);
    }
  };

  const tabs = [
    { key: 'chats', label: '消息', icon: '💬' },
    { key: 'contacts', label: '通讯录', icon: '👥' },
    { key: 'me', label: '我', icon: '👤' },
  ];

  return (
    <div className="app-layout">
      {/* Left sidebar */}
      <div className="app-sidebar">
        <div className="sidebar-header">
          <h2>AnWeChat</h2>
        </div>
        <div className="sidebar-tabs">
          {tabs.map(tab => (
            <button
              key={tab.key}
              className={`sidebar-tab ${activeTab === tab.key ? 'active' : ''}`}
              onClick={() => { setActiveTab(tab.key); setSelectedContact(null); }}
              title={tab.label}
            >
              {tab.icon}
            </button>
          ))}
        </div>
        <div className="sidebar-content">
          {activeTab === 'chats' && (
            <ChatList
              contacts={contacts}
              onSelect={handleSelectContact}
              selectedId={selectedContact?.id}
            />
          )}
          {activeTab === 'contacts' && (
            <ContactList
              contacts={contacts}
              searchResults={searchResults}
              onSelect={handleSelectContact}
              onAddContact={handleAddContact}
              onSearch={handleSearch}
            />
          )}
          {activeTab === 'me' && (
            <ProfilePanel
              user={user}
              onLogout={logout}
              onUpdate={() => {
                import('../../api').then(m =>
                  m.profileApi.get().then(setUser).catch(() => {})
                );
              }}
            />
          )}
        </div>
      </div>

      {/* Right content area */}
      <div className="app-content">
        {selectedContact ? (
          <MessageView
            contact={selectedContact}
            currentUserId={user?.id}
          />
        ) : (
          <div className="app-placeholder">
            <p>选择一个联系人开始聊天</p>
          </div>
        )}
      </div>
    </div>
  );
}
