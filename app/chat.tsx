
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockMessages, mockMatches } from '@/data/mockData';
import { Message } from '@/types/User';
import { IconSymbol } from '@/components/IconSymbol';
import { router, useLocalSearchParams } from 'expo-router';
import { api } from '@/lib/api-client';

const CURRENT_USER_ID = 'current-user-id';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerTitle: {
    flex: 1,
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
  },
  menuButton: {
    padding: 8,
  },
  messagesContainer: {
    flex: 1,
    padding: 16,
  },
  messageWrapper: {
    marginBottom: 16,
    maxWidth: '80%',
  },
  sentMessage: {
    alignSelf: 'flex-end',
  },
  receivedMessage: {
    alignSelf: 'flex-start',
  },
  messageBubble: {
    padding: 12,
    borderRadius: 18,
  },
  sentBubble: {
    backgroundColor: colors.primary,
  },
  receivedBubble: {
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  sentText: {
    color: '#fff',
  },
  receivedText: {
    color: colors.text,
  },
  timestamp: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  input: {
    flex: 1,
    minHeight: 40,
    maxHeight: 100,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    marginRight: 8,
  },
  sendButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.border,
  },
});

export default function ChatScreen() {
  const params = useLocalSearchParams();
  const matchId = params.matchId as string;
  const scrollViewRef = useRef<ScrollView>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadMessages();
  }, [matchId]);

  useEffect(() => {
    // Scroll to bottom when messages change
    setTimeout(() => {
      scrollViewRef.current?.scrollToEnd({ animated: true });
    }, 100);
  }, [messages]);

  const loadMessages = async () => {
    setLoading(true);
    // TODO: Backend Integration - Fetch messages from the backend API
    const { data, error } = await api.messages.getMessages(matchId);
    setLoading(false);
    
    if (error) {
      Alert.alert('Error', 'Failed to load messages');
      console.error('[Chat] Error loading messages:', error);
      // Fallback to mock data for now
      setMessages(mockMessages);
    } else if (data) {
      setMessages(data);
    }
  };

  const handleSend = async () => {
    if (message.trim().length < 2) {
      Alert.alert('Message Too Short', 'Please enter at least 2 characters.');
      return;
    }

    const messageText = message.trim();
    setMessage('');
    setSending(true);

    // TODO: Backend Integration - Send message to the backend API
    const { error } = await api.messages.sendMessage(matchId, messageText);
    setSending(false);

    if (error) {
      Alert.alert('Error', 'Failed to send message');
      console.error('[Chat] Error sending message:', error);
      setMessage(messageText); // Restore message on error
    } else {
      // Reload messages to get the new one
      loadMessages();
    }
  };

  const handleEndConversation = () => {
    Alert.alert(
      'End Conversation',
      'Are you sure you want to end this conversation? This action cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Conversation',
          style: 'destructive',
          onPress: async () => {
            // TODO: Backend Integration - Call the end conversation API endpoint
            const { error } = await api.matches.endConversation(matchId);
            if (error) {
              Alert.alert('Error', error);
            } else {
              router.back();
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    Alert.alert(
      'Report User',
      'Please describe the issue:',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Report', style: 'destructive', onPress: () => {
          // TODO: Backend Integration - Report user
          Alert.alert('Reported', 'Thank you for your report. We will review it shortly.');
        }},
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      'Are you sure you want to block this user? You will no longer see their profile or receive messages from them.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            // TODO: Backend Integration - Block user
            Alert.alert('Blocked', 'User has been blocked.');
            router.back();
          },
        },
      ]
    );
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  };

  const otherUser = mockMatches[0]; // TODO: Get from match data

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={0}
    >
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow-back"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{otherUser.name}</Text>
        <TouchableOpacity
          style={styles.menuButton}
          onPress={() => {
            Alert.alert('Options', '', [
              { text: 'End Conversation', onPress: handleEndConversation, style: 'destructive' },
              { text: 'Report', onPress: handleReport },
              { text: 'Block', onPress: handleBlock, style: 'destructive' },
              { text: 'Cancel', style: 'cancel' },
            ]);
          }}
        >
          <IconSymbol
            ios_icon_name="ellipsis.circle"
            android_material_icon_name="more-vert"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        {messages.map((msg, index) => {
          const isSent = msg.senderId === CURRENT_USER_ID;
          return (
            <View
              key={index}
              style={[
                styles.messageWrapper,
                isSent ? styles.sentMessage : styles.receivedMessage,
              ]}
            >
              <View
                style={[
                  styles.messageBubble,
                  isSent ? styles.sentBubble : styles.receivedBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isSent ? styles.sentText : styles.receivedText,
                  ]}
                >
                  {msg.content}
                </Text>
              </View>
              <Text style={styles.timestamp}>{formatTime(msg.timestamp)}</Text>
            </View>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={message}
          onChangeText={setMessage}
          placeholder="Type a message..."
          placeholderTextColor={colors.textSecondary}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendButton,
            (message.trim().length < 2 || sending) && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={message.trim().length < 2 || sending}
        >
          <IconSymbol
            ios_icon_name="arrow.up"
            android_material_icon_name="send"
            size={20}
            color="#fff"
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}
