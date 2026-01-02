
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { api } from '@/lib/api-client';

interface IntroVideoSettings {
  url: string;
  enabled: boolean;
  duration: number;
}

export default function IntroVideoManagementScreen() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [settings, setSettings] = useState<IntroVideoSettings>({
    url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop',
    enabled: true,
    duration: 3000,
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    try {
      // TODO: Backend Integration - Fetch intro video settings from backend API
      const response = await api.get('/admin/settings/intro-video');
      if (response.data) {
        setSettings(response.data);
      }
    } catch (error) {
      console.error('Error loading settings:', error);
      Alert.alert('Error', 'Failed to load intro video settings.');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!settings.url.trim()) {
      Alert.alert('Required', 'Please enter a video/image URL.');
      return;
    }

    if (settings.duration < 1000 || settings.duration > 10000) {
      Alert.alert('Invalid Duration', 'Duration must be between 1 and 10 seconds.');
      return;
    }

    setSaving(true);
    try {
      // TODO: Backend Integration - Save intro video settings via backend API
      await api.put('/admin/settings/intro-video', settings);
      Alert.alert('Success', 'Intro video settings saved successfully!');
    } catch (error) {
      console.error('Error in handleSave:', error);
      Alert.alert('Error', 'Failed to save intro video settings.');
    } finally {
      setSaving(false);
    }
  };

  const suggestedImages = [
    {
      title: 'NYC Couple Walking',
      url: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&h=1080&fit=crop',
    },
    {
      title: 'NYC Date Night',
      url: 'https://images.unsplash.com/photo-1518391846015-55a9cc003b25?w=1920&h=1080&fit=crop',
    },
    {
      title: 'Romantic NYC Skyline',
      url: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=1920&h=1080&fit=crop',
    },
    {
      title: 'Central Park Romance',
      url: 'https://images.unsplash.com/photo-1568515387631-8b650bbcdb90?w=1920&h=1080&fit=crop',
    },
  ];

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  return (
    <View style={commonStyles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol
            ios_icon_name="chevron.left"
            android_material_icon_name="arrow_back"
            size={24}
            color={colors.text}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Intro Video Settings</Text>
        <View style={styles.placeholder} />
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.title}>Manage Intro/Loading Screen</Text>
        <Text style={styles.subtitle}>
          Configure the video or image shown when users open the app
        </Text>

        <View style={styles.section}>
          <Text style={styles.label}>Enable Intro Screen</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {settings.enabled ? 'Enabled' : 'Disabled'}
            </Text>
            <Switch
              value={settings.enabled}
              onValueChange={(value) => setSettings({ ...settings, enabled: value })}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Video/Image URL</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="https://example.com/intro-video.mp4"
            placeholderTextColor={colors.textSecondary}
            value={settings.url}
            onChangeText={(text) => setSettings({ ...settings, url: text })}
            autoCapitalize="none"
            keyboardType="url"
            multiline
          />
          <Text style={styles.hint}>
            Enter a URL to a video (.mp4, .mov) or image (.jpg, .png). For best results, use high-quality content.
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Suggested NYC Dating Images</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestionsScroll}>
            {suggestedImages.map((item, index) => (
              <TouchableOpacity
                key={index}
                style={styles.suggestionCard}
                onPress={() => setSettings({ ...settings, url: item.url })}
              >
                <Image source={{ uri: item.url }} style={styles.suggestionImage} />
                <Text style={styles.suggestionTitle}>{item.title}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.section}>
          <Text style={styles.label}>Duration (milliseconds)</Text>
          <TextInput
            style={commonStyles.input}
            placeholder="3000"
            placeholderTextColor={colors.textSecondary}
            value={settings.duration.toString()}
            onChangeText={(text) => {
              const duration = parseInt(text) || 3000;
              setSettings({ ...settings, duration });
            }}
            keyboardType="number-pad"
          />
          <Text style={styles.hint}>
            How long to show the intro screen (1000-10000ms). Default: 3000ms (3 seconds). Only applies to images.
          </Text>
        </View>

        {settings.url && (
          <View style={styles.section}>
            <Text style={styles.label}>Preview</Text>
            <View style={styles.previewContainer}>
              <Image
                source={{ uri: settings.url }}
                style={styles.previewImage}
                resizeMode="cover"
              />
              <View style={styles.previewOverlay}>
                <Text style={styles.previewBrandName}>Intentional</Text>
                <Text style={styles.previewTagline}>Where connections matter</Text>
              </View>
            </View>
          </View>
        )}

        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Tips for best results:{'\n\n'}</Text>
            - Use high-quality images (1920x1080 or higher){'\n'}
            - Keep videos short (3-5 seconds){'\n'}
            - Use images from Unsplash for free stock photos{'\n'}
            - Test on both iOS and Android devices{'\n'}
            - Consider using a romantic NYC scene for the dating app theme{'\n'}
            - Videos will play once and auto-advance when finished{'\n'}
            - Images will display for the specified duration
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.saveButton, saving && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <>
              <IconSymbol
                ios_icon_name="checkmark.circle.fill"
                android_material_icon_name="check_circle"
                size={20}
                color="#FFFFFF"
              />
              <Text style={styles.saveButtonText}>Save Changes</Text>
            </>
          )}
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
  },
  placeholder: {
    width: 40,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
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
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 32,
  },
  section: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
  },
  switchLabel: {
    fontSize: 16,
    color: colors.text,
  },
  hint: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 8,
    lineHeight: 18,
  },
  suggestionsScroll: {
    marginTop: 8,
  },
  suggestionCard: {
    width: 200,
    marginRight: 12,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  suggestionImage: {
    width: '100%',
    height: 120,
  },
  suggestionTitle: {
    fontSize: 13,
    fontWeight: '500',
    color: colors.text,
    padding: 8,
  },
  previewContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: '#000000',
  },
  previewImage: {
    width: '100%',
    height: '100%',
  },
  previewOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
  },
  previewBrandName: {
    fontSize: 32,
    fontWeight: '700',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 4,
  },
  previewTagline: {
    fontSize: 14,
    fontWeight: '400',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    backgroundColor: colors.primary + '10',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    alignItems: 'flex-start',
    gap: 12,
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    color: colors.text,
    lineHeight: 20,
  },
  boldText: {
    fontWeight: '600',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  saveButtonDisabled: {
    opacity: 0.5,
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
