import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { contactApi } from '../api';

export default function ContactsScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<any[]>([]);

  useEffect(() => {
    contactApi.list().then(setContacts).catch(() => {});
  }, []);

  const renderContact = ({ item }: any) => (
    <TouchableOpacity style={styles.contactItem} onPress={() => navigation.navigate('Chat', { contact: item })}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nickname?.[0] || '?'}</Text>
      </View>
      <View style={styles.contactInfo}>
        <Text style={styles.contactName}>{item.nickname}</Text>
        <Text style={styles.contactId}>{item.wechatId}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderContact}
        ListHeaderComponent={
          <TouchableOpacity style={styles.addFriendBtn} onPress={() => navigation.navigate('AddContact')}>
            <Text style={styles.addFriendText}>+ 添加朋友</Text>
          </TouchableOpacity>
        }
        ListEmptyComponent={<Text style={styles.empty}>暂无好友</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  addFriendBtn: { padding: 16, backgroundColor: '#fff', alignItems: 'center', borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8' },
  addFriendText: { color: '#07c160', fontSize: 16, fontWeight: '600' },
  contactItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8' },
  avatar: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#07c160', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  contactInfo: { flex: 1 },
  contactName: { fontSize: 16, fontWeight: '500' },
  contactId: { fontSize: 12, color: '#888' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 14 },
});
