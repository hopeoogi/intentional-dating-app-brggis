
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import ProfileCard from '@/components/ProfileCard';
import { router } from 'expo-router';
import { useUsers } from '@/hooks/useUsers';

export default function HomeScreen() {
  const { users, loading, error, refetch } = useUsers();
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
    const selectedUser = users[selectedUserIndex];
    if (selectedUser) {
      router.push({
        pathname: '/start-conversation',
        params: { userId: selectedUser.id }
      });
    }
  };

  const handleRetry = () => {
    console.log('[HomeScreen] Retrying fetch...');
    refetch();
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
        <Text style={styles.errorEmoji}>⚠️</Text>
        <Text style={styles.errorText}>Unable to load matches</Text>
        <Text style={styles.errorDetailText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (!users || users.length === 0) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyEmoji}>💫</Text>
        <Text style={styles.emptyText}>No matches available</Text>
        <Text style={styles.emptySubText}>
          Check back later for new connections!
          {'\n\n'}
          We&apos;re carefully curating your matches to ensure quality over quantity.
        </Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const selectedUser = users[selectedUserIndex];

  if (!selectedUser) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.emptyEmoji}>🤔</Text>
        <Text style={styles.emptyText}>Something went wrong</Text>
        <Text style={styles.emptySubText}>Unable to display this match</Text>
        <TouchableOpacity style={styles.retryButton} onPress={handleRetry}>
          <Text style={styles.retryButtonText}>Refresh</Text>
        </TouchableOpacity>
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
    padding: 32,
  },
  loadingText: {
    fontSize: 16,
    color: '#FFFFFF',
    marginTop: 16,
  },
  errorEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  errorText: {
    fontSize: 20,
    fontWeight: '600',
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
    marginBottom: 24,
  },
  emptyEmoji: {
    fontSize: 64,
    marginBottom: 16,
  },
  emptyText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#FFFFFF',
    textAlign: 'center',
    marginBottom: 8,
  },
  emptySubText: {
    fontSize: 14,
    color: '#FFFFFF',
    textAlign: 'center',
    opacity: 0.7,
    marginTop: 8,
    lineHeight: 20,
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: colors.primary,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginTop: 8,
  },
  retryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
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
