
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';
import { User } from '@/types/User';
import { mockUsers } from '@/data/mockData';

interface SupabaseUser {
  id: string;
  name: string;
  age: number;
  bio: string | null;
  city: string;
  state: string;
  verified: boolean;
  onboarding_complete: boolean;
  subscription_tier: 'basic' | 'elite' | 'star';
  created_at: string;
  last_active: string;
  user_photos: {
    id: string;
    url: string;
    photo_type: 'selfie' | 'fullbody' | 'activity';
    approved: boolean;
    upload_date: string;
  }[];
  status_badges: {
    id: string;
    badge_type: string;
    tier: 'basic' | 'elite' | 'star';
    verified: boolean;
    verification_date: string;
  }[];
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching users from Supabase...');

      const { data, error: fetchError } = await supabase
        .from('users')
        .select(`
          *,
          user_photos (*),
          status_badges (*)
        `)
        .eq('verified', true)
        .eq('onboarding_complete', true)
        .order('created_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching users:', fetchError);
        console.log('Using mock data as fallback');
        setUsers(mockUsers);
        return;
      }

      console.log('Fetched users:', data?.length || 0);

      if (!data || data.length === 0) {
        console.log('No users found in database, using mock data');
        setUsers(mockUsers);
        return;
      }

      // Transform Supabase data to User type
      const transformedUsers: User[] = data.map((user: SupabaseUser) => ({
        id: user.id,
        name: user.name,
        age: user.age,
        bio: user.bio || '',
        location: {
          city: user.city,
          state: user.state,
        },
        photos: user.user_photos.map(photo => ({
          id: photo.id,
          url: photo.url,
          type: photo.photo_type,
          approved: photo.approved,
          uploadDate: new Date(photo.upload_date),
        })),
        statusBadges: user.status_badges.map(badge => ({
          id: badge.id,
          type: badge.badge_type,
          tier: badge.tier,
          verified: badge.verified,
          verificationDate: new Date(badge.verification_date),
        })),
        verified: user.verified,
        onboardingComplete: user.onboarding_complete,
        createdAt: new Date(user.created_at),
        lastActive: new Date(user.last_active),
        preferences: {
          minAge: 18,
          maxAge: 100,
          maxDistance: 50,
          interestedIn: ['all'],
        },
      }));

      console.log('Transformed users:', transformedUsers.length);
      setUsers(transformedUsers);
    } catch (err) {
      console.error('Error in fetchUsers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
      console.log('Using mock data as fallback due to error');
      setUsers(mockUsers);
    } finally {
      setLoading(false);
    }
  };

  return { users, loading, error, refetch: fetchUsers };
}
