import { useState } from 'react';
import { useAuth } from '../auth/AuthProvider';
import { authApi } from '../api';

export default function RegisterPage({ onSwitchToLogin }) {
  const { login } = useAuth();
  const [form, setForm] = useState({ phone: '', nickname: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('两次密码输入不一致');
      return;
    }

    setLoading(true);
    try {
      const result = await authApi.register({
        phone: form.phone,
        nickname: form.nickname,
        password: form.password,
      });
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
        <h2>注册</h2>
        {error && <div className="auth-error">{error}</div>}
        <form onSubmit={handleSubmit}>
          <input
            type="tel"
            placeholder="手机号"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            className="auth-input"
            required
          />
          <input
            type="text"
            placeholder="昵称"
            value={form.nickname}
            onChange={e => setForm({ ...form, nickname: e.target.value })}
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
          <input
            type="password"
            placeholder="确认密码"
            value={form.confirmPassword}
            onChange={e => setForm({ ...form, confirmPassword: e.target.value })}
            className="auth-input"
            required
          />
          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? '注册中...' : '注册'}
          </button>
        </form>
        <p className="auth-link">
          已有账号？ <a href="#" onClick={e => { e.preventDefault(); onSwitchToLogin(); }}>登录</a>
        </p>
      </div>
    </div>
  );
}
