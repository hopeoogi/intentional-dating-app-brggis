
import { useState, useEffect } from 'react';
import { supabase } from '@/app/integrations/supabase/client';

export interface PendingUserPhoto {
  id: string;
  url: string;
  photo_type: 'selfie' | 'fullbody' | 'activity';
  approved: boolean | null;
  rejection_reason: string | null;
  upload_date: string;
}

export interface PendingStatusBadge {
  id: string;
  badge_type: string;
  tier: 'basic' | 'elite' | 'star';
  proof_image_url: string | null;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  created_at: string;
}

export interface PendingUser {
  id: string;
  auth_user_id: string;
  name: string;
  age: number;
  bio: string | null;
  city: string;
  state: string;
  status: 'pending' | 'approved' | 'rejected';
  rejection_reason: string | null;
  submitted_at: string;
  reviewed_at: string | null;
  reviewed_by: string | null;
  pending_user_photos: PendingUserPhoto[];
  pending_status_badges: PendingStatusBadge[];
}

export function usePendingUsers() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingUsers();
  }, []);

  const fetchPendingUsers = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching pending users from Supabase...');

      const { data, error: fetchError } = await supabase
        .from('pending_users')
        .select(`
          *,
          pending_user_photos (*),
          pending_status_badges (*)
        `)
        .eq('status', 'pending')
        .order('submitted_at', { ascending: false });

      if (fetchError) {
        console.error('Error fetching pending users:', fetchError);
        throw fetchError;
      }

      console.log('Fetched pending users:', data?.length || 0);

      setPendingUsers(data || []);
    } catch (err) {
      console.error('Error in fetchPendingUsers:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch pending users');
    } finally {
      setLoading(false);
    }
  };

  const approveUser = async (pendingUserId: string): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Approving user:', pendingUserId);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/approve-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            pendingUserId,
            action: 'approve',
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to approve user');
      }

      console.log('User approved successfully:', result);

      // Refresh the list
      await fetchPendingUsers();

      return { success: true };
    } catch (err) {
      console.error('Error approving user:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to approve user',
      };
    }
  };

  const rejectUser = async (
    pendingUserId: string,
    rejectionReason: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Rejecting user:', pendingUserId);

      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        throw new Error('Not authenticated');
      }

      const response = await fetch(
        `${supabase.supabaseUrl}/functions/v1/approve-user`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            pendingUserId,
            action: 'reject',
            rejectionReason,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Failed to reject user');
      }

      console.log('User rejected successfully:', result);

      // Refresh the list
      await fetchPendingUsers();

      return { success: true };
    } catch (err) {
      console.error('Error rejecting user:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to reject user',
      };
    }
  };

  const updatePhotoApproval = async (
    photoId: string,
    approved: boolean,
    rejectionReason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Updating photo approval:', photoId, approved);

      const { error: updateError } = await supabase
        .from('pending_user_photos')
        .update({
          approved,
          rejection_reason: rejectionReason || null,
        })
        .eq('id', photoId);

      if (updateError) {
        throw updateError;
      }

      // Refresh the list
      await fetchPendingUsers();

      return { success: true };
    } catch (err) {
      console.error('Error updating photo approval:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update photo',
      };
    }
  };

  const updateBadgeStatus = async (
    badgeId: string,
    status: 'approved' | 'rejected',
    rejectionReason?: string
  ): Promise<{ success: boolean; error?: string }> => {
    try {
      console.log('Updating badge status:', badgeId, status);

      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Not authenticated');
      }

      const { error: updateError } = await supabase
        .from('pending_status_badges')
        .update({
          status,
          rejection_reason: rejectionReason || null,
          reviewed_at: new Date().toISOString(),
          reviewed_by: user.id,
        })
        .eq('id', badgeId);

      if (updateError) {
        throw updateError;
      }

      // Refresh the list
      await fetchPendingUsers();

      return { success: true };
    } catch (err) {
      console.error('Error updating badge status:', err);
      return {
        success: false,
        error: err instanceof Error ? err.message : 'Failed to update badge',
      };
    }
  };

  return {
    pendingUsers,
    loading,
    error,
    refetch: fetchPendingUsers,
    approveUser,
    rejectUser,
    updatePhotoApproval,
    updateBadgeStatus,
  };
}
