import { supabase } from "./supabase";

export async function signup(email: string, password: string) {
  // 1. Cria o usuário no Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError || !authData?.user) {
    console.error("Erro ao cadastrar usuário:", authError);
    return { success: false, message: authError?.message || "Erro desconhecido" };
  }

  const newUser = authData.user;

  // 2. Cria um perfil vinculado com status "pending"
  const { error: profileError } = await supabase.from("profiles").insert([
    {
      user_id: newUser.id,
      email: newUser.email,
      status: "pending",
    },
  ]);

  if (profileError) {
    console.error("Erro ao criar perfil:", profileError);
    return { success: false, message: "Usuário criado, mas erro ao salvar perfil" };
  }

  return { success: true, message: "Cadastro realizado com sucesso!" };
}
