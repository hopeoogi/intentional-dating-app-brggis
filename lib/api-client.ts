
import { authClient } from './auth-client';
import Constants from 'expo-constants';

// Get backend URL from app.json extra config or use Supabase URL as fallback
const backendUrl = Constants.expoConfig?.extra?.backendUrl || 'https://plnfluykallohjimxnja.supabase.co';

console.log('[API Client] Backend URL:', backendUrl);

/**
 * Make an authenticated API request to the backend
 * Automatically includes session cookies for authentication
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<{ data: T | null; error: string | null }> {
  try {
    // Get session cookies from BetterAuth
    const cookies = authClient.getCookie();
    
    // Build full URL
    const url = endpoint.startsWith('http') 
      ? endpoint 
      : `${backendUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;

    console.log('[API Client] Request:', options.method || 'GET', url);

    // Make request with cookies
    const response = await fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(cookies ? { Cookie: cookies } : {}),
        ...options.headers,
      },
      credentials: 'omit', // Don't use 'include' as we're manually setting cookies
    });

    // Parse response
    const data = await response.json();

    if (!response.ok) {
      console.error('[API Client] Error:', response.status, data);
      return {
        data: null,
        error: data.error || data.message || `Request failed with status ${response.status}`,
      };
    }

    console.log('[API Client] Success:', url);
    return { data, error: null };
  } catch (error) {
    console.error('[API Client] Exception:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
    };
  }
}

/**
 * Upload a file to the backend
 */
export async function uploadFile(
  file: { uri: string; name: string; type: string },
  endpoint: string = '/api/upload'
): Promise<{ data: { url: string } | null; error: string | null }> {
  try {
    const cookies = authClient.getCookie();
    
    const formData = new FormData();
    formData.append('file', {
      uri: file.uri,
      name: file.name,
      type: file.type,
    } as any);

    const url = `${backendUrl}${endpoint}`;
    console.log('[API Client] Uploading file to:', url);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(cookies ? { Cookie: cookies } : {}),
      },
      body: formData,
      credentials: 'omit',
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('[API Client] Upload error:', response.status, data);
      return {
        data: null,
        error: data.error || data.message || 'Upload failed',
      };
    }

    console.log('[API Client] Upload success:', data.url);
    return { data, error: null };
  } catch (error) {
    console.error('[API Client] Upload exception:', error);
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Upload failed',
    };
  }
}

// API endpoint helpers
export const api = {
  // User endpoints
  users: {
    getProfile: () => apiRequest('/api/users/profile'),
    updateProfile: (data: any) => apiRequest('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    getPendingUsers: () => apiRequest('/api/admin/pending-users'),
    approveUser: (userId: string) => apiRequest(`/api/admin/users/${userId}/approve`, {
      method: 'POST',
    }),
    rejectUser: (userId: string, reason: string) => apiRequest(`/api/admin/users/${userId}/reject`, {
      method: 'POST',
      body: JSON.stringify({ reason }),
    }),
  },

  // Match endpoints
  matches: {
    getDailyMatches: () => apiRequest('/api/matches/daily'),
    getConversations: () => apiRequest('/api/matches/conversations'),
    startConversation: (matchedUserId: string, message: string) => apiRequest('/api/matches/start', {
      method: 'POST',
      body: JSON.stringify({ matchedUserId, message }),
    }),
    endConversation: (matchId: string) => apiRequest(`/api/matches/${matchId}/end`, {
      method: 'POST',
    }),
    notNow: (matchId: string) => apiRequest(`/api/matches/${matchId}/not-now`, {
      method: 'POST',
    }),
  },

  // Message endpoints
  messages: {
    getMessages: (matchId: string) => apiRequest(`/api/messages/${matchId}`),
    sendMessage: (matchId: string, content: string) => apiRequest('/api/messages', {
      method: 'POST',
      body: JSON.stringify({ matchId, content }),
    }),
  },

  // Subscription endpoints
  subscriptions: {
    getCurrent: () => apiRequest('/api/subscriptions/current'),
    applyPromoCode: (code: string, tier: string) => apiRequest('/api/subscriptions/promo', {
      method: 'POST',
      body: JSON.stringify({ code, tier }),
    }),
    subscribe: (tier: string, planType: string, promoCode?: string) => apiRequest('/api/subscriptions/subscribe', {
      method: 'POST',
      body: JSON.stringify({ tier, planType, promoCode }),
    }),
  },

  // Admin endpoints
  admin: {
    getDashboardStats: () => apiRequest('/api/admin/dashboard'),
    getPromoCodes: () => apiRequest('/api/admin/promo-codes'),
    createPromoCode: (data: any) => apiRequest('/api/admin/promo-codes', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    togglePromoCode: (id: string, active: boolean) => apiRequest(`/api/admin/promo-codes/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ active }),
    }),
    deletePromoCode: (id: string) => apiRequest(`/api/admin/promo-codes/${id}`, {
      method: 'DELETE',
    }),
    getNotificationTemplates: () => apiRequest('/api/admin/notifications/templates'),
    updateNotificationTemplate: (id: string, data: any) => apiRequest(`/api/admin/notifications/templates/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
    scheduleNotification: (data: any) => apiRequest('/api/admin/notifications/schedule', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    getIntroVideoSettings: () => apiRequest('/api/admin/intro-video'),
    updateIntroVideoSettings: (data: any) => apiRequest('/api/admin/intro-video', {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  },

  // Application endpoints
  application: {
    submit: (data: any) => apiRequest('/api/application/submit', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
    uploadPhoto: (file: { uri: string; name: string; type: string }, photoType: string) => 
      uploadFile(file, `/api/application/photos?type=${photoType}`),
    uploadBadgeProof: (file: { uri: string; name: string; type: string }, badgeType: string, tier: string) =>
      uploadFile(file, `/api/application/badge-proof?badgeType=${badgeType}&tier=${tier}`),
  },

  // Settings endpoints
  settings: {
    updateMatchFilters: (filters: any) => apiRequest('/api/settings/match-filters', {
      method: 'PUT',
      body: JSON.stringify(filters),
    }),
    getMatchFilters: () => apiRequest('/api/settings/match-filters'),
  },
};

console.log('[API Client] ✅ API client initialized');
