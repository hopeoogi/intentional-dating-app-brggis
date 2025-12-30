
import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { colors, commonStyles } from '@/styles/commonStyles';
import { mockUsers, mockConversations } from '@/data/mockData';
import ProfileCard from '@/components/ProfileCard';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

export default function HomeScreen() {
  const [dailyMatches] = useState(mockUsers);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);
  const activeConversations = mockConversations.filter((c) => !c.ended);

  const handleStartConversation = () => {
    if (activeConversations.length > 0) {
      Alert.alert(
        'Clear Conversations First',
        'You must clear your active conversations before starting new ones. Reply to pending messages or end conversations to continue.',
        [{ text: 'OK' }]
      );
      return;
    }
    router.push('/start-conversation');
  };

  const handleViewProfile = () => {
    router.push('/profile-detail');
  };

  const handlePass = () => {
    if (selectedUserIndex < dailyMatches.length - 1) {
      setSelectedUserIndex(selectedUserIndex + 1);
    } else {
      Alert.alert('No More Matches', 'Check back tomorrow for new matches!');
    }
  };

  const selectedUser = dailyMatches[selectedUserIndex];

  return (
    <View style={commonStyles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Today&apos;s Matches</Text>
          <Text style={styles.subtitle}>
            {dailyMatches.length} intentional connections
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
                Clear your {activeConversations.length} conversation{activeConversations.length > 1 ? 's' : ''} to view new matches
              </Text>
            </View>
          </View>
        )}

        <View style={styles.cardContainer}>
          {selectedUser && (
            <ProfileCard
              user={selectedUser}
              onPress={handleViewProfile}
              onMessagePress={handleStartConversation}
              onPassPress={handlePass}
              showDistance
              distance={Math.floor(Math.random() * 20) + 5}
            />
          )}
        </View>

        <View style={styles.matchCounter}>
          <Text style={styles.matchCounterText}>
            {selectedUserIndex + 1} of {dailyMatches.length}
          </Text>
        </View>

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
    marginBottom: 24,
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
  cardContainer: {
    alignItems: 'center',
    marginBottom: 16,
  },
  matchCounter: {
    alignItems: 'center',
    marginBottom: 24,
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
