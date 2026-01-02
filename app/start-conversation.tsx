
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { Stack, router, useLocalSearchParams } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

const MIN_MESSAGE_LENGTH = 36;

export default function StartConversationScreen() {
  const { matchId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const characterCount = message.length;
  const isValid = characterCount >= MIN_MESSAGE_LENGTH;

  // TODO: Backend Integration - Start conversation via API
  const handleSend = async () => {
    if (!isValid) {
      Alert.alert('Message Too Short', `Your message must be at least ${MIN_MESSAGE_LENGTH} characters to start a conversation.`);
      return;
    }

    setLoading(true);
    try {
      // API call would go here
      console.log('[StartConversation] Sending message:', message);
      
      // Navigate to chat
      router.replace({ pathname: '/chat', params: { matchId } });
    } catch (error) {
      console.error('[StartConversation] Error:', error);
      Alert.alert('Error', 'Failed to start conversation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={commonStyles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundLight },
          headerTintColor: colors.text,
          headerTitle: 'Start Conversation',
        }}
      />

      <View style={styles.content}>
        <View style={styles.header}>
          <IconSymbol
            ios_icon_name="message.fill"
            android_material_icon_name="chat"
            size={48}
            color={colors.accent}
          />
          <Text style={styles.title}>Start a Conversation</Text>
          <Text style={styles.subtitle}>
            Write a thoughtful message to introduce yourself. Minimum {MIN_MESSAGE_LENGTH} characters.
          </Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Hey! I noticed you love hiking too..."
            placeholderTextColor={colors.textTertiary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            autoFocus
          />
          <View style={styles.characterCount}>
            <Text style={[
              styles.characterCountText,
              isValid && styles.characterCountTextValid,
            ]}>
              {characterCount}/{MIN_MESSAGE_LENGTH}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[styles.sendButton, !isValid && styles.sendButtonDisabled]}
          onPress={handleSend}
          disabled={!isValid || loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.background} />
          ) : (
            <Text style={styles.sendButtonText}>Send Message</Text>
          )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: 24,
  },
  header: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  inputContainer: {
    flex: 1,
    marginBottom: 24,
  },
  input: {
    flex: 1,
    backgroundColor: colors.backgroundLight,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    textAlignVertical: 'top',
    borderWidth: 1,
    borderColor: colors.border,
  },
  characterCount: {
    alignItems: 'flex-end',
    marginTop: 8,
  },
  characterCountText: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  characterCountTextValid: {
    color: colors.success,
  },
  sendButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: colors.surface,
    opacity: 0.5,
  },
  sendButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.background,
  },
});
