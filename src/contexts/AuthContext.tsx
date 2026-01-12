import { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  isLoading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signInAdmin: () => Promise<void>;
  signOut: () => Promise<void>;
  isEasterEggAdmin: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEasterEggAdmin, setIsEasterEggAdmin] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      setIsLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        setUser(session?.user ?? null);
      })();
    });

    return () => subscription.unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
  };

  const signInAdmin = async () => {
    // Easter egg: simulate admin login without Supabase auth
    setIsEasterEggAdmin(true);
  };

  const signOut = async () => {
    setIsEasterEggAdmin(false);
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  };

  const value = {
    user,
    isAdmin: !!user || isEasterEggAdmin,
    isLoading,
    signIn,
    signInAdmin,
    signOut,
    isEasterEggAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
