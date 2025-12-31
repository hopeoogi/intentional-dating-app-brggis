
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { colors } from '@/styles/commonStyles';
import ProfileCard from '@/components/ProfileCard';
import { router } from 'expo-router';
import { useUsers } from '@/hooks/useUsers';

export default function HomeScreen() {
  const { users, loading, error } = useUsers();
  const [selectedUserIndex, setSelectedUserIndex] = useState(0);

  const handlePass = () => {
    if (selectedUserIndex < users.length - 1) {
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
    router.push({
      pathname: '/start-conversation',
      params: { userId: users[selectedUserIndex].id }
    });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Loading matches...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.errorText}>Error loading matches</Text>
        <Text style={styles.errorDetailText}>{error}</Text>
      </View>
    );
  }

  const selectedUser = users[selectedUserIndex];

  if (!selectedUser || users.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyText}>No matches available</Text>
        <Text style={styles.emptySubText}>Check back later for new connections!</Text>
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
          {selectedUserIndex + 1} / {users.length}
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
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
  errorText: {
    fontSize: 18,
    color: '#FF6B6B',
    textAlign: 'center',
    marginBottom: 8,
  },
  errorDetailText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    paddingHorizontal: 32,
  },
  emptyText: {
    fontSize: 18,
    color: '#FFFFFF',
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 8,
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
