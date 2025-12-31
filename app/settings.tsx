
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Switch, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function SettingsScreen() {
  const [isActive, setIsActive] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [isDatingMode, setIsDatingMode] = useState(true);
  const [dailyMatchLimit, setDailyMatchLimit] = useState(15);
  const [dailyConversationLimit, setDailyConversationLimit] = useState(15);

  const subscriptionTier = 'elite';
  const maxDistance = 100;
  const lastDistanceChange = new Date('2024-01-15');

  const handleChangePassword = () => {
    Alert.alert('Change Password', 'This feature will be implemented with authentication.');
  };

  const handleChangeEmail = () => {
    Alert.alert('Change Email', 'This feature requires authentication and will be implemented.');
  };

  const handleChangePhone = () => {
    Alert.alert('Change Phone', 'This feature requires authentication and will be implemented.');
  };

  const handleViewInvoices = () => {
    Alert.alert('Invoices', 'Your invoice history will be displayed here.');
  };

  const handleManageSubscription = () => {
    router.push('/subscription');
  };

  const handleMatchFilters = () => {
    router.push('/match-filters');
  };

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <IconSymbol
              ios_icon_name="chevron.left"
              android_material_icon_name="arrow_back"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Settings</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Subscription</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleManageSubscription}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="crown.fill"
                android_material_icon_name="workspace_premium"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Current Plan</Text>
                <Text style={styles.settingValue}>
                  {subscriptionTier.charAt(0).toUpperCase() + subscriptionTier.slice(1)} - $
                  {subscriptionTier === 'basic' ? '15' : subscriptionTier === 'elite' ? '50' : '125'}/month
                </Text>
              </View>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleViewInvoices}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="doc.text.fill"
                android_material_icon_name="receipt"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.settingLabel}>Invoices</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Account</Text>
          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePassword}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="lock.fill"
                android_material_icon_name="lock"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.settingLabel}>Change Password</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangeEmail}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="envelope.fill"
                android_material_icon_name="email"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.settingLabel}>Change Email</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleChangePhone}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="phone.fill"
                android_material_icon_name="phone"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.settingLabel}>Change Phone Number</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="eye.slash.fill"
                android_material_icon_name="visibility_off"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Active Profile</Text>
                <Text style={styles.settingDescription}>
                  {isActive ? 'Visible to others' : 'Hidden from matches'}
                </Text>
              </View>
            </View>
            <Switch
              value={isActive}
              onValueChange={setIsActive}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.settingLabel}>Push Notifications</Text>
            </View>
            <Switch
              value={pushNotifications}
              onValueChange={setPushNotifications}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="heart.fill"
                android_material_icon_name="favorite"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Mode</Text>
                <Text style={styles.settingDescription}>
                  {isDatingMode ? 'Dating' : 'Networking'}
                </Text>
              </View>
            </View>
            <Switch
              value={isDatingMode}
              onValueChange={setIsDatingMode}
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor="#FFFFFF"
            />
          </View>

          <TouchableOpacity
            style={styles.settingItem}
            onPress={handleMatchFilters}
          >
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="slider.horizontal.3"
                android_material_icon_name="tune"
                size={24}
                color={colors.primary}
              />
              <Text style={styles.settingLabel}>Match Filters</Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="chevron_right"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>

        {(subscriptionTier === 'elite' || subscriptionTier === 'star') && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Daily Limits</Text>
            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="person.2.fill"
                  android_material_icon_name="people"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Daily Matches</Text>
                  <Text style={styles.settingDescription}>
                    Current: {dailyMatchLimit} / Max: {subscriptionTier === 'elite' ? '15' : '23'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.settingItem}>
              <View style={styles.settingLeft}>
                <IconSymbol
                  ios_icon_name="message.fill"
                  android_material_icon_name="message"
                  size={24}
                  color={colors.primary}
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingLabel}>Daily Conversations</Text>
                  <Text style={styles.settingDescription}>
                    Current: {dailyConversationLimit} / Max: {subscriptionTier === 'elite' ? '15' : '23'}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        )}

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.settingItem}>
            <View style={styles.settingLeft}>
              <IconSymbol
                ios_icon_name="location.fill"
                android_material_icon_name="location_on"
                size={24}
                color={colors.primary}
              />
              <View style={styles.settingText}>
                <Text style={styles.settingLabel}>Max Distance</Text>
                <Text style={styles.settingDescription}>
                  {maxDistance} miles • Last changed: {lastDistanceChange.toLocaleDateString()}
                </Text>
              </View>
            </View>
          </View>
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
    alignItems: 'center',
    marginBottom: 24,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
    paddingLeft: 4,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: colors.card,
    borderRadius: 12,
    padding: 16,
    marginBottom: 8,
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.05)',
    elevation: 1,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginLeft: 12,
  },
  settingValue: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 2,
  },
  settingDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
});
