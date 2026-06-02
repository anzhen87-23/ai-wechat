import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { authApi } from '../api';

export default function LoginPage({ onSwitchToRegister }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const result = await authApi.login(form);
      login(result.token, result.user);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">AnWeChat</h1>
        <h2>登录</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="手机号 / 邮箱"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="auth-input"
            required
          />
          <input
            type="password"
            placeholder="密码"
            value={form.password}
            onChange={e => setForm({ ...form, password: e.target.value })}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '登录中...' : '登录'}
          </button>
        </form>
        <p className="auth-link">
          还没有账号？ <a href="#" onClick={e => { e.preventDefault(); onSwitchToRegister(); }}>注册</a>
        </p>
      </div>
    </div>
  );
}
