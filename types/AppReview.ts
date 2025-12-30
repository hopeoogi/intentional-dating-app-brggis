
export interface AppUsageData {
  firstOpenDate: Date;
  daysUsed: number;
  hasRequestedReview: boolean;
  lastReviewRequestDate?: Date;
}

export const APP_REVIEW_THRESHOLD_DAYS = 2;
