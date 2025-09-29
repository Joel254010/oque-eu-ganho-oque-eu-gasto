import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  status: 'approved' | 'pending';
};

interface AuthContextType {
  user: UserProfile | null;
  login: (email: string, password: string) => Promise<{ success: boolean; user?: UserProfile; status?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    // Verifica se já existe sessão salva pelo Supabase
    const session = supabase.auth.getSession();
    session.then(async ({ data }) => {
      if (data.session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id, email, name, status')
          .eq('id', data.session.user.id)
          .single();

        if (profile) {
          setUser(profile as UserProfile);
        }
      }
    });
  }, []);

  const register = async (name: string, email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data.user) {
      // Cria linha na tabela profiles
      await supabase.from('profiles').insert([
        { id: data.user.id, email, name, status: 'pending' } // sempre pendente até aprovação
      ]);
    }

    return { success: true };
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error || !data.user) {
      return { success: false };
    }

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, name, status')
      .eq('id', data.user.id)
      .single();

    if (profileError || !profile) {
      return { success: false };
    }

    setUser(profile as UserProfile);

    return {
      success: true,
      user: profile as UserProfile,
      status: profile.status,
    };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
