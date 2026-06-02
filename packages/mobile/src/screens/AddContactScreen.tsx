import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, Alert } from 'react-native';
import { userApi, contactApi } from '../api';

export default function AddContactScreen({ navigation }: any) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any[]>([]);
  const [searching, setSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setSearching(true);
    try {
      const list = await userApi.search(query);
      setResults(list);
    } catch (err: any) {
      Alert.alert('搜索失败', err.message);
    } finally {
      setSearching(false);
    }
  };

  const handleAdd = async (friendId: string) => {
    try {
      await contactApi.add(friendId);
      Alert.alert('成功', '好友添加成功');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('失败', err.message);
    }
  };

  const renderItem = ({ item }: any) => (
    <View style={styles.resultItem}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.nickname?.[0] || '?'}</Text>
      </View>
      <View style={styles.resultInfo}>
        <Text style={styles.resultName}>{item.nickname}</Text>
        <Text style={styles.resultId}>{item.wechatId}</Text>
      </View>
      <TouchableOpacity style={styles.addBtn} onPress={() => handleAdd(item.id)}>
        <Text style={styles.addBtnText}>添加</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <TextInput
          style={styles.searchInput}
          placeholder="搜索手机号 / 微信号"
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={handleSearch}
        />
        <TouchableOpacity style={styles.searchBtn} onPress={handleSearch}>
          <Text style={styles.searchBtnText}>搜索</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={results}
        keyExtractor={item => item.id}
        renderItem={renderItem}
        ListEmptyComponent={
          <Text style={styles.empty}>{searching ? '未找到用户' : '输入关键词搜索好友'}</Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  searchBar: { flexDirection: 'row', padding: 12, backgroundColor: '#fff' },
  searchInput: { flex: 1, backgroundColor: '#f0f0f0', padding: 10, borderRadius: 8, marginRight: 8 },
  searchBtn: { backgroundColor: '#07c160', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  searchBtnText: { color: '#fff', fontWeight: '600' },
  resultItem: { flexDirection: 'row', alignItems: 'center', padding: 14, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8' },
  avatar: { width: 44, height: 44, borderRadius: 8, backgroundColor: '#07c160', alignItems: 'center', justifyContent: 'center', marginRight: 12 },
  avatarText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  resultInfo: { flex: 1 },
  resultName: { fontSize: 16, fontWeight: '500' },
  resultId: { fontSize: 12, color: '#888' },
  addBtn: { backgroundColor: '#07c160', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 6 },
  addBtnText: { color: '#fff', fontWeight: '600' },
  empty: { textAlign: 'center', color: '#888', marginTop: 40, fontSize: 14 },
});
