
import React, { createContext, useContext, ReactNode } from 'react';
import { authClient } from '@/lib/auth-client';

interface AuthContextType {
  session: any;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use the BetterAuth hook correctly
  const session = authClient.useSession();
  
  const signIn = async (email: string, password: string) => {
    console.log('[AuthProvider] Signing in:', email);
    try {
      await authClient.signIn.email({ 
        email, 
        password,
        callbackURL: '/' 
      });
    } catch (error) {
      console.error('[AuthProvider] Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('[AuthProvider] Signing up:', email);
    try {
      await authClient.signUp.email({ 
        email, 
        password, 
        name,
        callbackURL: '/' 
      });
    } catch (error) {
      console.error('[AuthProvider] Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    console.log('[AuthProvider] Signing out');
    try {
      await authClient.signOut();
    } catch (error) {
      console.error('[AuthProvider] Sign out error:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session: session.data,
        isLoading: session.isPending,
        signIn,
        signUp,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
