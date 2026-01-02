
import { colors, commonStyles } from '@/styles/commonStyles';
import React, { useState, useEffect, useCallback } from 'react';
import { IconSymbol } from '@/components/IconSymbol';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { router } from 'expo-router';
import { api } from '@/lib/api-client';

interface DashboardStats {
  totalUsers: number;
  pendingUsers: number;
  activeSubscriptions: number;
  totalRevenue: number;
  dailyActiveUsers: number;
  monthlyActiveUsers: number;
  conversionRate: number;
  averageRevenuePerUser: number;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerTitle: {
    fontSize: 34,
    fontWeight: 'bold',
    color: colors.text,
  },
  headerSubtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginTop: 4,
  },
  content: {
    padding: 20,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    minWidth: '47%',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 16,
  },
  menuGrid: {
    gap: 12,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  menuIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.primary + '20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  menuDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default function AdminDashboard() {
  useEffect(() => {
    checkAdminStatus();
  }, []);

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    pendingUsers: 0,
    activeSubscriptions: 0,
    totalRevenue: 0,
    dailyActiveUsers: 0,
    monthlyActiveUsers: 0,
    conversionRate: 0,
    averageRevenuePerUser: 0,
  });

  const checkAdminStatus = useCallback(async () => {
    // TODO: Backend Integration - Check if user is admin
    console.log('[Admin] Checking admin status');
    loadDashboardStats();
  }, []);

  const loadDashboardStats = async () => {
    setLoading(true);
    // TODO: Backend Integration - Fetch dashboard stats from backend API
    const { data, error } = await api.admin.getDashboardStats();
    setLoading(false);

    if (error) {
      Alert.alert('Error', 'Failed to load dashboard stats');
      console.error('[Admin] Error loading stats:', error);
    } else if (data) {
      setStats(data);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Admin Portal</Text>
        <Text style={styles.headerSubtitle}>Intentional Dating App</Text>
      </View>

      <ScrollView style={styles.content}>
        <Text style={styles.sectionTitle}>Overview</Text>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.totalUsers}</Text>
            <Text style={styles.statLabel}>Total Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.pendingUsers}</Text>
            <Text style={styles.statLabel}>Pending Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.activeSubscriptions}</Text>
            <Text style={styles.statLabel}>Active Subscriptions</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${stats.totalRevenue.toFixed(0)}</Text>
            <Text style={styles.statLabel}>Total Revenue</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.dailyActiveUsers}</Text>
            <Text style={styles.statLabel}>Daily Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.monthlyActiveUsers}</Text>
            <Text style={styles.statLabel}>Monthly Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{stats.conversionRate.toFixed(1)}%</Text>
            <Text style={styles.statLabel}>Conversion Rate</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>${stats.averageRevenuePerUser.toFixed(0)}</Text>
            <Text style={styles.statLabel}>ARPU</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Management</Text>
        <View style={styles.menuGrid}>
          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/pending-users')}
          >
            <View style={styles.menuIcon}>
              <IconSymbol
                ios_icon_name="person.badge.clock"
                android_material_icon_name="person"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Pending Users</Text>
              <Text style={styles.menuDescription}>
                Review and approve new applications
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/promo-codes')}
          >
            <View style={styles.menuIcon}>
              <IconSymbol
                ios_icon_name="tag.fill"
                android_material_icon_name="local-offer"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Promo Codes</Text>
              <Text style={styles.menuDescription}>
                Create and manage promotional codes
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/notifications')}
          >
            <View style={styles.menuIcon}>
              <IconSymbol
                ios_icon_name="bell.fill"
                android_material_icon_name="notifications"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Notifications</Text>
              <Text style={styles.menuDescription}>
                Manage notification templates and campaigns
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.menuItem}
            onPress={() => router.push('/admin/intro-video')}
          >
            <View style={styles.menuIcon}>
              <IconSymbol
                ios_icon_name="play.rectangle.fill"
                android_material_icon_name="play-arrow"
                size={24}
                color={colors.primary}
              />
            </View>
            <View style={styles.menuContent}>
              <Text style={styles.menuTitle}>Intro Video</Text>
              <Text style={styles.menuDescription}>
                Configure welcome video settings
              </Text>
            </View>
            <IconSymbol
              ios_icon_name="chevron.right"
              android_material_icon_name="arrow-forward"
              size={20}
              color={colors.textSecondary}
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}
