import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { supabase } from "../lib/supabase";

type UserProfile = {
  id: string;
  email: string;
  name?: string;
  status: "approved" | "pending";
};

interface AuthContextType {
  user: UserProfile | null;
  login: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; user?: UserProfile; status?: string }>;
  register: (
    name: string,
    email: string,
    password: string
  ) => Promise<{ success: boolean; error?: string; user?: any }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    const fetchSession = async () => {
      const { data } = await supabase.auth.getSession();

      if (data.session?.user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("id, email, name, status")
          .eq("user_id", data.session.user.id) // ⚠️ Correção aqui
          .single();

        if (profile) {
          setUser(profile as UserProfile);
        }
      }
    };

    fetchSession();
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string
  ) => {
    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error || !data.user) {
      return { success: false, error: error?.message };
    }

    await supabase.from("profiles").insert([
      {
        user_id: data.user.id, // ⚠️ Correção aqui
        email,
        name,
        status: "pending",
      },
    ]);

    return { success: true, user: data.user }; // ⚠️ Agora retorna o user
  };

  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error || !data.user) {
      return { success: false };
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("id, email, name, status")
      .eq("user_id", data.user.id) // ⚠️ Correção aqui
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
