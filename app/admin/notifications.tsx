
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Switch,
  ActivityIndicator,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';
import { api } from '@/lib/api-client';

interface NotificationTemplate {
  id: string;
  template_key: string;
  title: string;
  body: string;
  category: string;
  enabled: boolean;
}

export default function NotificationManagement() {
  const [templates, setTemplates] = useState<NotificationTemplate[]>([]);
  const [loading, setLoading] = useState(true);
  const [scheduledTitle, setScheduledTitle] = useState('');
  const [scheduledBody, setScheduledBody] = useState('');
  const [scheduleTime, setScheduleTime] = useState('');
  const [sending, setSending] = useState(false);

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    try {
      // TODO: Backend Integration - Fetch notification templates from backend API
      const response = await api.get('/admin/notification-templates');
      setTemplates(response.data || []);
    } catch (error) {
      console.error('Error loading templates:', error);
      Alert.alert('Error', 'Failed to load notification templates');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleTemplate = async (id: string, currentEnabled: boolean) => {
    try {
      // TODO: Backend Integration - Toggle notification template via backend API
      await api.patch(`/admin/notification-templates/${id}`, {
        enabled: !currentEnabled,
      });

      setTemplates((prev) =>
        prev.map((t) => (t.id === id ? { ...t, enabled: !currentEnabled } : t))
      );
    } catch (error) {
      console.error('Error toggling template:', error);
      Alert.alert('Error', 'Failed to update template');
    }
  };

  const handleUpdateTemplate = async (id: string, title: string, body: string) => {
    try {
      // TODO: Backend Integration - Update notification template via backend API
      await api.patch(`/admin/notification-templates/${id}`, {
        title,
        body,
      });

      Alert.alert('Success', 'Template updated successfully');
      loadTemplates();
    } catch (error) {
      console.error('Error updating template:', error);
      Alert.alert('Error', 'Failed to update template');
    }
  };

  const handleScheduleNotification = async () => {
    if (!scheduledTitle || !scheduledBody) {
      Alert.alert('Error', 'Please enter both title and body for the notification.');
      return;
    }

    setSending(true);
    try {
      // TODO: Backend Integration - Schedule notification via backend API
      const scheduledFor = scheduleTime 
        ? new Date(scheduleTime).toISOString()
        : new Date().toISOString();

      await api.post('/admin/scheduled-notifications', {
        title: scheduledTitle,
        body: scheduledBody,
        scheduled_for: scheduledFor,
        target_audience: { all: true },
      });

      // For demo purposes, also schedule a local notification
      await Notifications.scheduleNotificationAsync({
        content: {
          title: scheduledTitle,
          body: scheduledBody,
        },
        trigger: scheduleTime ? { date: new Date(scheduleTime) } : { seconds: 10 },
      });

      Alert.alert(
        'Success',
        scheduleTime 
          ? `Notification scheduled for ${new Date(scheduleTime).toLocaleString()}`
          : 'Notification will be sent in 10 seconds (demo mode)'
      );
      
      setScheduledTitle('');
      setScheduledBody('');
      setScheduleTime('');
    } catch (error) {
      console.error('Error scheduling notification:', error);
      Alert.alert('Error', 'Failed to schedule notification.');
    } finally {
      setSending(false);
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

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading templates...</Text>
      </View>
    );
  }

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
                  <Text style={styles.templateName}>{template.category}</Text>
                  <Text style={styles.templateTitle}>{template.title}</Text>
                  <Text style={styles.templateBody}>{template.body}</Text>
                </View>
                <Switch
                  value={template.enabled}
                  onValueChange={() => handleToggleTemplate(template.id, template.enabled)}
                  trackColor={{ false: colors.border, true: colors.primary }}
                  thumbColor="#FFFFFF"
                />
              </View>
              <TouchableOpacity
                style={styles.editButton}
                onPress={() => {
                  Alert.prompt(
                    'Edit Template',
                    'Enter new title',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      {
                        text: 'Next',
                        onPress: (newTitle) => {
                          if (newTitle) {
                            Alert.prompt(
                              'Edit Template',
                              'Enter new body',
                              [
                                { text: 'Cancel', style: 'cancel' },
                                {
                                  text: 'Save',
                                  onPress: (newBody) => {
                                    if (newBody) {
                                      handleUpdateTemplate(template.id, newTitle, newBody);
                                    }
                                  },
                                },
                              ],
                              'plain-text',
                              template.body
                            );
                          }
                        },
                      },
                    ],
                    'plain-text',
                    template.title
                  );
                }}
              >
                <IconSymbol
                  ios_icon_name="pencil"
                  android_material_icon_name="edit"
                  size={16}
                  color={colors.primary}
                />
                <Text style={styles.editButtonText}>Edit</Text>
              </TouchableOpacity>
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

          <TouchableOpacity 
            style={styles.scheduleButton} 
            onPress={handleScheduleNotification}
            disabled={sending}
          >
            {sending ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <IconSymbol
                  ios_icon_name="paperplane.fill"
                  android_material_icon_name="send"
                  size={20}
                  color="#FFFFFF"
                />
                <Text style={styles.scheduleButtonText}>Schedule Notification</Text>
              </>
            )}
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
            <Text style={styles.boldText}>Push Notification Setup:{'\n\n'}</Text>
            <Text style={styles.boldText}>iOS (APNs):{'\n'}</Text>
            1. Create an Apple Push Notification service key in Apple Developer Portal{'\n'}
            2. Upload the .p8 key file to your backend{'\n'}
            3. Configure your app&apos;s bundle ID and team ID{'\n\n'}
            <Text style={styles.boldText}>Android (FCM):{'\n'}</Text>
            1. Create a Firebase project and add your Android app{'\n'}
            2. Download google-services.json{'\n'}
            3. Enable Cloud Messaging API in Google Cloud Console{'\n\n'}
            Notifications are sent via backend API to all users with push_notifications_enabled = true.
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
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    marginTop: 16,
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
    marginBottom: 12,
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
    textTransform: 'capitalize',
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
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 8,
  },
  editButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: colors.primary,
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
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
    color: colors.text,
  },
});
