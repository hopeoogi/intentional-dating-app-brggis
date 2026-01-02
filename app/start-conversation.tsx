
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';
import { supabase } from '@/app/integrations/supabase/client';

const MIN_MESSAGE_LENGTH = 36;

export default function StartConversationScreen() {
  const { userId } = useLocalSearchParams();
  const [message, setMessage] = useState('');
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (message.trim().length < MIN_MESSAGE_LENGTH) {
      Alert.alert(
        'Message Too Short',
        `Please write at least ${MIN_MESSAGE_LENGTH} characters to start a meaningful conversation.`
      );
      return;
    }

    setSending(true);

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Get current user's profile
      const { data: currentUserData } = await supabase
        .from('users')
        .select('id')
        .eq('auth_user_id', user.id)
        .single();

      if (!currentUserData) throw new Error('User profile not found');

      // Create match
      const { data: matchData, error: matchError } = await supabase
        .from('matches')
        .insert({
          user_id: currentUserData.id,
          matched_user_id: userId,
          conversation_started: true,
          pending_response_from: userId,
        })
        .select()
        .single();

      if (matchError) throw matchError;

      // Send first message
      const { error: messageError } = await supabase
        .from('messages')
        .insert({
          match_id: matchData.id,
          sender_id: currentUserData.id,
          receiver_id: userId,
          content: message.trim(),
        });

      if (messageError) throw messageError;

      Alert.alert(
        'Message Sent!',
        'Your message has been sent. You&apos;ll be notified when they respond.',
        [
          {
            text: 'OK',
            onPress: () => router.back(),
          },
        ]
      );
    } catch (error: any) {
      console.error('[StartConversation] Error:', error);
      Alert.alert('Error', 'Failed to send message. Please try again.');
    } finally {
      setSending(false);
    }
  };

  const remainingChars = MIN_MESSAGE_LENGTH - message.length;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color="#FFFFFF"
          />
        </TouchableOpacity>

        <View style={styles.header}>
          <Text style={styles.title}>Start a conversation</Text>
          <Text style={styles.subtitle}>
            Write a thoughtful message to introduce yourself
          </Text>
        </View>

        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <TextInput
              style={styles.input}
              placeholder="Write your message here..."
              placeholderTextColor="#666666"
              value={message}
              onChangeText={setMessage}
              multiline
              numberOfLines={8}
              textAlignVertical="top"
              autoFocus
            />
            <View style={styles.charCountContainer}>
              <Text
                style={[
                  styles.charCount,
                  remainingChars <= 0 && styles.charCountValid,
                ]}
              >
                {remainingChars > 0
                  ? `${remainingChars} more characters needed`
                  : `${message.length} characters`}
              </Text>
            </View>
          </View>

          <View style={styles.tipContainer}>
            <IconSymbol
              ios_icon_name="lightbulb.fill"
              android_material_icon_name="lightbulb"
              size={20}
              color="#FFD700"
            />
            <Text style={styles.tipText}>
              Tip: Mention something from their profile to show you&apos;re genuinely interested
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={[
            styles.sendButton,
            (message.trim().length < MIN_MESSAGE_LENGTH || sending) &&
              styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={message.trim().length < MIN_MESSAGE_LENGTH || sending}
        >
          {sending ? (
            <ActivityIndicator color="#000000" />
          ) : (
            <>
              <Text style={styles.sendButtonText}>Send Message</Text>
              <IconSymbol
                ios_icon_name="paperplane.fill"
                android_material_icon_name="send"
                size={20}
                color="#000000"
              />
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingTop: 60,
    paddingHorizontal: 32,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#FFFFFF',
    opacity: 0.7,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#1C1C1E',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 16,
    color: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#2C2C2E',
    height: 200,
    paddingTop: 16,
  },
  charCountContainer: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  charCount: {
    fontSize: 14,
    color: '#FF6B6B',
    fontWeight: '500',
  },
  charCountValid: {
    color: '#4CAF50',
  },
  tipContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#1C1C1E',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  tipText: {
    flex: 1,
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.8,
    lineHeight: 20,
  },
  sendButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 18,
    borderRadius: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginTop: 24,
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
  sendButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '600',
  },
});
