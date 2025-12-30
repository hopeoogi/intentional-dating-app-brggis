
export type SubscriptionTier = 'basic' | 'elite' | 'star';

export interface MatchFilters {
  maxDistance: number;
  selectedStatuses: string[];
  maxStatuses: number;
  ageRange: {
    min: number;
    max: number;
  };
  height?: {
    min: number;
    max: number;
  };
  bodyPreference?: string[];
  ethnicity?: string[];
  allowedTiers: SubscriptionTier[];
}

export interface SubscriptionLimits {
  tier: SubscriptionTier;
  maxDistance: number;
  maxStatuses: number;
  dailyMatches: number;
  dailyConversations: number;
  allowedMatchTiers: SubscriptionTier[];
  hasAdvancedFilters: boolean;
}

export const SUBSCRIPTION_LIMITS: Record<SubscriptionTier, SubscriptionLimits> = {
  basic: {
    tier: 'basic',
    maxDistance: 50,
    maxStatuses: 5,
    dailyMatches: 3,
    dailyConversations: 3,
    allowedMatchTiers: ['basic'],
    hasAdvancedFilters: false,
  },
  elite: {
    tier: 'elite',
    maxDistance: 100,
    maxStatuses: 8,
    dailyMatches: 15,
    dailyConversations: 15,
    allowedMatchTiers: ['basic', 'elite'],
    hasAdvancedFilters: true,
  },
  star: {
    tier: 'star',
    maxDistance: 200,
    maxStatuses: 10,
    dailyMatches: 23,
    dailyConversations: 23,
    allowedMatchTiers: ['basic', 'elite', 'star'],
    hasAdvancedFilters: true,
  },
};

export const AVAILABLE_STATUSES = [
  'Student',
  'Model',
  'Doctor',
  'Businessperson',
  'CEO',
  'Lawyer',
  'Engineer',
  'Designer',
  'Entrepreneur',
  'Artist',
  'Athlete',
  'Teacher',
  'Nurse',
  'Photographer',
  'Writer',
  'Musician',
  'Chef',
  'Architect',
  'Consultant',
  'Analyst',
];

export const BODY_PREFERENCES = [
  'Athletic',
  'Slim',
  'Average',
  'Curvy',
  'Muscular',
  'Plus Size',
];

export const ETHNICITIES = [
  'Asian',
  'Black',
  'Hispanic/Latino',
  'Middle Eastern',
  'Native American',
  'Pacific Islander',
  'White',
  'Mixed',
  'Other',
];
