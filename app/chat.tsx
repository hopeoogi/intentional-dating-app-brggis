
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function ChatScreen() {
  const { matchId } = useLocalSearchParams();
  const [messages, setMessages] = useState<any[]>([]);
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useEffect(() => {
    loadMessages();
  }, [matchId]);

  // TODO: Backend Integration - Fetch messages from API
  const loadMessages = async () => {
    try {
      // Mock messages
      const mockMessages = [
        {
          id: '1',
          senderId: 'other',
          content: 'Hey! I saw you love hiking too. Have you been to Yosemite?',
          sentAt: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          id: '2',
          senderId: 'me',
          content: 'Yes! I was there last month. The views are absolutely incredible. Do you have a favorite trail?',
          sentAt: new Date(Date.now() - 1800000).toISOString(),
        },
      ];
      setMessages(mockMessages);
    } catch (error) {
      console.error('[Chat] Error loading messages:', error);
    }
  };

  // TODO: Backend Integration - Send message to API
  const handleSend = async () => {
    if (!inputText.trim() || inputText.length < 2) {
      Alert.alert('Error', 'Message must be at least 2 characters');
      return;
    }

    setLoading(true);
    try {
      const newMessage = {
        id: Date.now().toString(),
        senderId: 'me',
        content: inputText,
        sentAt: new Date().toISOString(),
      };
      setMessages([...messages, newMessage]);
      setInputText('');
      
      // Scroll to bottom
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    } catch (error) {
      console.error('[Chat] Error sending message:', error);
      Alert.alert('Error', 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  const handleEndConversation = () => {
    Alert.alert(
      'End Conversation',
      'Are you sure you want to end this conversation? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Conversation',
          style: 'destructive',
          onPress: () => {
            // TODO: Backend Integration - End conversation via API
            router.back();
          },
        },
      ]
    );
  };

  const renderMessage = ({ item }: { item: any }) => {
    const isMe = item.senderId === 'me';
    return (
      <View style={[styles.messageContainer, isMe && styles.messageContainerMe]}>
        <View style={[styles.messageBubble, isMe && styles.messageBubbleMe]}>
          <Text style={[styles.messageText, isMe && styles.messageTextMe]}>
            {item.content}
          </Text>
          <Text style={[styles.messageTime, isMe && styles.messageTimeMe]}>
            {formatTime(item.sentAt)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundLight },
          headerTintColor: colors.text,
          headerTitle: 'Sarah',
          headerRight: () => (
            <TouchableOpacity onPress={handleEndConversation}>
              <Text style={styles.endButton}>End</Text>
            </TouchableOpacity>
          ),
        }}
      />

      <FlatList
        ref={flatListRef}
        data={messages}
        renderItem={renderMessage}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.messagesList}
        onContentSizeChange={() => flatListRef.current?.scrollToEnd({ animated: true })}
      />

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type a message..."
          placeholderTextColor={colors.textTertiary}
          value={inputText}
          onChangeText={setInputText}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!inputText.trim() || loading}
        >
          <IconSymbol
            ios_icon_name="arrow.up"
            android_material_icon_name="send"
            size={20}
            color={inputText.trim() ? colors.background : colors.textSecondary}
          />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

const styles = StyleSheet.create({
  messagesList: {
    padding: 16,
  },
  messageContainer: {
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  messageContainerMe: {
    alignItems: 'flex-end',
  },
  messageBubble: {
    backgroundColor: colors.backgroundLight,
    borderRadius: 16,
    padding: 12,
    maxWidth: '75%',
  },
  messageBubbleMe: {
    backgroundColor: colors.accent,
  },
  messageText: {
    fontSize: 16,
    color: colors.text,
    marginBottom: 4,
  },
  messageTextMe: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
    color: colors.textSecondary,
  },
  messageTimeMe: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: colors.backgroundLight,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    alignItems: 'flex-end',
    gap: 12,
  },
  input: {
    flex: 1,
    backgroundColor: colors.background,
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    color: colors.text,
    maxHeight: 100,
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
    backgroundColor: colors.surface,
  },
  endButton: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.error,
    marginRight: 16,
  },
});
