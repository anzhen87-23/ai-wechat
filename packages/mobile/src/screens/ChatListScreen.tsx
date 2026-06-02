import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, RefreshControl } from 'react-native';
import { contactApi } from '../api';

export default function ChatListScreen({ navigation }: any) {
  const [contacts, setContacts] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const loadContacts = async () => {
    try {
      const list = await contactApi.list();
      setContacts(list);
    } catch (err) {
      console.error('Failed to load contacts:', err);
    }
  };

  useEffect(() => {
    loadContacts();
  }, []);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    loadContacts().then(() => setRefreshing(false));
  }, []);

  const renderChat = ({ item }: any) => (
    <TouchableOpacity style={styles.chatItem} onPress={() => navigation.navigate('Chat', { contact: item })}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nickname?.[0] || '?'}</Text>
      </View>
      <View style={styles.chatInfo}>
        <Text style={styles.chatName}>{item.nickname}</Text>
        <Text style={styles.chatPreview} numberOfLines={1}>{item.lastMessage?.slice(0, 40) || '暂无消息'}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={contacts}
        keyExtractor={item => item.id}
        renderItem={renderChat}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#07c160" />}
        ListEmptyComponent={<Text style={styles.empty}>暂无消息</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  chatItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8' },
  avatar: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#07c160', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  chatInfo: { flex: 1 },
  chatName: { fontSize: 16, fontWeight: '500', marginBottom: 2 },
  chatPreview: { fontSize: 13, color: '#888' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 14 },
});
