'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import { createClient } from '@/lib/supabase/client';
import {
  type AuthChangeEvent,
  type Session,
  type User,
} from '@supabase/supabase-js';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  mfaVerified: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const MFA_STORAGE_KEY = 'mfa_verified';

function readMfaFromStorage(): boolean {
  if (typeof window === 'undefined') return false;
  return sessionStorage.getItem(MFA_STORAGE_KEY) === 'true';
}

function clearMfaFromStorage(): void {
  if (typeof window === 'undefined') return;
  sessionStorage.removeItem(MFA_STORAGE_KEY);
}

// ─── Context ─────────────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ─── Provider ────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaVerified, setMfaVerified] = useState(false);

  // Stable client ref — never triggers re-renders, survives across renders
  const supabase = useRef(createClient()).current;

  // ── Refresh user ────────────────────────────────────────────────────────────
  const refreshUser = useCallback(async () => {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.warn('[AuthProvider] getUser falló (¿Landing mode?):', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, [supabase]);

  // ── Sign out ─────────────────────────────────────────────────────────────────
  const signOut = useCallback(async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('[AuthProvider] signOut error:', error);
      throw error;
    }
  }, [supabase]);

  // ── Bootstrap: initial session + MFA flag ───────────────────────────────────
  useEffect(() => {
    refreshUser();
    setMfaVerified(readMfaFromStorage());
  }, [refreshUser]);

  // ── Auth state listener ──────────────────────────────────────────────────────
  useEffect(() => {
    let subscription: { unsubscribe: () => void } | null = null;

    try {
      const { data } = supabase.auth.onAuthStateChange(
        (event: AuthChangeEvent, session: Session | null) => {
          setSession(session);
          setUser(session?.user ?? null);
          setIsLoading(false);

          if (event === 'SIGNED_OUT') {
            setMfaVerified(false);
            clearMfaFromStorage();
          }
        },
      );
      subscription = data.subscription;
    } catch (error) {
      console.warn(
        '[AuthProvider] onAuthStateChange deshabilitado (¿Landing mode?):',
        error,
      );
    }

    return () => subscription?.unsubscribe();
  }, [supabase]);

  // ── Context value (memoized to prevent unnecessary consumer re-renders) ──────
  const value = useMemo<AuthContextType>(
    () => ({ user, session, isLoading, mfaVerified, signOut, refreshUser }),
    [user, session, isLoading, mfaVerified, signOut, refreshUser],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context)
    throw new Error('[useAuth] debe usarse dentro de un <AuthProvider>');
  return context;
};
