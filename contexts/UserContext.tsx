
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@/types/User';
import { MatchFilters, SubscriptionTier, SUBSCRIPTION_LIMITS } from '@/types/MatchFilters';
import { currentUser as mockCurrentUser } from '@/data/mockData';
import AsyncStorage from '@react-native-async-storage/async-storage';

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

  useEffect(() => {
    loadUserPreferences();
  }, []);

  const loadUserPreferences = async () => {
    try {
      const savedTier = await AsyncStorage.getItem('subscriptionTier');
      const savedFilters = await AsyncStorage.getItem('matchFilters');
      
      if (savedTier) {
        const tier = savedTier as SubscriptionTier;
        setSubscriptionTier(tier);
        updateFiltersForTier(tier);
      }
      
      if (savedFilters) {
        setMatchFilters(JSON.parse(savedFilters));
      }
    } catch (error) {
      console.error('Error loading user preferences:', error);
    }
  };

  const updateFiltersForTier = (tier: SubscriptionTier) => {
    const limits = SUBSCRIPTION_LIMITS[tier];
    setMatchFilters((prev) => ({
      ...prev,
      maxDistance: Math.min(prev.maxDistance, limits.maxDistance),
      maxStatuses: limits.maxStatuses,
      allowedTiers: limits.allowedMatchTiers,
    }));
  };

  const updateMatchFilters = async (filters: Partial<MatchFilters>) => {
    const newFilters = { ...matchFilters, ...filters };
    setMatchFilters(newFilters);
    
    try {
      await AsyncStorage.setItem('matchFilters', JSON.stringify(newFilters));
    } catch (error) {
      console.error('Error saving match filters:', error);
    }
  };

  const updateSubscriptionTier = async (tier: SubscriptionTier) => {
    setSubscriptionTier(tier);
    updateFiltersForTier(tier);
    
    try {
      await AsyncStorage.setItem('subscriptionTier', tier);
    } catch (error) {
      console.error('Error saving subscription tier:', error);
    }
  };

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
