import React, { useState, useEffect } from "react";
import { Check, X, ArrowLeft } from "lucide-react";
import { supabase } from "../lib/supabase";

interface User {
  id: string;
  email: string;
  status: "pending" | "approved" | "rejected";
}

interface UserApprovalProps {
  onBack: () => void;
}

const UserApproval: React.FC<UserApprovalProps> = ({ onBack }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    setLoading(true);

    const { data, error } = await supabase
  .from("profiles")
  .select("id, status, email")
  .eq("status", "pending");

    if (error) {
      console.error("Erro ao carregar usuários:", error.message);
    } else {
      const mapped = (data || []).map((row: any) => ({
        id: row.id,
        status: row.status,
        email: row.user?.email || "Sem e-mail",
      }));
      setUsers(mapped);
    }

    setLoading(false);
  };

  const updateUserStatus = async (id: string, status: "approved" | "rejected") => {
    const { error } = await supabase
      .from("profiles")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Erro ao atualizar status:", error.message);
    } else {
      setUsers((prev) => prev.filter((u) => u.id !== id)); // remove da lista
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex flex-col p-6">
      <div className="flex items-center mb-8">
        <button
          onClick={onBack}
          className="text-brand hover:text-brand-dark transition-colors"
        >
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-2xl font-bold text-brand ml-4">
          Aprovação de Usuários
        </h1>
      </div>

      {loading ? (
        <div className="text-center text-gray-400 flex-1 flex items-center justify-center">
          <p>Carregando...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center text-gray-400 flex-1 flex items-center justify-center">
          <p>Nenhum usuário pendente</p>
        </div>
      ) : (
        <div className="space-y-4 max-w-md mx-auto w-full">
          {users.map((user) => (
            <div
              key={user.id}
              className="bg-gray-900 rounded-lg p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-bold">{user.email}</p>
                <p className="text-gray-400 text-sm">Status: {user.status}</p>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => updateUserStatus(user.id, "approved")}
                  className="bg-green-600 hover:bg-green-700 text-white px-3 py-2 rounded-lg flex items-center"
                >
                  <Check className="w-4 h-4 mr-1" />
                  Aprovar
                </button>
                <button
                  onClick={() => updateUserStatus(user.id, "rejected")}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg flex items-center"
                >
                  <X className="w-4 h-4 mr-1" />
                  Rejeitar
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <footer className="text-center text-brand mt-6">
        Mais um produto exclusivo da My GlobyX 🚀
      </footer>
    </div>
  );
};

export default UserApproval;
