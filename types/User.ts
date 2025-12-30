
export type StatusTier = 'basic' | 'elite' | 'star';
export type SubscriptionTier = 'basic' | 'elite' | 'star';

export interface StatusBadge {
  id: string;
  type: string;
  tier: StatusTier;
  verified: boolean;
  verificationDate?: Date;
  proofImageUrl?: string;
}

export interface UserPhoto {
  id: string;
  url: string;
  type: 'selfie' | 'fullbody' | 'activity';
  approved: boolean;
  uploadDate: Date;
}

export interface User {
  id: string;
  name: string;
  age: number;
  bio: string;
  location: {
    city: string;
    state: string;
    latitude?: number;
    longitude?: number;
  };
  photos: UserPhoto[];
  statusBadges: StatusBadge[];
  verified: boolean;
  onboardingComplete: boolean;
  createdAt: Date;
  lastActive: Date;
  subscriptionTier?: SubscriptionTier;
  preferences: {
    minAge: number;
    maxAge: number;
    maxDistance: number;
    interestedIn: string[];
  };
}

export interface Match {
  id: string;
  userId: string;
  matchedUserId: string;
  matchedUser: User;
  matchDate: Date;
  conversationStarted: boolean;
  conversationEnded: boolean;
  lastMessageDate?: Date;
}

export interface Message {
  id: string;
  matchId: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: Date;
  read: boolean;
}

export interface Conversation {
  id: string;
  matchId: string;
  match: Match;
  messages: Message[];
  lastMessage?: Message;
  mustRespond: boolean;
  respondBy?: Date;
  ended: boolean;
}

export function getLastActiveText(lastActive: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - lastActive.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) {
    return 'Active now';
  } else if (diffMins < 60) {
    return `Active ${diffMins}m ago`;
  } else if (diffHours < 24) {
    return `Active ${diffHours}h ago`;
  } else if (diffDays === 1) {
    return 'Active yesterday';
  } else if (diffDays < 7) {
    return `Active ${diffDays}d ago`;
  } else {
    return 'Active over a week ago';
  }
}

export function isActiveUser(lastActive: Date): boolean {
  const now = new Date();
  const diffMs = now.getTime() - lastActive.getTime();
  const diffDays = Math.floor(diffMs / 86400000);
  return diffDays < 7;
}
