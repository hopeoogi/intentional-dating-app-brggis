
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

interface NotificationTemplate {
  id: string;
  name: string;
  title: string;
  body: string;
  enabled: boolean;
}

export default function NotificationManagement() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([
    {
      id: '1',
      name: 'New Match',
      title: 'You have a new match!',
      body: 'Check out your new intentional connection.',
      enabled: true,
    },
    {
      id: '2',
      name: 'Message Received',
      title: 'New message from {name}',
      body: '{message}',
      enabled: true,
    },
    {
      id: '3',
      name: 'Daily Reminder',
      title: 'New matches are waiting!',
      body: 'Check out today&apos;s intentional connections.',
      enabled: true,
    },
    {
      id: '4',
      name: 'Conversation Expiring',
      title: 'Respond to keep the conversation going',
      body: 'Your conversation with {name} needs a response.',
      enabled: true,
    },
  ]);

  const [scheduledTitle, setScheduledTitle] = useState('');
  const [scheduledBody, setScheduledBody] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');

  const handleToggleTemplate = (id: string) => {
    setTemplates((prev) =>
      prev.map((t) => (t.id === id ? { ...t, enabled: !t.enabled } : t))
    );
  };

  const handleScheduleNotification = async () => {
    if (!scheduledTitle || !scheduledBody) {
      Alert.alert('Error', 'Please enter both title and body for the notification.');
      return;
    }

    try {
      // TODO: Implement actual scheduling with backend
      // For now, schedule a local notification as a demo
      await Notifications.scheduleNotificationAsync({
        content: {
          title: scheduledTitle,
          body: scheduledBody,
        },
        trigger: {
          seconds: 10,
        },
      });

      Alert.alert(
        'Success',
        'Notification scheduled successfully! (Demo: will send in 10 seconds)'
      );
      setScheduledTitle('');
      setScheduledBody('');
      setScheduleTime('');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification.');
    }
  };

  const handleSendTestNotification = async () => {
    try {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: 'Test Notification',
          body: 'This is a test notification from the admin panel.',
        },
        trigger: null,
      });
      Alert.alert('Success', 'Test notification sent!');
    } catch (error) {
      console.error('Error sending test notification:', error);
      Alert.alert('Error', 'Failed to send test notification.');
    }
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
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
          <Text style={styles.title}>Push Notifications</Text>
          <View style={styles.backButton} />
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Notification Templates</Text>
          <Text style={styles.sectionDescription}>
            Manage the wording and status of automatic notifications
          </Text>

          {templates.map((template) => (
            <View key={template.id} style={styles.templateCard}>
              <View style={styles.templateHeader}>
                <View style={styles.templateInfo}>
                  <Text style={styles.templateName}>{template.name}</Text>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateBody}>{template.body}</Text>
                </View>
                <Switch
                  value={template.enabled}
                  onValueChange={() => handleToggleTemplate(template.id)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Schedule Notification</Text>
          <Text style={styles.sectionDescription}>
            Send a notification to all users with notifications enabled
          </Text>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notification Title</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter notification title..."
              placeholderTextColor={colors.textSecondary}
              value={scheduledTitle}
              onChangeText={setScheduledTitle}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Notification Body</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Enter notification message..."
              placeholderTextColor={colors.textSecondary}
              value={scheduledBody}
              onChangeText={setScheduledBody}
              multiline
              numberOfLines={4}
            />
          </View>

          <View style={styles.inputContainer}>
            <Text style={styles.inputLabel}>Schedule Time (Optional)</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., 2024-12-25 10:00 AM"
              placeholderTextColor={colors.textSecondary}
              value={scheduleTime}
              onChangeText={setScheduleTime}
            />
            <Text style={styles.inputHint}>Leave blank to send immediately</Text>
          </View>

          <TouchableOpacity style={styles.scheduleButton} onPress={handleScheduleNotification}>
            <IconSymbol
              ios_icon_name="paperplane.fill"
              android_material_icon_name="send"
              size={20}
              color="#FFFFFF"
            />
            <Text style={styles.scheduleButtonText}>Schedule Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Testing</Text>
          <TouchableOpacity style={styles.testButton} onPress={handleSendTestNotification}>
            <IconSymbol
              ios_icon_name="bell.badge.fill"
              android_material_icon_name="notifications_active"
              size={20}
              color={colors.primary}
            />
            <Text style={styles.testButtonText}>Send Test Notification</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            Note: This is a demo interface. In production, notifications would be sent via a
            backend service (e.g., Supabase Edge Functions) to all users with notifications
            enabled. The backend would handle scheduling, targeting, and delivery.
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  sectionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  templateCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  templateInfo: {
    flex: 1,
    marginRight: 16,
  },
  templateName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  templateTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 4,
  },
  templateBody: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  inputContainer: {
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  input: {
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 12,
    fontSize: 16,
    color: colors.text,
    borderWidth: 1,
    borderColor: colors.border,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  inputHint: {
    fontSize: 12,
    color: colors.textSecondary,
    marginTop: 4,
  },
  scheduleButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  scheduleButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  testButton: {
    backgroundColor: colors.card,
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  testButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.primary,
  },
  infoBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    flexDirection: 'row',
    gap: 12,
    borderWidth: 1,
    borderColor: colors.primary + '30',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 18,
  },
});
