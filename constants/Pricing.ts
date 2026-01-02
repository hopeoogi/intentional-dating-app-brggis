
export interface PricingTier {
  id: 'basic' | 'elite' | 'star';
  name: string;
  color: string;
  dailyMatches: number;
  dailyConversations: number;
  maxDistance: number;
  features: string[];
  plans: {
    monthly: {
      price: number;
      period: string;
      productId: string;
    };
    semiAnnual: {
      price: number;
      monthlyPrice: number;
      period: string;
      discount: number;
      productId: string;
    };
    annual: {
      price: number;
      monthlyPrice: number;
      period: string;
      discount: number;
      productId: string;
    };
  };
}

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'basic',
    name: 'Basic',
    color: '#6A5ACD',
    dailyMatches: 3,
    dailyConversations: 3,
    maxDistance: 50,
    features: [
      '3 matches per day',
      '3 new conversations per day',
      'Maximum match range of 50 miles',
      'Basic filters',
    ],
    plans: {
      monthly: {
        price: 15.00,
        period: '30 Days',
        productId: 'intentional_basic_monthly',
      },
      semiAnnual: {
        price: 70.20,
        monthlyPrice: 11.70,
        period: '6 months',
        discount: 22,
        productId: 'intentional_basic_semiannual',
      },
      annual: {
        price: 100.80,
        monthlyPrice: 8.40,
        period: '12 months',
        discount: 44,
        productId: 'intentional_basic_annual',
      },
    },
  },
  {
    id: 'elite',
    name: 'Elite',
    color: '#9370DB',
    dailyMatches: 15,
    dailyConversations: 15,
    maxDistance: 100,
    features: [
      '15 matches per day',
      '15 new conversations per day',
      'Maximum match range of 100 miles',
      'Advanced filters (height, body, ethnicity)',
      'Priority support',
    ],
    plans: {
      monthly: {
        price: 80.00,
        period: '30 Days',
        productId: 'intentional_elite_monthly',
      },
      semiAnnual: {
        price: 374.40,
        monthlyPrice: 62.40,
        period: '6 months',
        discount: 22,
        productId: 'intentional_elite_semiannual',
      },
      annual: {
        price: 537.60,
        monthlyPrice: 44.80,
        period: '12 months',
        discount: 44,
        productId: 'intentional_elite_annual',
      },
    },
  },
  {
    id: 'star',
    name: 'Star',
    color: '#FFD700',
    dailyMatches: 23,
    dailyConversations: 23,
    maxDistance: 200,
    features: [
      '23 matches per day',
      '23 new conversations per day',
      'Maximum match range of 200 miles',
      'All advanced filters',
      'Priority support',
      'Early access to new features',
    ],
    plans: {
      monthly: {
        price: 250.00,
        period: '30 Days',
        productId: 'intentional_star_monthly',
      },
      semiAnnual: {
        price: 1170.00,
        monthlyPrice: 195.00,
        period: '6 months',
        discount: 22,
        productId: 'intentional_star_semiannual',
      },
      annual: {
        price: 1680.00,
        monthlyPrice: 140.00,
        period: '12 months',
        discount: 44,
        productId: 'intentional_star_annual',
      },
    },
  },
];
