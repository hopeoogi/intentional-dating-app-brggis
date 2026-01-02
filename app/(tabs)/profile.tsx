
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '@/contexts/AuthContext';
import { colors, commonStyles } from '@/styles/commonStyles';
import { StatusBar } from 'expo-status-bar';
import { IconSymbol } from '@/components/IconSymbol';

export default function ProfileScreen() {
  const { signOut, session } = useAuth();

  const handleSignOut = async () => {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out',
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/welcome');
        },
      },
    ]);
  };

  // TODO: Backend Integration - Fetch user profile from API
  const user = {
    name: session?.user?.name || 'User',
    email: session?.user?.email || '',
    photo: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=400',
    subscriptionTier: 'free',
  };

  return (
    <ScrollView style={commonStyles.container}>
      <StatusBar style="light" />
      
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </View>

      {/* Profile Info */}
      <View style={styles.profileSection}>
        <Image source={{ uri: user.photo }} style={styles.profilePhoto} />
        <Text style={styles.profileName}>{user.name}</Text>
        <Text style={styles.profileEmail}>{user.email}</Text>
        
        <View style={styles.subscriptionBadge}>
          <Text style={styles.subscriptionText}>
            {user.subscriptionTier.toUpperCase()}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View style={styles.menu}>
        <MenuItem
          icon="edit"
          title="Edit Profile"
          onPress={() => Alert.alert('Coming Soon', 'Profile editing will be available soon')}
        />
        <MenuItem
          icon="favorite"
          title="Match Filters"
          onPress={() => router.push('/match-filters')}
        />
        <MenuItem
          icon="payment"
          title="Subscription"
          onPress={() => router.push('/subscription')}
        />
        <MenuItem
          icon="settings"
          title="Settings"
          onPress={() => router.push('/settings')}
        />
        <MenuItem
          icon="logout"
          title="Sign Out"
          onPress={handleSignOut}
          destructive
        />
      </View>
    </ScrollView>
  );
}

function MenuItem({
  icon,
  title,
  onPress,
  destructive,
}: {
  icon: string;
  title: string;
  onPress: () => void;
  destructive?: boolean;
}) {
  return (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <View style={styles.menuItemLeft}>
        <IconSymbol
          ios_icon_name={icon}
          android_material_icon_name={icon}
          size={24}
          color={destructive ? colors.error : colors.text}
        />
        <Text style={[styles.menuItemText, destructive && styles.menuItemTextDestructive]}>
          {title}
        </Text>
      </View>
      <IconSymbol
        ios_icon_name="chevron.right"
        android_material_icon_name="arrow-forward"
        size={20}
        color={colors.textSecondary}
      />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  header: {
    padding: 24,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  profileSection: {
    alignItems: 'center',
    padding: 32,
  },
  profilePhoto: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: 16,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 16,
  },
  subscriptionBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  subscriptionText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.text,
  },
  menu: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: colors.backgroundLight,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  menuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuItemTextDestructive: {
    color: colors.error,
  },
});
