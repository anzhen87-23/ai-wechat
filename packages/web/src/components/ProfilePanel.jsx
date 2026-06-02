import { useState } from 'react';
import { profileApi } from '../../api';

export default function ProfilePanel({ user, onLogout, onUpdate }) {
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [signature, setSignature] = useState(user?.signature || '');

  const handleSave = async () => {
    try {
      await profileApi.update({ nickname, signature });
      onUpdate();
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  if (!user) return null;

  return (
    <div className="profile-panel">
      <div className="profile-avatar-large">
        <div className="avatar-placeholder">{user.nickname?.[0] || '?'}</div>
      </div>
      <div className="profile-info">
        {editing ? (
          <>
            <input
              value={nickname}
              onChange={e => setNickname(e.target.value)}
              className="profile-input"
              placeholder="昵称"
            />
            <input
              value={signature}
              onChange={e => setSignature(e.target.value)}
              className="profile-input"
              placeholder="个性签名"
            />
            <div className="profile-actions">
              <button className="btn-save" onClick={handleSave}>保存</button>
              <button className="btn-cancel" onClick={() => setEditing(false)}>取消</button>
            </div>
          </>
        ) : (
          <>
            <h3>{user.nickname}</h3>
            <p className="profile-signature">{user.signature || '暂无个性签名'}</p>
            <p className="profile-wechat-id">微信号: {user.wechatId}</p>
            <button className="btn-edit" onClick={() => setEditing(true)}>编辑资料</button>
          </>
        )}
      </div>
      <button className="btn-logout" onClick={onLogout}>退出登录</button>
    </div>
  );
}
