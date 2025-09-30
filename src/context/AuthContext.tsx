import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import { supabase } from '../lib/supabase';

type UserProfile = {
  id: string;
  email: string;
  name?: string; // 🔹 adicionamos o nome
};

interface AuthContextType {
  user: UserProfile | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: UserProfile }>;
  register: (
    email: string,
    password: string,
    name: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  // 🔹 Busca sessão e carrega também o "name" do metadata
  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session?.user) {
        const u = data.session.user;
        setUser({
          id: u.id,
          email: u.email ?? '',
          name: u.user_metadata?.name ?? '', // pega do metadata
        });
      }
    };
    fetchSession();
  }, []);

  // 🔹 Cadastro com metadata.name
  const register = async (email: string, password: string, name: string) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name }, // salva no metadata
      },
    });

    if (error) return { success: false, error: error.message };
    return { success: true };
  };

  // 🔹 Login e atualização do user no estado
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error || !data.user) return { success: false };

    const currentUser = {
      id: data.user.id,
      email: data.user.email ?? '',
      name: data.user.user_metadata?.name ?? '', // recupera o nome
    };
    setUser(currentUser);

    return { success: true, user: currentUser };
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
