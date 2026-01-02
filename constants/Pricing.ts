
export const PRICING_TIERS = {
  free: {
    id: 'free',
    name: 'Free',
    features: [
      '3 daily matches',
      'Basic status badges',
      'Standard messaging',
    ],
    monthly: 0,
    semiAnnual: 0,
    annual: 0,
  },
  premium: {
    id: 'premium',
    name: 'Premium',
    features: [
      '10 daily matches',
      'Elite status badges',
      'Priority matching',
      'See who viewed you',
    ],
    monthly: 29.99,
    semiAnnual: 149.99,
    annual: 249.99,
  },
  elite: {
    id: 'elite',
    name: 'Elite',
    features: [
      'Unlimited daily matches',
      'Star status badges',
      'VIP matching',
      'Advanced filters',
      'Profile boost',
    ],
    monthly: 49.99,
    semiAnnual: 249.99,
    annual: 449.99,
  },
};

export const STATUS_BADGES = {
  basic: [
    'Student',
    'Professional',
    'Entrepreneur',
  ],
  elite: [
    'Executive',
    'Doctor',
    'Lawyer',
    'Engineer',
    'Artist',
  ],
  star: [
    'CEO',
    'Founder',
    'Celebrity',
    'Athlete',
    'Influencer',
  ],
};
