
export interface User {
  id: string;
  email: string;
  name: string;
  age: number;
  bio: string;
  photos: Photo[];
  statusBadges: StatusBadge[];
  location: {
    city: string;
    state: string;
  };
  preferences: {
    ageRange: [number, number];
    distance: number;
    genders: string[];
  };
  subscriptionTier: 'free' | 'premium' | 'elite';
  applicationStatus: 'pending' | 'approved' | 'rejected';
  createdAt: string;
  updatedAt: string;
}

export interface Photo {
  id: string;
  url: string;
  type: 'selfie' | 'full_body' | 'activity';
  approved: boolean;
  order: number;
}

export interface StatusBadge {
  id: string;
  status: string;
  tier: 'basic' | 'elite' | 'star';
  verified: boolean;
  proofUrl?: string;
  approvedAt?: string;
}

export interface Match {
  id: string;
  user: User;
  matchedAt: string;
  conversationStarted: boolean;
  conversationEnded: boolean;
  lastMessage?: Message;
}

export interface Conversation {
  id: string;
  matchId: string;
  user: User;
  messages: Message[];
  status: 'active' | 'ended';
  lastMessageAt: string;
  unreadCount: number;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  sentAt: string;
  read: boolean;
}

export interface Application {
  id: string;
  userId: string;
  name: string;
  email: string;
  age: number;
  bio: string;
  photos: {
    selfie?: string;
    fullBody?: string;
    activity1?: string;
    activity2?: string;
    activity3?: string;
  };
  statusBadges: {
    status: string;
    tier: 'basic' | 'elite' | 'star';
    proofUrl: string;
  }[];
  status: 'pending' | 'approved' | 'rejected';
  rejectionReason?: string;
  submittedAt: string;
  reviewedAt?: string;
}
