
import { User, Match, Conversation, Message, StatusBadge } from '@/types/User';

export const currentUserId = 'user-1';

export const mockStatusBadges: StatusBadge[] = [
  {
    id: 'badge-1',
    type: 'Student',
    tier: 'basic',
    verified: true,
    verificationDate: new Date('2024-01-15'),
  },
  {
    id: 'badge-2',
    type: 'Entrepreneur',
    tier: 'elite',
    verified: true,
    verificationDate: new Date('2024-02-01'),
  },
];

export const mockUsers: User[] = [
  {
    id: 'user-2',
    name: 'Emma',
    age: 26,
    bio: 'Coffee enthusiast, bookworm, and adventure seeker. Looking for someone who can keep up with deep conversations and spontaneous road trips.',
    location: {
      city: 'San Francisco',
      state: 'CA',
    },
    photos: [
      {
        id: 'photo-1',
        url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=800',
        type: 'selfie',
        approved: true,
        uploadDate: new Date('2024-01-10'),
      },
      {
        id: 'photo-2',
        url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800',
        type: 'fullbody',
        approved: true,
        uploadDate: new Date('2024-01-10'),
      },
      {
        id: 'photo-3',
        url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=800',
        type: 'activity',
        approved: true,
        uploadDate: new Date('2024-01-10'),
      },
    ],
    statusBadges: [
      {
        id: 'badge-3',
        type: 'Designer',
        tier: 'elite',
        verified: true,
        verificationDate: new Date('2024-01-20'),
      },
      {
        id: 'badge-4',
        type: 'Yoga Instructor',
        tier: 'basic',
        verified: true,
        verificationDate: new Date('2024-01-25'),
      },
    ],
    verified: true,
    onboardingComplete: true,
    createdAt: new Date('2024-01-01'),
    lastActive: new Date(Date.now() - 2 * 60 * 60 * 1000),
    subscriptionTier: 'elite',
    preferences: {
      minAge: 24,
      maxAge: 35,
      maxDistance: 50,
      interestedIn: ['men'],
    },
  },
  {
    id: 'user-3',
    name: 'Sophia',
    age: 28,
    bio: 'Tech professional by day, artist by night. Love exploring new restaurants and hiking trails. Seeking genuine connections.',
    location: {
      city: 'San Francisco',
      state: 'CA',
    },
    photos: [
      {
        id: 'photo-4',
        url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=800',
        type: 'selfie',
        approved: true,
        uploadDate: new Date('2024-01-12'),
      },
      {
        id: 'photo-5',
        url: 'https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=800',
        type: 'fullbody',
        approved: true,
        uploadDate: new Date('2024-01-12'),
      },
      {
        id: 'photo-6',
        url: 'https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=800',
        type: 'activity',
        approved: true,
        uploadDate: new Date('2024-01-12'),
      },
    ],
    statusBadges: [
      {
        id: 'badge-5',
        type: 'Engineer',
        tier: 'star',
        verified: true,
        verificationDate: new Date('2024-01-18'),
      },
    ],
    verified: true,
    onboardingComplete: true,
    createdAt: new Date('2024-01-05'),
    lastActive: new Date(Date.now() - 5 * 60 * 60 * 1000),
    subscriptionTier: 'star',
    preferences: {
      minAge: 26,
      maxAge: 38,
      maxDistance: 30,
      interestedIn: ['men'],
    },
  },
  {
    id: 'user-4',
    name: 'Olivia',
    age: 25,
    bio: 'Medical student with a passion for travel and photography. Looking for someone who values meaningful conversations and shared adventures.',
    location: {
      city: 'San Francisco',
      state: 'CA',
    },
    photos: [
      {
        id: 'photo-7',
        url: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=800',
        type: 'selfie',
        approved: true,
        uploadDate: new Date('2024-01-08'),
      },
      {
        id: 'photo-8',
        url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=800',
        type: 'fullbody',
        approved: true,
        uploadDate: new Date('2024-01-08'),
      },
      {
        id: 'photo-9',
        url: 'https://images.unsplash.com/photo-1502823403499-6ccfcf4fb453?w=800',
        type: 'activity',
        approved: true,
        uploadDate: new Date('2024-01-08'),
      },
    ],
    statusBadges: [
      {
        id: 'badge-6',
        type: 'Medical Student',
        tier: 'elite',
        verified: true,
        verificationDate: new Date('2024-01-22'),
      },
      {
        id: 'badge-7',
        type: 'Photographer',
        tier: 'basic',
        verified: true,
        verificationDate: new Date('2024-01-28'),
      },
    ],
    verified: true,
    onboardingComplete: true,
    createdAt: new Date('2024-01-03'),
    lastActive: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    subscriptionTier: 'elite',
    preferences: {
      minAge: 24,
      maxAge: 32,
      maxDistance: 40,
      interestedIn: ['men'],
    },
  },
  {
    id: 'user-5',
    name: 'Isabella',
    age: 29,
    bio: 'Entrepreneur and fitness enthusiast. Building my dream business while staying active. Looking for someone ambitious and health-conscious.',
    location: {
      city: 'San Francisco',
      state: 'CA',
    },
    photos: [
      {
        id: 'photo-10',
        url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800',
        type: 'selfie',
        approved: true,
        uploadDate: new Date('2024-01-14'),
      },
      {
        id: 'photo-11',
        url: 'https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?w=800',
        type: 'fullbody',
        approved: true,
        uploadDate: new Date('2024-01-14'),
      },
      {
        id: 'photo-12',
        url: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800',
        type: 'activity',
        approved: true,
        uploadDate: new Date('2024-01-14'),
      },
    ],
    statusBadges: [
      {
        id: 'badge-8',
        type: 'Entrepreneur',
        tier: 'star',
        verified: true,
        verificationDate: new Date('2024-01-16'),
      },
      {
        id: 'badge-9',
        type: 'Athlete',
        tier: 'basic',
        verified: true,
        verificationDate: new Date('2024-01-20'),
      },
    ],
    verified: true,
    onboardingComplete: true,
    createdAt: new Date('2024-01-07'),
    lastActive: new Date(Date.now() - 12 * 60 * 60 * 1000),
    subscriptionTier: 'star',
    preferences: {
      minAge: 27,
      maxAge: 36,
      maxDistance: 25,
      interestedIn: ['men'],
    },
  },
  {
    id: 'user-6',
    name: 'Ava',
    age: 27,
    bio: 'Marketing professional who loves art galleries, wine tasting, and weekend getaways. Seeking someone cultured and spontaneous.',
    location: {
      city: 'San Francisco',
      state: 'CA',
    },
    photos: [
      {
        id: 'photo-13',
        url: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=800',
        type: 'selfie',
        approved: true,
        uploadDate: new Date('2024-01-11'),
      },
      {
        id: 'photo-14',
        url: 'https://images.unsplash.com/photo-1479936343636-73cdc5aae0c3?w=800',
        type: 'fullbody',
        approved: true,
        uploadDate: new Date('2024-01-11'),
      },
      {
        id: 'photo-15',
        url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        type: 'activity',
        approved: true,
        uploadDate: new Date('2024-01-11'),
      },
    ],
    statusBadges: [
      {
        id: 'badge-10',
        type: 'Businessperson',
        tier: 'elite',
        verified: true,
        verificationDate: new Date('2024-01-19'),
      },
    ],
    verified: true,
    onboardingComplete: true,
    createdAt: new Date('2024-01-04'),
    lastActive: new Date(Date.now() - 3 * 60 * 60 * 1000),
    subscriptionTier: 'elite',
    preferences: {
      minAge: 25,
      maxAge: 34,
      maxDistance: 35,
      interestedIn: ['men'],
    },
  },
];

export const mockMatches: Match[] = [
  {
    id: 'match-1',
    userId: currentUserId,
    matchedUserId: 'user-2',
    matchedUser: mockUsers[0],
    matchDate: new Date('2024-03-10'),
    conversationStarted: true,
    conversationEnded: false,
    lastMessageDate: new Date('2024-03-11'),
  },
];

export const mockMessages: Message[] = [
  {
    id: 'msg-1',
    matchId: 'match-1',
    senderId: currentUserId,
    receiverId: 'user-2',
    content: 'Hi Emma! I noticed we both love coffee and books. What are you currently reading?',
    timestamp: new Date('2024-03-10T14:30:00'),
    read: true,
  },
  {
    id: 'msg-2',
    matchId: 'match-1',
    senderId: 'user-2',
    receiverId: currentUserId,
    content: 'Hey! I&apos;m reading "The Midnight Library" right now. It&apos;s amazing! What about you?',
    timestamp: new Date('2024-03-10T15:45:00'),
    read: true,
  },
  {
    id: 'msg-3',
    matchId: 'match-1',
    senderId: currentUserId,
    receiverId: 'user-2',
    content: 'Oh I loved that book! I&apos;m currently into "Project Hail Mary". Have you been to any good coffee shops lately?',
    timestamp: new Date('2024-03-11T10:20:00'),
    read: true,
  },
];

export const mockConversations: Conversation[] = [
  {
    id: 'conv-1',
    matchId: 'match-1',
    match: mockMatches[0],
    messages: mockMessages,
    lastMessage: mockMessages[mockMessages.length - 1],
    mustRespond: false,
    ended: false,
  },
];

export const currentUser: User = {
  id: currentUserId,
  name: 'Alex',
  age: 28,
  bio: 'Software engineer who loves hiking, cooking, and live music. Looking for someone genuine and adventurous.',
  location: {
    city: 'San Francisco',
    state: 'CA',
  },
  photos: [
    {
      id: 'photo-16',
      url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
      type: 'selfie',
      approved: true,
      uploadDate: new Date('2024-01-05'),
    },
    {
      id: 'photo-17',
      url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=800',
      type: 'fullbody',
      approved: true,
      uploadDate: new Date('2024-01-05'),
    },
    {
      id: 'photo-18',
      url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800',
      type: 'activity',
      approved: true,
      uploadDate: new Date('2024-01-05'),
    },
  ],
  statusBadges: mockStatusBadges,
  verified: true,
  onboardingComplete: true,
  createdAt: new Date('2024-01-01'),
  lastActive: new Date(),
  subscriptionTier: 'basic',
  preferences: {
    minAge: 24,
    maxAge: 35,
    maxDistance: 50,
    interestedIn: ['women'],
  },
};
