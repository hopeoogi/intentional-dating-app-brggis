
import React, { useState } from 'react';
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
  Image,
} from 'react-native';
import { colors, commonStyles, buttonStyles } from '@/styles/commonStyles';
import { mockUsers } from '@/data/mockData';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function StartConversationScreen() {
  const [message, setMessage] = useState('');
  const selectedUser = mockUsers[0];
  const MIN_CHARS = 36;

  const handleSend = () => {
    if (message.trim().length < MIN_CHARS) {
      Alert.alert(
        'Message Too Short',
        `Your message must be at least ${MIN_CHARS} characters to show genuine interest.`
      );
      return;
    }

    Alert.alert(
      'Conversation Started!',
      `Your message has been sent to ${selectedUser.name}. They will be notified and must respond within 24 hours.`,
      [
        {
          text: 'OK',
          onPress: () => router.back(),
        },
      ]
    );
  };

  const mainPhoto = selectedUser.photos.find((p) => p.type === 'selfie') || selectedUser.photos[0];
  const charsRemaining = MIN_CHARS - message.length;

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
        <Text style={styles.headerTitle}>Start Conversation</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.userCard}>
          <Image source={{ uri: mainPhoto?.url }} style={styles.userPhoto} />
          <Text style={styles.userName}>{selectedUser.name}, {selectedUser.age}</Text>
          <Text style={styles.userLocation}>
            {selectedUser.location.city}, {selectedUser.location.state}
          </Text>
        </View>

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="lightbulb.fill"
            android_material_icon_name="lightbulb"
            size={24}
            color={colors.primary}
          />
          <View style={styles.infoContent}>
            <Text style={styles.infoTitle}>Make it meaningful</Text>
            <Text style={styles.infoText}>
              Write a thoughtful message (minimum {MIN_CHARS} characters) to start a genuine conversation. 
              This is like approaching someone in real life - make it count!
            </Text>
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your Message</Text>
          <TextInput
            style={styles.textInput}
            placeholder={`Write a thoughtful message (min ${MIN_CHARS} characters)...`}
            placeholderTextColor={colors.textSecondary}
            value={message}
            onChangeText={setMessage}
            multiline
            maxLength={500}
            textAlignVertical="top"
          />
          <View style={styles.charCounter}>
            <Text
              style={[
                styles.charCounterText,
                charsRemaining <= 0 && styles.charCounterValid,
              ]}
            >
              {charsRemaining > 0
                ? `${charsRemaining} more characters needed`
                : `${message.length} / 500 characters`}
            </Text>
          </View>
        </View>

        <View style={styles.examplesCard}>
          <Text style={styles.examplesTitle}>Good conversation starters:</Text>
          <Text style={styles.exampleText}>
            • Ask about something specific in their profile
          </Text>
          <Text style={styles.exampleText}>
            • Share a genuine compliment about their interests
          </Text>
          <Text style={styles.exampleText}>
            • Suggest a specific activity you could do together
          </Text>
          <Text style={styles.exampleText}>
            • Ask an open-ended question about their passions
          </Text>
        </View>

        <TouchableOpacity
          style={[
            buttonStyles.primary,
            styles.sendButton,
            message.trim().length < MIN_CHARS && styles.sendButtonDisabled,
          ]}
          onPress={handleSend}
          disabled={message.trim().length < MIN_CHARS}
        >
          <Text style={commonStyles.buttonText}>Send Message</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingVertical: 24,
    paddingBottom: 40,
  },
  userCard: {
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  userPhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 12,
  },
  userName: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  userLocation: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.accent,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  infoContent: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 4,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
  inputSection: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: colors.card,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
    minHeight: 150,
    textAlignVertical: 'top',
  },
  charCounter: {
    marginTop: 8,
    alignItems: 'flex-end',
  },
  charCounterText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  charCounterValid: {
    color: colors.success,
  },
  examplesCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  examplesTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  exampleText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 22,
    marginBottom: 6,
  },
  sendButton: {
    width: '100%',
  },
  sendButtonDisabled: {
    opacity: 0.5,
  },
});
