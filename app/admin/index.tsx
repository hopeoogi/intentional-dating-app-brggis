
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';

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

export default function AdminDashboard() {
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
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  const checkAdminStatus = useCallback(async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        Alert.alert('Access Denied', 'You must be logged in to access the admin portal.');
        router.back();
        return;
      }

      // Check if user is an admin
      const { data: adminData, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('auth_user_id', user.id)
        .eq('active', true)
        .single();

      if (error || !adminData) {
        Alert.alert('Access Denied', 'You do not have admin privileges.');
        router.back();
        return;
      }

      setIsAdmin(true);
      loadDashboardStats();
    } catch (error) {
      console.error('Error checking admin status:', error);
      Alert.alert('Error', 'Failed to verify admin access.');
      router.back();
    }
  }, []);

  useEffect(() => {
    checkAdminStatus();
  }, [checkAdminStatus]);

  const loadDashboardStats = async () => {
    try {
      // Get total users
      const { count: totalUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true });

      // Get pending users
      const { count: pendingUsers } = await supabase
        .from('pending_users')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');

      // Get active subscriptions
      const { count: activeSubscriptions } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .eq('subscription_status', 'active');

      // Get total revenue
      const { data: invoices } = await supabase
        .from('invoices')
        .select('amount')
        .eq('status', 'paid');

      const totalRevenue = invoices?.reduce((sum, inv) => sum + Number(inv.amount), 0) || 0;

      // Get daily active users (last 24 hours)
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const { count: dailyActiveUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', yesterday.toISOString());

      // Get monthly active users (last 30 days)
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      
      const { count: monthlyActiveUsers } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
        .gte('last_active', thirtyDaysAgo.toISOString());

      // Calculate conversion rate
      const conversionRate = totalUsers && pendingUsers 
        ? ((totalUsers / (totalUsers + pendingUsers)) * 100)
        : 0;

      // Calculate ARPU
      const averageRevenuePerUser = totalUsers ? (totalRevenue / totalUsers) : 0;

      setStats({
        totalUsers: totalUsers || 0,
        pendingUsers: pendingUsers || 0,
        activeSubscriptions: activeSubscriptions || 0,
        totalRevenue,
        dailyActiveUsers: dailyActiveUsers || 0,
        monthlyActiveUsers: monthlyActiveUsers || 0,
        conversionRate,
        averageRevenuePerUser,
      });
    } catch (error) {
      console.error('Error loading dashboard stats:', error);
      Alert.alert('Error', 'Failed to load dashboard statistics.');
    } finally {
      setLoading(false);
    }
  };

  if (!isAdmin) {
    return null;
  }

  if (loading) {
    return (
      <View style={[commonStyles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading admin dashboard...</Text>
      </View>
    );
  }

  const adminMenuItems = [
    {
      title: 'Pending Users',
      description: 'Review and approve new applications',
      icon: 'person.badge.clock',
      androidIcon: 'pending_actions',
      route: '/admin/pending-users',
      badge: stats.pendingUsers,
      color: '#FF9500',
    },
    {
      title: 'Intro Video',
      description: 'Manage intro/loading screen',
      icon: 'play.rectangle.fill',
      androidIcon: 'video_library',
      route: '/admin/intro-video',
      color: '#FF2D55',
    },
    {
      title: 'User Management',
      description: 'View and manage all users',
      icon: 'person.3.fill',
      androidIcon: 'people',
      route: '/admin/user-management',
      color: '#007AFF',
    },
    {
      title: 'Analytics',
      description: 'View detailed analytics and reports',
      icon: 'chart.bar.fill',
      androidIcon: 'analytics',
      route: '/admin/analytics',
      color: '#34C759',
    },
    {
      title: 'Notifications',
      description: 'Manage push notifications',
      icon: 'bell.badge.fill',
      androidIcon: 'notifications',
      route: '/admin/notifications',
      color: '#FF3B30',
    },
    {
      title: 'Promo Codes',
      description: 'Create and manage promo codes',
      icon: 'tag.fill',
      androidIcon: 'local_offer',
      route: '/admin/promo-codes',
      color: '#AF52DE',
    },
    {
      title: 'Payments',
      description: 'View transactions and subscriptions',
      icon: 'creditcard.fill',
      androidIcon: 'payment',
      route: '/admin/payments',
      color: '#5AC8FA',
    },
    {
      title: 'Email Campaigns',
      description: 'Manage email marketing',
      icon: 'envelope.fill',
      androidIcon: 'email',
      route: '/admin/email-campaigns',
      color: '#FFCC00',
    },
  ];

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
          <Text style={styles.title}>Admin Portal</Text>
          <TouchableOpacity onPress={loadDashboardStats} style={styles.refreshButton}>
            <IconSymbol
              ios_icon_name="arrow.clockwise"
              android_material_icon_name="refresh"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.subtitle}>Dashboard Overview</Text>

        {/* Key Metrics */}
        <View style={styles.metricsGrid}>
          <View style={[styles.metricCard, { backgroundColor: '#007AFF15' }]}>
            <IconSymbol
              ios_icon_name="person.3.fill"
              android_material_icon_name="people"
              size={32}
              color="#007AFF"
            />
            <Text style={styles.metricValue}>{stats.totalUsers}</Text>
            <Text style={styles.metricLabel}>Total Users</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#FF950015' }]}>
            <IconSymbol
              ios_icon_name="clock.fill"
              android_material_icon_name="schedule"
              size={32}
              color="#FF9500"
            />
            <Text style={styles.metricValue}>{stats.pendingUsers}</Text>
            <Text style={styles.metricLabel}>Pending</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#34C75915' }]}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={32}
              color="#34C759"
            />
            <Text style={styles.metricValue}>{stats.activeSubscriptions}</Text>
            <Text style={styles.metricLabel}>Active Subs</Text>
          </View>

          <View style={[styles.metricCard, { backgroundColor: '#5AC8FA15' }]}>
            <IconSymbol
              ios_icon_name="dollarsign.circle.fill"
              android_material_icon_name="attach_money"
              size={32}
              color="#5AC8FA"
            />
            <Text style={styles.metricValue}>${stats.totalRevenue.toLocaleString()}</Text>
            <Text style={styles.metricLabel}>Revenue</Text>
          </View>
        </View>

        {/* Engagement Metrics */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Engagement</Text>
          <View style={styles.engagementCard}>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Daily Active Users</Text>
              <Text style={styles.engagementValue}>{stats.dailyActiveUsers}</Text>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Monthly Active Users</Text>
              <Text style={styles.engagementValue}>{stats.monthlyActiveUsers}</Text>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>Conversion Rate</Text>
              <Text style={styles.engagementValue}>{stats.conversionRate.toFixed(1)}%</Text>
            </View>
            <View style={styles.engagementRow}>
              <Text style={styles.engagementLabel}>ARPU</Text>
              <Text style={styles.engagementValue}>${stats.averageRevenuePerUser.toFixed(2)}</Text>
            </View>
          </View>
        </View>

        {/* Admin Menu */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Admin Tools</Text>
          {adminMenuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => router.push(item.route as any)}
            >
              <View style={[styles.menuIconContainer, { backgroundColor: item.color + '15' }]}>
                <IconSymbol
                  ios_icon_name={item.icon}
                  android_material_icon_name={item.androidIcon}
                  size={24}
                  color={item.color}
                />
              </View>
              <View style={styles.menuContent}>
                <View style={styles.menuTitleRow}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  {item.badge !== undefined && item.badge > 0 && (
                    <View style={[styles.badge, { backgroundColor: item.color }]}>
                      <Text style={styles.badgeText}>{item.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.menuDescription}>{item.description}</Text>
              </View>
              <IconSymbol
                ios_icon_name="chevron.right"
                android_material_icon_name="chevron_right"
                size={20}
                color={colors.textSecondary}
              />
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Admin Portal Features:{'\n\n'}</Text>
            - Review and approve new user applications{'\n'}
            - Manage user profiles and subscriptions{'\n'}
            - View detailed analytics and reports{'\n'}
            - Send push notifications to users{'\n'}
            - Create and manage promo codes{'\n'}
            - Monitor payments and revenue{'\n'}
            - Run email marketing campaigns{'\n\n'}
            For detailed documentation, see ADMIN_PORTAL_OVERVIEW.md
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
    marginBottom: 12,
  },
  backButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  refreshButton: {
    width: 44,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 24,
  },
  metricCard: {
    flex: 1,
    minWidth: '47%',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.text,
    marginTop: 8,
  },
  metricLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  engagementCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
  },
  engagementRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  engagementLabel: {
    fontSize: 15,
    color: colors.text,
  },
  engagementValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  menuIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  menuContent: {
    flex: 1,
  },
  menuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  menuDescription: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  infoBox: {
    backgroundColor: colors.primary + '10',
    borderRadius: 16,
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
