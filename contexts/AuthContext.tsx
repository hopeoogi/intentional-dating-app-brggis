
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
  const { data: session, isPending: isLoading } = authClient.useSession();

  const signIn = async (email: string, password: string) => {
    console.log('[AuthProvider] Signing in:', email);
    await authClient.signIn.email({ email, password });
  };

  const signUp = async (email: string, password: string, name: string) => {
    console.log('[AuthProvider] Signing up:', email);
    await authClient.signUp.email({ email, password, name });
  };

  const signOut = async () => {
    console.log('[AuthProvider] Signing out');
    await authClient.signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        isLoading,
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
