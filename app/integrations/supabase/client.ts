
// ============================================================================
// SUPABASE CLIENT - REMOVED TO FIX ADAPTER ERROR
// ============================================================================
// The "(h.adapter || o.adapter) is not a function" error was caused by
// Supabase client initialization during EAS build.
//
// This app uses BetterAuth for authentication and backend APIs for data.
// Supabase is only used on the backend (Edge Functions, database).
//
// All frontend code has been updated to remove Supabase imports.
// ============================================================================

// Export a dummy object to prevent import errors during migration
export const supabase = {
  auth: {
    getUser: async () => ({ data: { user: null }, error: null }),
    getSession: async () => ({ data: { session: null }, error: null }),
  },
  from: () => ({
    select: () => ({ eq: () => ({ single: () => ({}) }) }),
    insert: () => ({}),
    update: () => ({ eq: () => ({}) }),
    delete: () => ({ eq: () => ({}) }),
  }),
  storage: {
    from: () => ({
      upload: async () => ({ data: null, error: null }),
      getPublicUrl: () => ({ data: { publicUrl: '' } }),
    }),
  },
};

console.log('[Supabase] Client disabled - using backend APIs instead');
