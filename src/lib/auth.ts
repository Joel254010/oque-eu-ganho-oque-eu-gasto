import { supabase } from "./supabase";

// 🔹 Criar usuário + inserir registro na tabela profiles
export async function signUp(email: string, password: string) {
  // 1. Criar usuário no Supabase Auth
  const { data, error } = await supabase.auth.signUp({ email, password });

  if (error || !data.user) {
    return { success: false, error };
  }

  // 2. Criar registro em profiles com status "pending"
  await supabase.from("profiles").insert([
    {
      user_id: data.user.id, // FK para auth.users.id
      status: "pending",
    },
  ]);

  return { success: true, user: data.user, status: "pending" };
}

// 🔹 Fazer login e verificar status
export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error || !data.user) {
    return { success: false, error };
  }

  // Buscar status na tabela profiles
  const { data: profileRow } = await supabase
    .from("profiles")
    .select("status")
    .eq("user_id", data.user.id)
    .single();

  return {
    success: true,
    user: data.user,
    status: profileRow?.status ?? "pending", // fallback para pending
  };
}

// 🔹 Logout
export async function signOut() {
  return await supabase.auth.signOut();
}
