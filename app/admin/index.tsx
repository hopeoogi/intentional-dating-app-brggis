
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Platform,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

interface AdminStats {
  totalUsers: number;
  pendingApprovals: number;
  activeSubscriptions: number;
  totalRevenue: number;
  basicSubscribers: number;
  eliteSubscribers: number;
  starSubscribers: number;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<AdminStats>({
    totalUsers: 0,
    pendingApprovals: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    basicSubscribers: 0,
    eliteSubscribers: 0,
    starSubscribers: 0,
  });

  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // TODO: Fetch real stats from Supabase
    // For now, using mock data
    setStats({
      totalUsers: 1247,
      pendingApprovals: 23,
      activeSubscriptions: 892,
      totalRevenue: 45678.50,
      basicSubscribers: 456,
      eliteSubscribers: 312,
      starSubscribers: 124,
    });
  }, []);

  const handleNavigate = (route: string) => {
    router.push(route as any);
  };

  if (Platform.OS !== 'web') {
    return (
      <View style={[commonStyles.container, styles.notWebContainer]}>
        <IconSymbol
          ios_icon_name="laptopcomputer"
          android_material_icon_name="computer"
          size={64}
          color={colors.textSecondary}
        />
        <Text style={styles.notWebTitle}>Admin Panel</Text>
        <Text style={styles.notWebText}>
          The admin panel is only accessible on a laptop or web browser. Please visit this page on
          a desktop computer to access the full admin dashboard.
        </Text>
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
          <Text style={styles.title}>Admin Dashboard</Text>
          <TouchableOpacity onPress={() => router.back()} style={styles.closeButton}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <IconSymbol
            ios_icon_name="magnifyingglass"
            android_material_icon_name="search"
            size={20}
            color={colors.textSecondary}
          />
          <TextInput
            style={styles.searchInput}
            placeholder="Search users by name, email, or ID..."
            placeholderTextColor={colors.textSecondary}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="person.3.fill"
              android_material_icon_name="group"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="clock.badge.exclamationmark"
              android_material_icon_name="pending_actions"
              size={32}
              color={colors.warning}
            />
            <Text style={styles.statValue}>{stats.pendingApprovals}</Text>
            <Text style={styles.statLabel}>Pending Approvals</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="checkmark.seal.fill"
              android_material_icon_name="verified"
              size={32}
              color={colors.success}
            />
            <Text style={styles.statValue}>{stats.activeSubscriptions}</Text>
            <Text style={styles.statLabel}>Active Subscriptions</Text>
          </View>

          <View style={styles.statCard}>
            <IconSymbol
              ios_icon_name="dollarsign.circle.fill"
              android_material_icon_name="attach_money"
              size={32}
              color={colors.primary}
            />
            <Text style={styles.statValue}>${stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
        </View>

        <View style={styles.subscriptionBreakdown}>
          <Text style={styles.sectionTitle}>Subscription Breakdown</Text>
          <View style={styles.breakdownCard}>
            <View style={styles.breakdownRow}>
              <View style={[styles.tierIndicator, { backgroundColor: '#6A5ACD' }]} />
              <Text style={styles.breakdownLabel}>Basic</Text>
              <Text style={styles.breakdownValue}>{stats.basicSubscribers}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={[styles.tierIndicator, { backgroundColor: '#9370DB' }]} />
              <Text style={styles.breakdownLabel}>Elite</Text>
              <Text style={styles.breakdownValue}>{stats.eliteSubscribers}</Text>
            </View>
            <View style={styles.breakdownRow}>
              <View style={[styles.tierIndicator, { backgroundColor: '#FFD700' }]} />
              <Text style={styles.breakdownLabel}>Star</Text>
              <Text style={styles.breakdownValue}>{stats.starSubscribers}</Text>
            </View>
          </View>
        </View>

        <View style={styles.actionsGrid}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/admin/pending-users')}
          >
            <IconSymbol
              ios_icon_name="person.badge.clock"
              android_material_icon_name="person_add"
              size={40}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Review Pending Users</Text>
            <Text style={styles.actionDescription}>
              Approve or reject new user applications
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/admin/user-management')}
          >
            <IconSymbol
              ios_icon_name="person.crop.circle.badge.checkmark"
              android_material_icon_name="manage_accounts"
              size={40}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>User Management</Text>
            <Text style={styles.actionDescription}>View, edit, or delete user profiles</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/admin/analytics')}
          >
            <IconSymbol
              ios_icon_name="chart.bar.fill"
              android_material_icon_name="analytics"
              size={40}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Analytics & Reports</Text>
            <Text style={styles.actionDescription}>
              View data by location, age, gender, and more
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/admin/email-campaigns')}
          >
            <IconSymbol
              ios_icon_name="envelope.fill"
              android_material_icon_name="email"
              size={40}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Email Campaigns</Text>
            <Text style={styles.actionDescription}>Collect and manage user emails</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/admin/payments')}
          >
            <IconSymbol
              ios_icon_name="creditcard.fill"
              android_material_icon_name="payment"
              size={40}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Payment Tracking</Text>
            <Text style={styles.actionDescription}>Monitor subscriptions and revenue</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => handleNavigate('/admin/notifications')}
          >
            <IconSymbol
              ios_icon_name="bell.badge.fill"
              android_material_icon_name="notifications_active"
              size={40}
              color={colors.primary}
            />
            <Text style={styles.actionTitle}>Push Notifications</Text>
            <Text style={styles.actionDescription}>Schedule and manage notifications</Text>
          </TouchableOpacity>
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
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
  },
  closeButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 24,
    gap: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 32,
  },
  statCard: {
    flex: 1,
    minWidth: 150,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 12,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 4,
    textAlign: 'center',
  },
  subscriptionBreakdown: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 16,
  },
  breakdownCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    gap: 16,
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  tierIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  breakdownLabel: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
    fontWeight: '500',
  },
  breakdownValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
  },
  actionCard: {
    flex: 1,
    minWidth: 200,
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 24,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  actionDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
  notWebContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  notWebTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 12,
  },
  notWebText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
