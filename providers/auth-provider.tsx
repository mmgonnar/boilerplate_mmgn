'use client';

import { createContext, useContext, useState, useEffect } from 'react';
import { type User, type Session } from '@supabase/supabase-js';
import { createClient } from '@/lib/supabase/client';

type AuthContextType = {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  mfaVerified: boolean;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [mfaVerified, setMfaVerified] = useState(false);

  const supabase = createClient();

  const refreshUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    } catch (error) {
      console.warn('Supabase Auth no disponible en modo Landing:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
    const mfaVerifiedStorage = sessionStorage.getItem('mfa_verified');
    if (mfaVerifiedStorage === 'true') {
      setMfaVerified(true);
    }
  }, []);

  useEffect(() => {
    try {
      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);

        if (_event === 'SIGNED_OUT') {
          setMfaVerified(false);
          sessionStorage.removeItem('mfa_verified');
        }
      });

      return () => subscription.unsubscribe();
    } catch (error) {
      console.warn('Escucha de Auth deshabilitada:', error);
    }
  }, []);

  const signOut = async () => {
    try {
      setUser(null);
      setSession(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Sign out error in provider:', error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, session, isLoading, mfaVerified, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth debe usarse dentro de un AuthProvider');
  return context;
};
