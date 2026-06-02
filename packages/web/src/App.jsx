import { useState } from 'react';
import { AuthProvider, useAuth } from './auth/AuthProvider';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ChatPage from './pages/ChatPage';
import './styles/index.css';

function AppContent() {
  const { user, loading } = useAuth();
  const [view, setView] = useState('login'); // login, register

  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  if (!user) {
    return view === 'register' ? (
      <RegisterPage onSwitchToLogin={() => setView('login')} />
    ) : (
      <LoginPage onSwitchToRegister={() => setView('register')} />
    );
  }

  return <ChatPage />;
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
