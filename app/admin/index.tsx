
import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

const adminSections = [
  {
    title: 'User Management',
    items: [
      {
        id: 'pending-users',
        title: 'Pending Approvals',
        description: 'Review and approve new user applications',
        icon: 'person.badge.clock',
        androidIcon: 'pending_actions',
        route: '/admin/pending-users',
      },
      {
        id: 'user-management',
        title: 'User Management',
        description: 'View, edit, and manage user profiles',
        icon: 'person.2',
        androidIcon: 'people',
        route: '/admin/user-management',
      },
    ],
  },
  {
    title: 'Analytics & Data',
    items: [
      {
        id: 'analytics',
        title: 'Analytics',
        description: 'View user data and engagement metrics',
        icon: 'chart.bar',
        androidIcon: 'analytics',
        route: '/admin/analytics',
      },
      {
        id: 'payments',
        title: 'Payments',
        description: 'Track subscriptions and revenue',
        icon: 'creditcard',
        androidIcon: 'payment',
        route: '/admin/payments',
      },
    ],
  },
  {
    title: 'Marketing & Engagement',
    items: [
      {
        id: 'email-campaigns',
        title: 'Email Campaigns',
        description: 'Create and manage email campaigns',
        icon: 'envelope',
        androidIcon: 'email',
        route: '/admin/email-campaigns',
      },
      {
        id: 'notifications',
        title: 'Push Notifications',
        description: 'Schedule and manage push notifications',
        icon: 'bell.badge',
        androidIcon: 'notifications',
        route: '/admin/notifications',
      },
      {
        id: 'promo-codes',
        title: 'Promo Codes',
        description: 'Create and manage promotional codes',
        icon: 'ticket',
        androidIcon: 'local_offer',
        route: '/admin/promo-codes',
      },
    ],
  },
];

export default function AdminDashboard() {
  return (
    <View style={commonStyles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Admin Dashboard</Text>
          <Text style={styles.subtitle}>Manage your Intentional community</Text>
        </View>

        {adminSections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            {section.items.map((item, itemIndex) => (
              <TouchableOpacity
                key={itemIndex}
                style={styles.card}
                onPress={() => router.push(item.route as any)}
              >
                <View style={styles.iconContainer}>
                  <IconSymbol
                    ios_icon_name={item.icon}
                    android_material_icon_name={item.androidIcon}
                    size={28}
                    color={colors.primary}
                  />
                </View>
                <View style={styles.cardContent}>
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <Text style={styles.cardDescription}>{item.description}</Text>
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
        ))}

        <View style={styles.infoCard}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={24}
            color={colors.primary}
          />
          <Text style={styles.infoText}>
            <Text style={styles.boldText}>Admin Features:{'\n'}</Text>
            - Manual review and approval of all new users{'\n'}
            - Badge verification management{'\n'}
            - Data analytics and reporting{'\n'}
            - Push notification scheduling{'\n'}
            - Promo code creation and management{'\n'}
            - Email campaign tools
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
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  cardContent: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  cardDescription: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  infoCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    alignItems: 'flex-start',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginLeft: 12,
  },
  boldText: {
    fontWeight: '600',
    color: colors.text,
  },
});
