
import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { User } from '@/types/User';
import { MatchFilters, SubscriptionTier, SUBSCRIPTION_LIMITS } from '@/types/MatchFilters';
import { currentUser as mockCurrentUser } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface UserContextType {
  currentUser: User | null;
  subscriptionTier: SubscriptionTier;
  matchFilters: MatchFilters;
  updateMatchFilters: (filters: Partial<MatchFilters>) => void;
  updateSubscriptionTier: (tier: SubscriptionTier) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export function UserProvider({ children }: { children: ReactNode }) {
  const [currentUser] = useState<User>(mockCurrentUser);
  const [subscriptionTier, setSubscriptionTier] = useState<SubscriptionTier>('basic');
  const [matchFilters, setMatchFilters] = useState<MatchFilters>({
    maxDistance: 50,
    selectedStatuses: [],
    maxStatuses: 5,
    ageRange: { min: 24, max: 35 },
    allowedTiers: ['basic'],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const updateFiltersForTier = useCallback((tier: SubscriptionTier) => {
    try {
      const limits = SUBSCRIPTION_LIMITS[tier];
      setMatchFilters((prev) => ({
        ...prev,
        maxDistance: Math.min(prev.maxDistance, limits.maxDistance),
        maxStatuses: limits.maxStatuses,
        allowedTiers: limits.allowedMatchTiers,
      }));
    } catch (error) {
      console.error('[UserContext] Error updating filters for tier:', error);
    }
  }, []);

  const loadUserPreferences = useCallback(async () => {
    try {
      console.log('[UserContext] Loading user preferences...');
      
      // Add timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Timeout loading preferences')), 5000)
      );
      
      const loadPromise = Promise.all([
        AsyncStorage.getItem('subscriptionTier').catch(() => null),
        AsyncStorage.getItem('matchFilters').catch(() => null),
      ]);
      
      const [savedTier, savedFilters] = await Promise.race([
        loadPromise,
        timeoutPromise,
      ]) as [string | null, string | null];
      
      if (savedTier) {
        const tier = savedTier as SubscriptionTier;
        console.log('[UserContext] Loaded subscription tier:', tier);
        setSubscriptionTier(tier);
        updateFiltersForTier(tier);
      }
      
      if (savedFilters) {
        console.log('[UserContext] Loaded match filters');
        setMatchFilters(JSON.parse(savedFilters));
      }
      
      console.log('[UserContext] User preferences loaded successfully');
    } catch (error) {
      console.error('[UserContext] Error loading user preferences:', error);
      setHasError(true);
      // Continue with defaults instead of crashing
    } finally {
      setIsLoading(false);
    }
  }, [updateFiltersForTier]);

  useEffect(() => {
    loadUserPreferences();
  }, [loadUserPreferences]);

  const updateMatchFilters = useCallback(async (filters: Partial<MatchFilters>) => {
    try {
      const newFilters = { ...matchFilters, ...filters };
      setMatchFilters(newFilters);
      
      await AsyncStorage.setItem('matchFilters', JSON.stringify(newFilters));
      console.log('[UserContext] Match filters updated');
    } catch (error) {
      console.error('[UserContext] Error saving match filters:', error);
      // Don't crash, just log the error
    }
  }, [matchFilters]);

  const updateSubscriptionTier = useCallback(async (tier: SubscriptionTier) => {
    try {
      setSubscriptionTier(tier);
      updateFiltersForTier(tier);
      
      await AsyncStorage.setItem('subscriptionTier', tier);
      console.log('[UserContext] Subscription tier updated:', tier);
    } catch (error) {
      console.error('[UserContext] Error saving subscription tier:', error);
      // Don't crash, just log the error
    }
  }, [updateFiltersForTier]);

  // Show loading indicator while preferences are loading
  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  // If there was an error, still render children with defaults
  if (hasError) {
    console.warn('[UserContext] Rendering with default values due to error');
  }

  return (
    <UserContext.Provider
      value={{
        currentUser,
        subscriptionTier,
        matchFilters,
        updateMatchFilters,
        updateSubscriptionTier,
      }}
    >
      {children}
    </UserContext.Provider>
  );
}

export function useUser() {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
});
