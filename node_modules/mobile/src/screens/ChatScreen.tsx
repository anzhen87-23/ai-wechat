import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import io from 'socket.io-client';
import { messageApi } from '../api';

const SOCKET_URL = 'http://localhost:3001';

export default function ChatScreen({ route, navigation }: any) {
  const { contact } = route.params;
  const [messages, setMessages] = useState<any[]>([]);
  const [input, setInput] = useState('');
  const [socket, setSocket] = useState<any>(null);
  const flatListRef = useRef<FlatList>(null);

  const currentUserId = ''; // Will be overridden once user context is available

  useEffect(() => {
    const token = ''; // TODO: get token from AsyncStorage
    const s = io(SOCKET_URL, { auth: { token } });

    s.on('connect', () => {
      s.emit('join_chat', { contactId: contact.id, userId: currentUserId });
    });

    s.on('new_message', (msg: any) => {
      setMessages(prev => [...prev, msg]);
      setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
    });

    setSocket(s);

    return () => {
      s.disconnect();
    };
  }, [contact.id, currentUserId]);

  useEffect(() => {
    messageApi.getHistory(contact.id).then(setMessages).catch(() => {});
  }, [contact.id]);

  const sendMessage = () => {
    if (!input.trim() || !socket) return;
    socket.emit('send_message', {
      contactId: contact.id,
      userId: currentUserId,
      content: input.trim(),
      type: 'text',
    });
    setInput('');
  };

  const renderItem = ({ item }: any) => {
    const isOwn = item.senderId === currentUserId;
    return (
      <View style={[styles.bubbleContainer, isOwn ? styles.ownBubble : styles.otherBubble]}>
        <View style={[styles.bubble, isOwn ? styles.bubbleOwn : styles.bubbleOther]}>
          <Text style={styles.bubbleText}>{item.content}</Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : undefined} keyboardVerticalOffset={90}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backBtn}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{contact.nickname}</Text>
        <View style={{ width: 30 }} />
      </View>

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(_, i) => i.toString()}
        renderItem={renderItem}
        contentContainerStyle={styles.messageList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: false })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={input}
          onChangeText={setInput}
          placeholder="输入消息..."
          multiline
        />
        <TouchableOpacity style={[styles.sendBtn, !input.trim() && styles.sendBtnDisabled]} onPress={sendMessage} disabled={!input.trim()}>
          <Text style={styles.sendBtnText}>发送</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: '#fff', borderBottomWidth: 0.5, borderBottomColor: '#e8e8e8' },
  backBtn: { fontSize: 24, marginRight: 12 },
  headerTitle: { fontSize: 17, fontWeight: '600', flex: 1 },
  messageList: { padding: 12 },
  bubbleContainer: { marginVertical: 2 },
  ownBubble: { alignItems: 'flex-end' },
  otherBubble: { alignItems: 'flex-start' },
  bubble: { maxWidth: '75%', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  bubbleOwn: { backgroundColor: '#95ec69' },
  bubbleOther: { backgroundColor: '#fff' },
  bubbleText: { fontSize: 15 },
  inputContainer: { flexDirection: 'row', alignItems: 'flex-end', padding: 8, backgroundColor: '#fff', borderTopWidth: 0.5, borderTopColor: '#e8e8e8' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, marginRight: 8, fontSize: 15, maxHeight: 100 },
  sendBtn: { backgroundColor: '#07c160', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 8 },
  sendBtnDisabled: { opacity: 0.5 },
  sendBtnText: { color: '#fff', fontWeight: '600' },
});
