
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockUsers, mockConversations } from '@/data/mockData';
import { User, isActiveUser } from '@/types/User';
import ProfileCard from '@/components/ProfileCard';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';
import { useUser } from '@/contexts/UserContext';
import { SUBSCRIPTION_LIMITS } from '@/types/MatchFilters';

export default function HomeScreen() {
  const { subscriptionTier, matchFilters } = useUser();
  const limits = SUBSCRIPTION_LIMITS[subscriptionTier];
  
  const [dailyMatches, setDailyMatches] = useState<User[]>([]);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const activeConversations = mockConversations.filter((c) => !c.ended);

  useEffect(() => {
    console.log('HomeScreen mounted');
    console.log('Subscription tier:', subscriptionTier);
    console.log('Match filters:', matchFilters);
    
    const filteredMatches = mockUsers.filter((user) => {
      if (!isActiveUser(user.lastActive)) {
        return false;
      }

      const userTier = user.subscriptionTier || 'basic';
      if (!matchFilters.allowedTiers.includes(userTier)) {
        return false;
      }

      if (matchFilters.selectedStatuses.length > 0) {
        const hasMatchingStatus = user.statusBadges.some((badge) =>
          matchFilters.selectedStatuses.includes(badge.type)
        );
        if (!hasMatchingStatus) {
          return false;
        }
      }

      if (user.age < matchFilters.ageRange.min || user.age > matchFilters.ageRange.max) {
        return false;
      }

      return true;
    });

    const limitedMatches = filteredMatches.slice(0, limits.dailyMatches);
    console.log('Daily matches count:', limitedMatches.length);
    setDailyMatches(limitedMatches);
  }, [subscriptionTier, matchFilters]);

  const handleStartConversation = () => {
    console.log('Start conversation pressed');
    if (activeConversations.length >= limits.dailyConversations) {
      Alert.alert(
        'Conversation Limit Reached',
        `You can only have ${limits.dailyConversations} active conversations with your ${subscriptionTier} subscription. Clear some conversations to start new ones.`,
        [{ text: 'OK' }]
      );
      return;
    }
    router.push('/start-conversation');
  };

  const handleViewProfile = () => {
    console.log('View profile pressed');
    router.push('/profile-detail');
  };

  const handlePass = () => {
    console.log('Pass pressed');
    if (selectedUserIndex < dailyMatches.length - 1) {
      setSelectedUserIndex(selectedUserIndex + 1);
    } else {
      Alert.alert(
        'No More Matches',
        'You have viewed all your matches for today. Check back tomorrow for more!',
        [{ text: 'OK' }]
      );
    }
  };

  const handleOpenFilters = () => {
    console.log('Open filters pressed');
    router.push('/match-filters');
  };

  const selectedUser = dailyMatches[selectedUserIndex];

  console.log('Rendering HomeScreen with', dailyMatches.length, 'matches');
  console.log('Selected user:', selectedUser?.name);

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Today&apos;s Matches</Text>
            <Text style={styles.subtitle}>
              {dailyMatches.length} of {limits.dailyMatches} intentional connections
            </Text>
          </View>
          <TouchableOpacity onPress={handleOpenFilters} style={styles.filterButton}>
            <IconSymbol
              ios_icon_name="slider.horizontal.3"
              android_material_icon_name="tune"
              size={24}
              color={colors.primary}
            />
          </TouchableOpacity>
        </View>

        <View style={styles.tierBadge}>
          <Text style={styles.tierBadgeText}>
            {subscriptionTier.toUpperCase()} TIER
          </Text>
        </View>

        {activeConversations.length > 0 && (
          <View style={styles.warningCard}>
            <IconSymbol
              ios_icon_name="exclamationmark.triangle.fill"
              android_material_icon_name="warning"
              size={24}
              color={colors.warning}
            />
            <View style={styles.warningText}>
              <Text style={styles.warningTitle}>Active Conversations</Text>
              <Text style={styles.warningSubtitle}>
                {activeConversations.length} of {limits.dailyConversations} conversation slots used
              </Text>
            </View>
          </View>
        )}

        {dailyMatches.length === 0 ? (
          <View style={styles.emptyState}>
            <IconSymbol
              ios_icon_name="magnifyingglass"
              android_material_icon_name="search"
              size={64}
              color={colors.textSecondary}
            />
            <Text style={styles.emptyTitle}>No Matches Found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters to see more potential matches
            </Text>
            <TouchableOpacity style={styles.adjustFiltersButton} onPress={handleOpenFilters}>
              <Text style={styles.adjustFiltersText}>Adjust Filters</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <React.Fragment>
            <View style={styles.cardContainer}>
              {selectedUser && (
                <ProfileCard
                  user={selectedUser}
                  onPress={handleViewProfile}
                  onMessagePress={handleStartConversation}
                  onPassPress={handlePass}
                  showDistance
                  distance={Math.floor(Math.random() * matchFilters.maxDistance) + 5}
                />
              )}
            </View>

            <View style={styles.matchCounter}>
              <Text style={styles.matchCounterText}>
                {selectedUserIndex + 1} of {dailyMatches.length}
              </Text>
            </View>
          </React.Fragment>
        )}

        <View style={styles.infoSection}>
          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="sparkles"
              android_material_icon_name="auto_awesome"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoTitle}>No Swiping</Text>
            <Text style={styles.infoText}>
              Start a meaningful conversation (36+ characters) to show interest
            </Text>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="checkmark.shield.fill"
              android_material_icon_name="verified_user"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoTitle}>Verified Community</Text>
            <Text style={styles.infoText}>
              Every member is manually verified by our team
            </Text>
          </View>

          <View style={styles.infoCard}>
            <IconSymbol
              ios_icon_name="clock.fill"
              android_material_icon_name="schedule"
              size={24}
              color={colors.primary}
            />
            <Text style={styles.infoTitle}>Active Users Only</Text>
            <Text style={styles.infoText}>
              All matches have been active within the last 7 days
            </Text>
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
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
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: colors.card,
    justifyContent: 'center',
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  tierBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'center',
    marginBottom: 16,
  },
  tierBadgeText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
  },
  warningCard: {
    flexDirection: 'row',
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.warning,
  },
  warningText: {
    flex: 1,
    marginLeft: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 2,
  },
  warningSubtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
    marginTop: 24,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    paddingHorizontal: 40,
    lineHeight: 22,
  },
  adjustFiltersButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
  },
  adjustFiltersText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  matchCounter: {
    alignItems: 'center',
    marginBottom: 32,
  },
  matchCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  infoSection: {
    gap: 16,
    marginTop: 20,
  },
  infoCard: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
    elevation: 2,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 12,
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
  },
});
