
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, Dimensions } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { mockUsers, mockConversations } from '@/data/mockData';
import ProfileCard from '@/components/ProfileCard';
import { router } from 'expo-router';

const { height } = Dimensions.get('window');

export default function HomeScreen() {
  const [dailyMatches] = useState(mockUsers);
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const handlePass = () => {
    if (selectedUserIndex < dailyMatches.length - 1) {
      setSelectedUserIndex(selectedUserIndex + 1);
    } else {
      Alert.alert(
        'No More Matches',
        'You&apos;ve viewed all your matches for today. Check back tomorrow for new connections!',
        [{ text: 'OK' }]
      );
    }
  };

  const handleMessage = () => {
    // Removed double messaging restriction - users can now start conversations freely
    router.push({
      pathname: '/start-conversation',
      params: { userId: dailyMatches[selectedUserIndex].id }
    });
  };

  const selectedUser = dailyMatches[selectedUserIndex];

  if (!selectedUser) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>No matches available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ProfileCard
        user={selectedUser}
        onPass={handlePass}
        onMessage={handleMessage}
        showActions={true}
      />
      
      <View style={styles.matchCounter}>
        <Text style={styles.matchCounterText}>
          {selectedUserIndex + 1} / {dailyMatches.length}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  matchCounter: {
    position: 'absolute',
    top: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 10,
  },
  matchCounterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
});
