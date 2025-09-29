import { supabase } from "./supabase";

export async function addLancamento(tipo: "entrada" | "saida", categoria: string, valor: number, data: string) {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Usuário não autenticado");

  const { data: lanc, error } = await supabase
    .from("lancamentos")
    .insert([{ user_id: user.id, tipo, categoria, valor, data }]);

  if (error) throw error;
  return lanc;
}

export async function getLancamentos() {
  const user = (await supabase.auth.getUser()).data.user;
  if (!user) throw new Error("Usuário não autenticado");

  const { data, error } = await supabase
    .from("lancamentos")
    .select("*")
    .eq("user_id", user.id)
    .order("data", { ascending: false });

  if (error) throw error;
  return data;
}
