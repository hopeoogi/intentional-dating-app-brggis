
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Switch,
  Alert,
} from 'react-native';
import { Stack, router } from 'expo-router';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function SettingsScreen() {
  const [notifications, setNotifications] = React.useState(true);
  const [emailUpdates, setEmailUpdates] = React.useState(true);

  return (
    <ScrollView style={commonStyles.container}>
      <Stack.Screen
        options={{
          headerShown: true,
          headerStyle: { backgroundColor: colors.backgroundLight },
          headerTintColor: colors.text,
          headerTitle: 'Settings',
        }}
      />

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notifications</Text>
        <SettingRow
          title="Push Notifications"
          value={notifications}
          onValueChange={setNotifications}
        />
        <SettingRow
          title="Email Updates"
          value={emailUpdates}
          onValueChange={setEmailUpdates}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Account</Text>
        <SettingButton
          title="Change Password"
          onPress={() => Alert.alert('Coming Soon', 'Password change will be available soon')}
        />
        <SettingButton
          title="Change Email"
          onPress={() => Alert.alert('Coming Soon', 'Email change will be available soon')}
        />
        <SettingButton
          title="Delete Account"
          onPress={() => Alert.alert('Delete Account', 'Are you sure? This cannot be undone.')}
          destructive
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Legal</Text>
        <SettingButton
          title="Terms of Service"
          onPress={() => Alert.alert('Terms of Service', 'Terms will be displayed here')}
        />
        <SettingButton
          title="Privacy Policy"
          onPress={() => Alert.alert('Privacy Policy', 'Privacy policy will be displayed here')}
        />
      </View>
    </ScrollView>
  );
}

function SettingRow({
  title,
  value,
  onValueChange,
}: {
  title: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
}) {
  return (
    <View style={styles.settingRow}>
      <Text style={styles.settingTitle}>{title}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: colors.surface, true: colors.accent }}
        thumbColor={colors.text}
      />
    </View>
  );
}

function SettingButton({
  title,
  onPress,
  destructive,
}: {
  title: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.settingButton} onPress={onPress}>
      <Text style={[styles.settingTitle, destructive && styles.settingTitleDestructive]}>
        {title}
      </Text>
      <IconSymbol
        ios_icon_name="chevron.right"
        android_material_icon_name="arrow-forward"
        size={20}
        color={destructive ? colors.error : colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  settingTitleDestructive: {
    color: colors.error,
  },
});
