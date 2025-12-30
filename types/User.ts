
export type StatusTier = 'basic' | 'elite' | 'star';

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
