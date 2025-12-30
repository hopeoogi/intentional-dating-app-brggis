
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
import { router } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';

const CURRENT_USER_ID = '550e8400-e29b-41d4-a716-446655440001';

export default function ChatScreen() {
  const [messages, setMessages] = useState<Message[]>(mockMessages);
  const [inputText, setInputText] = useState('');
  const [canSend, setCanSend] = useState(true);
  const scrollViewRef = useRef<ScrollView>(null);
  const match = mockMatches[0];
  const otherUser = match.matchedUser;

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  // Check if user can send (no double messaging)
  useEffect(() => {
    if (messages.length === 0) {
      setCanSend(true);
      return;
    }

    const lastMessage = messages[messages.length - 1];
    // User can send if the last message was from the other user
    setCanSend(lastMessage.senderId !== CURRENT_USER_ID);
  }, [messages]);

  const handleSend = async () => {
    if (inputText.trim().length < 2) {
      Alert.alert('Message Too Short', 'Please enter at least 2 characters.');
      return;
    }

    if (!canSend) {
      Alert.alert(
        'Wait for Response',
        'Please wait for the other person to respond before sending another message.'
      );
      return;
    }

    const newMessage: Message = {
      id: `msg-${Date.now()}`,
      matchId: match.id,
      senderId: CURRENT_USER_ID,
      receiverId: otherUser.id,
      content: inputText.trim(),
      timestamp: new Date(),
      read: false,
    };

    try {
      // In production, save to Supabase
      const { error } = await supabase.from('messages').insert({
        match_id: match.id,
        sender_id: CURRENT_USER_ID,
        receiver_id: otherUser.id,
        content: inputText.trim(),
      });

      if (error) throw error;

      // Update match to set pending response
      await supabase
        .from('matches')
        .update({
          pending_response_from: otherUser.id,
          response_deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
          last_message_date: new Date().toISOString(),
        })
        .eq('id', match.id);

      setMessages([...messages, newMessage]);
      setInputText('');
    } catch (err) {
      console.error('Error sending message:', err);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    }
  };

  const handleEndConversation = () => {
    Alert.alert(
      'End Conversation',
      `Are you sure you want to end this conversation with ${otherUser.name}? They will be notified: "This person no longer wants to talk. It&apos;s time to move on."`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'End Conversation',
          style: 'destructive',
          onPress: async () => {
            try {
              const { error } = await supabase
                .from('matches')
                .update({
                  conversation_ended: true,
                  ended_by: CURRENT_USER_ID,
                  ended_at: new Date().toISOString(),
                  ended_reason: 'user_initiated',
                })
                .eq('id', match.id);

              if (error) throw error;

              Alert.alert(
                'Conversation Ended',
                'The conversation has been ended respectfully. The other person has been notified.'
              );
              router.back();
            } catch (err) {
              console.error('Error ending conversation:', err);
              Alert.alert('Error', 'Failed to end conversation. Please try again.');
            }
          },
        },
      ]
    );
  };

  const handleReport = () => {
    Alert.alert(
      'Report User',
      'What would you like to report?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Inappropriate Content',
          onPress: () => {
            Alert.alert('Reported', 'Thank you for your report. Our team will review it.');
          },
        },
        {
          text: 'Harassment',
          onPress: () => {
            Alert.alert('Reported', 'Thank you for your report. Our team will review it.');
          },
        },
        {
          text: 'Spam',
          onPress: () => {
            Alert.alert('Reported', 'Thank you for your report. Our team will review it.');
          },
        },
      ]
    );
  };

  const handleBlock = () => {
    Alert.alert(
      'Block User',
      `Are you sure you want to block ${otherUser.name}? You will no longer see each other.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Block',
          style: 'destructive',
          onPress: () => {
            Alert.alert('User Blocked', `${otherUser.name} has been blocked.`);
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

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <View style={styles.headerInfo}>
          <Text style={styles.headerName}>{otherUser.name}</Text>
          <Text style={styles.headerStatus}>Active now</Text>
        </View>
        <TouchableOpacity onPress={handleReport}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle"
            android_material_icon_name="report"
            size={24}
            color={colors.warning}
          />
        </TouchableOpacity>
      </View>

      <ScrollView
        ref={scrollViewRef}
        style={styles.messagesContainer}
        contentContainerStyle={styles.messagesContent}
        showsVerticalScrollIndicator={false}
      >
        {messages.map((message, index) => {
          const isCurrentUser = message.senderId === CURRENT_USER_ID;
          return (
            <React.Fragment key={index}>
              <View
                style={[
                  styles.messageBubble,
                  isCurrentUser ? styles.currentUserBubble : styles.otherUserBubble,
                ]}
              >
                <Text
                  style={[
                    styles.messageText,
                    isCurrentUser ? styles.currentUserText : styles.otherUserText,
                  ]}
                >
                  {message.content}
                </Text>
                <Text
                  style={[
                    styles.messageTime,
                    isCurrentUser ? styles.currentUserTime : styles.otherUserTime,
                  ]}
                >
                  {formatTime(message.timestamp)}
                </Text>
              </View>
            </React.Fragment>
          );
        })}
      </ScrollView>

      <View style={styles.inputContainer}>
        {!canSend && (
          <View style={styles.warningBanner}>
            <IconSymbol
              ios_icon_name="info.circle"
              android_material_icon_name="info"
              size={16}
              color={colors.warning}
            />
            <Text style={styles.warningText}>
              Wait for {otherUser.name} to respond before sending another message
            </Text>
          </View>
        )}

        <View style={styles.actionRow}>
          <TouchableOpacity style={styles.actionButton} onPress={handleEndConversation}>
            <IconSymbol
              ios_icon_name="xmark.circle"
              android_material_icon_name="cancel"
              size={20}
              color={colors.error}
            />
            <Text style={styles.actionButtonText}>End Conversation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.actionButton} onPress={handleBlock}>
            <IconSymbol
              ios_icon_name="hand.raised"
              android_material_icon_name="block"
              size={20}
              color={colors.textSecondary}
            />
            <Text style={styles.actionButtonText}>Block</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Type a message (min 2 characters)..."
            placeholderTextColor={colors.textSecondary}
            value={inputText}
            onChangeText={setInputText}
            multiline
            maxLength={500}
            editable={canSend}
          />
          <TouchableOpacity
            style={[
              styles.sendButton,
              (!canSend || inputText.trim().length < 2) && styles.sendButtonDisabled,
            ]}
            onPress={handleSend}
            disabled={!canSend || inputText.trim().length < 2}
          >
            <IconSymbol
              ios_icon_name="arrow.up.circle.fill"
              android_material_icon_name="send"
              size={32}
              color={canSend && inputText.trim().length >= 2 ? colors.primary : colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    marginRight: 12,
  },
  headerInfo: {
    flex: 1,
  },
  headerName: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  headerStatus: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  messagesContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  messagesContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  messageBubble: {
    maxWidth: '75%',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 12,
  },
  currentUserBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.primary,
  },
  otherUserBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.card,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 22,
    marginBottom: 4,
  },
  currentUserText: {
    color: '#FFFFFF',
  },
  otherUserText: {
    color: colors.text,
  },
  messageTime: {
    fontSize: 11,
  },
  currentUserTime: {
    color: 'rgba(255, 255, 255, 0.7)',
  },
  otherUserTime: {
    color: colors.textSecondary,
  },
  inputContainer: {
    backgroundColor: colors.card,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 20,
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  warningText: {
    fontSize: 12,
    color: '#E65100',
    marginLeft: 8,
    flex: 1,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 8,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.textSecondary,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
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
    marginRight: 8,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
