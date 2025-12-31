
import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { Conversation } from '@/types/User';

export function useConversations(userId: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadConversations = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: matchesData, error: matchesError } = await supabase
        .from('matches')
        .select(`
          *,
          matched_user:users!matches_matched_user_id_fkey(
            id,
            name,
            age,
            bio,
            city,
            state,
            photos:user_photos(id, url, photo_type, approved),
            badges:status_badges(id, badge_type, tier, verified)
          )
        `)
        .eq('user_id', userId)
        .eq('conversation_ended', false)
        .order('last_message_date', { ascending: false });

      if (matchesError) throw matchesError;

      if (!matchesData || matchesData.length === 0) {
        setConversations([]);
        setLoading(false);
        return;
      }

      const conversationsWithMessages = await Promise.all(
        matchesData.map(async (match) => {
          const { data: messagesData } = await supabase
            .from('messages')
            .select('*')
            .eq('match_id', match.id)
            .order('timestamp', { ascending: true });

          const messages = (messagesData || []).map((msg) => ({
            id: msg.id,
            matchId: msg.match_id,
            senderId: msg.sender_id,
            receiverId: msg.receiver_id,
            content: msg.content,
            timestamp: new Date(msg.timestamp),
            read: msg.read,
          }));

          const lastMessage = messages.length > 0 ? messages[messages.length - 1] : undefined;
          const mustRespond = match.pending_response_from === userId;
          const respondBy = match.response_deadline ? new Date(match.response_deadline) : undefined;

          return {
            id: match.id,
            matchId: match.id,
            match: {
              id: match.id,
              userId: match.user_id,
              matchedUserId: match.matched_user_id,
              matchedUser: {
                id: match.matched_user.id,
                name: match.matched_user.name,
                age: match.matched_user.age,
                bio: match.matched_user.bio || '',
                location: {
                  city: match.matched_user.city,
                  state: match.matched_user.state,
                },
                photos: match.matched_user.photos.map((p) => ({
                  id: p.id,
                  url: p.url,
                  type: p.photo_type,
                  approved: p.approved,
                  uploadDate: new Date(),
                })),
                statusBadges: match.matched_user.badges.map((b) => ({
                  id: b.id,
                  type: b.badge_type,
                  tier: b.tier,
                  verified: b.verified,
                })),
                verified: true,
                onboardingComplete: true,
                createdAt: new Date(),
                lastActive: new Date(),
                preferences: {
                  minAge: 18,
                  maxAge: 100,
                  maxDistance: 50,
                  interestedIn: ['all'],
                },
              },
              matchDate: new Date(match.match_date),
              conversationStarted: match.conversation_started,
              conversationEnded: match.conversation_ended,
              lastMessageDate: match.last_message_date ? new Date(match.last_message_date) : undefined,
            },
            messages,
            lastMessage,
            mustRespond,
            respondBy,
            ended: match.conversation_ended,
          };
        })
      );

      setConversations(conversationsWithMessages);
    } catch (err) {
      console.error('Error loading conversations:', err);
      setError(err instanceof Error ? err.message : 'Failed to load conversations');
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    loadConversations();
  }, [loadConversations]);

  const refreshConversations = useCallback(() => {
    loadConversations();
  }, [loadConversations]);

  return {
    conversations,
    loading,
    error,
    refreshConversations,
  };
}
