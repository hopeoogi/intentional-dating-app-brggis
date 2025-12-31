
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { User } from '@/types/User';

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          *,
          user_photos (*),
          status_badges (*)
        `)
        .eq('is_active', true)
        .eq('verified', true)
        .limit(10);

      if (usersError) {
        throw usersError;
      }

      const transformedUsers: User[] = (usersData || []).map((user) => ({
        id: user.id,
        name: user.name,
        age: user.age,
        bio: user.bio || '',
        location: {
          city: user.city,
          state: user.state,
          latitude: user.latitude,
          longitude: user.longitude,
        },
        photos: (user.user_photos || []).map((photo) => ({
          id: photo.id,
          url: photo.url,
          type: photo.photo_type,
        })),
        statusBadges: (user.status_badges || []).map((badge) => ({
          id: badge.id,
          type: badge.badge_type,
          tier: badge.tier,
          verified: badge.verified,
        })),
        verified: user.verified,
        preferences: {
          minAge: 18,
          maxAge: 100,
          maxDistance: user.max_distance || 50,
          interestedIn: ['all'],
        },
        subscriptionTier: user.subscription_tier || 'basic',
      }));

      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}
