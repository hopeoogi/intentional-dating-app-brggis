
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Conversation, Match, Message, User } from '@/types/User';

interface SupabaseMatch {
  id: string;
  user_id: string;
  matched_user_id: string;
  match_date: string;
  conversation_started: boolean;
  conversation_ended: boolean;
  last_message_date: string | null;
  matched_user: {
    id: string;
    name: string;
    age: number;
    bio: string | null;
    city: string;
    state: string;
    verified: boolean;
    user_photos: Array<{
      id: string;
      url: string;
      photo_type: 'selfie' | 'fullbody' | 'activity';
      approved: boolean;
      upload_date: string;
    }>;
    status_badges: Array<{
      id: string;
      badge_type: string;
      tier: 'basic' | 'elite' | 'star';
      verified: boolean;
      verification_date: string;
    }>;
  };
  messages: Array<{
    id: string;
    sender_id: string;
    receiver_id: string;
    content: string;
    timestamp: string;
    read: boolean;
  }>;
}

export function useConversations(currentUserId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (currentUserId) {
      fetchConversations();
    }
  }, [currentUserId]);

  const fetchConversations = async () => {
    if (!currentUserId) {
      console.log('No current user ID provided');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      console.log('Fetching conversations for user:', currentUserId);

      const { data, error: fetchError } = await supabase
        .from('matches')
        .select(`
          *,
          matched_user:users!matches_matched_user_id_fkey (
            *,
            user_photos (*),
            status_badges (*)
          ),
          messages (*)
        `)
        .eq('user_id', currentUserId)
        .eq('conversation_started', true)
        .eq('conversation_ended', false)
        .order('last_message_date', { ascending: false });

      if (fetchError) {
        console.error('Error fetching conversations:', fetchError);
        throw fetchError;
      }

      console.log('Fetched conversations:', data?.length || 0);

      if (!data || data.length === 0) {
        console.log('No conversations found');
        setConversations([]);
        return;
      }

      // Transform Supabase data to Conversation type
      const transformedConversations: Conversation[] = data.map((match: SupabaseMatch) => {
        const matchedUser: User = {
          id: match.matched_user.id,
          name: match.matched_user.name,
          age: match.matched_user.age,
          bio: match.matched_user.bio || '',
          location: {
            city: match.matched_user.city,
            state: match.matched_user.state,
          },
          photos: match.matched_user.user_photos.map(photo => ({
            id: photo.id,
            url: photo.url,
            type: photo.photo_type,
            approved: photo.approved,
            uploadDate: new Date(photo.upload_date),
          })),
          statusBadges: match.matched_user.status_badges.map(badge => ({
            id: badge.id,
            type: badge.badge_type,
            tier: badge.tier,
            verified: badge.verified,
            verificationDate: new Date(badge.verification_date),
          })),
          verified: match.matched_user.verified,
          onboardingComplete: true,
          createdAt: new Date(),
          lastActive: new Date(),
          preferences: {
            minAge: 18,
            maxAge: 100,
            maxDistance: 50,
            interestedIn: ['all'],
          },
        };

        const transformedMatch: Match = {
          id: match.id,
          userId: match.user_id,
          matchedUserId: match.matched_user_id,
          matchedUser,
          matchDate: new Date(match.match_date),
          conversationStarted: match.conversation_started,
          conversationEnded: match.conversation_ended,
          lastMessageDate: match.last_message_date ? new Date(match.last_message_date) : undefined,
        };

        const messages: Message[] = match.messages.map(msg => ({
          id: msg.id,
          matchId: match.id,
          senderId: msg.sender_id,
          receiverId: msg.receiver_id,
          content: msg.content,
          timestamp: new Date(msg.timestamp),
          read: msg.read,
        }));

        const sortedMessages = messages.sort((a, b) => 
          b.timestamp.getTime() - a.timestamp.getTime()
        );

        const lastMessage = sortedMessages[0];
        const mustRespond = lastMessage && lastMessage.senderId !== currentUserId;

        return {
          id: match.id,
          match: transformedMatch,
          messages,
          lastMessage,
          mustRespond,
        };
      });

      console.log('Transformed conversations:', transformedConversations.length);
      setConversations(transformedConversations);
    } catch (err) {
      console.error('Error in fetchConversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch conversations');
    } finally {
      setLoading(false);
    }
  };

  return { conversations, loading, error, refetch: fetchConversations };
}
