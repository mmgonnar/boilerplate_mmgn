'use client';

import { createContext, useCallback, useContext, useEffect, useState } from 'react';

import { createClient } from '@/lib/supabase/client';
import type { Session, User } from '@supabase/supabase-js';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  mfaVerified: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaVerified, setMfaVerified] = useState(false);

  const supabase = createClient();

  const refreshUser = useCallback(async () => {
    const {
      data: { session: currentSession },
    } = await supabase.auth.getSession();
    setSession(currentSession);
    setUser(currentSession?.user ?? null);
    setIsLoading(false);
  }, [supabase.auth]);

  useEffect(() => {
    const initAuth = async () => {
      await refreshUser();

      const mfaVerifiedStorage = sessionStorage.getItem('mfa_verified');
      if (mfaVerifiedStorage === 'true') {
        setMfaVerified(true);
      }
    };

    initAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setSession(session);
      setUser(session?.user ?? null);

      if (_event === 'SIGNED_OUT') {
        setMfaVerified(false);
        sessionStorage.removeItem('mfa_verified');
      }
    });

    return () => subscription.unsubscribe();
  }, [supabase.auth, refreshUser]);

  const signOut = useCallback(async () => {
    await supabase.auth.signOut();
    setMfaVerified(false);
    sessionStorage.removeItem('mfa_verified');
  }, [supabase.auth]);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isLoading,
        mfaVerified,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}