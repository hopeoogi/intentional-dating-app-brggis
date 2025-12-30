
export interface PricingTier {
  id: 'basic' | 'elite' | 'star';
  name: string;
  color: string;
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
    name: 'Basic Package',
    color: '#6A5ACD',
    features: [
      'One (1) verification badge in blue',
      'Maximum match range of 50 miles',
      '3 matches per day',
      'Basic status matches only',
      '3 new conversations per day',
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
    name: 'Elite Package',
    color: '#9370DB',
    features: [
      'Up to three (3) verification badges in purple',
      'Maximum match range of 100 miles',
      '15 matches per day',
      'Access to Elite status matches',
      '15 new conversations per day',
      'Advanced filters (height, body, ethnicity)',
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
    name: 'Star Package',
    color: '#FFD700',
    features: [
      'Up to six (6) verification badges in gold',
      'Maximum match range of 200 miles',
      '23 matches per day',
      'Access to Elite and Star status matches',
      '23 new conversations per day',
      'All advanced filters',
      'Priority support',
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
