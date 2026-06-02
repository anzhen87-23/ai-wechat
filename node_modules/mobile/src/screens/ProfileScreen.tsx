import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Alert } from 'react-native';
import { useAuth } from '../auth/AuthContext';
import { profileApi } from '../api';

export default function ProfileScreen() {
  const { user, logout, setUser } = useAuth();
  const [editing, setEditing] = useState(false);
  const [nickname, setNickname] = useState(user?.nickname || '');
  const [signature, setSignature] = useState(user?.signature || '');

  const handleSave = async () => {
    try {
      const updated = await profileApi.update({ nickname, signature });
      setUser(updated);
      setEditing(false);
    } catch (err: any) {
      Alert.alert('保存失败', err.message);
    }
  };

  if (!user) return null;

  return (
    <View style={styles.container}>
      <View style={styles.avatarLarge}>
        <Text style={styles.avatarText}>{user.nickname?.[0] || '?'}</Text>
      </View>

      <View style={styles.infoSection}>
        {editing ? (
          <>
            <TextInput style={styles.input} value={nickname} onChangeText={setNickname} placeholder="昵称" />
            <TextInput style={styles.input} value={signature} onChangeText={setSignature} placeholder="个性签名" />
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>保存</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelBtn} onPress={() => setEditing(false)}>
              <Text style={styles.cancelBtnText}>取消</Text>
            </TouchableOpacity>
          </>
        ) : (
          <>
            <Text style={styles.name}>{user.nickname}</Text>
            <Text style={styles.signature}>{user.signature || '暂无个性签名'}</Text>
            <Text style={styles.wechatId}>微信号: {user.wechatId}</Text>
            <TouchableOpacity style={styles.editBtn} onPress={() => setEditing(true)}>
              <Text style={styles.editBtnText}>编辑资料</Text>
            </TouchableOpacity>
          </>
        )}
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={logout}>
        <Text style={styles.logoutBtnText}>退出登录</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5', alignItems: 'center', paddingTop: 60 },
  avatarLarge: { width: 80, height: 80, borderRadius: 16, backgroundColor: '#07c160', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  avatarText: { color: '#fff', fontSize: 32, fontWeight: 'bold' },
  infoSection: { width: '90%', backgroundColor: '#fff', borderRadius: 12, padding: 20, alignItems: 'center' },
  name: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  signature: { fontSize: 14, color: '#888', marginBottom: 4, textAlign: 'center' },
  wechatId: { fontSize: 13, color: '#aaa', marginBottom: 16 },
  editBtn: { padding: 8, paddingHorizontal: 20, backgroundColor: '#f0f0f0', borderRadius: 8 },
  editBtnText: { color: '#333', fontWeight: '500' },
  input: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, marginBottom: 12, fontSize: 16 },
  saveBtn: { width: '100%', padding: 12, backgroundColor: '#07c160', borderRadius: 8, alignItems: 'center', marginBottom: 8 },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 15 },
  cancelBtn: { width: '100%', padding: 12, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, alignItems: 'center' },
  cancelBtnText: { color: '#666', fontSize: 15 },
  logoutBtn: { marginTop: 40, padding: 12, paddingHorizontal: 32, borderWidth: 1, borderColor: '#f5222d', borderRadius: 8 },
  logoutBtnText: { color: '#f5222d', fontWeight: '600' },
});
