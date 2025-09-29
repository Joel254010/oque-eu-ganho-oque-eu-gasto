import { supabase } from "./supabase";

export async function signUp(email: string, password: string) {
  return await supabase.auth.signUp({ email, password });
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error };
  }

  // Buscar informações extras do usuário (incluindo status)
  const { data: userRow } = await supabase
    .from("users")
    .select("status")
    .eq("id", data.user.id)
    .single();

  return {
    success: true,
    user: data.user,
    status: userRow?.status ?? "pending", // se não tiver, assume "pending"
  };
}

export async function signOut() {
  return await supabase.auth.signOut();
}
