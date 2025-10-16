import React, { useState } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Welcome from "./components/Welcome";
import Register from "./components/Register";
import Login from "./components/Login";
import Dashboard from "./components/Dashboard";

// 🌍 Importa o hook de tradução e o seletor de idioma
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "./components/LanguageSwitcher";

type Page = "welcome" | "register" | "login";

// =============================
// 📦 Conteúdo Principal do App
// =============================
const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>("welcome");
  const { user } = useAuth();
  const { t } = useTranslation(); // ✅ Hook de tradução

  if (user) {
    return <Dashboard />;
  }

  return (
    <div>
      {/* ✅ Topbar com título e seletor de idioma */}
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "12px 16px",
          borderBottom: "1px solid #E6EAF2",
          background: "#fff",
          position: "sticky",
          top: 0,
          zIndex: 10,
        }}
      >
        <h2 style={{ margin: 0, fontWeight: 600 }}>{t("appTitle")}</h2>
        <LanguageSwitcher />
      </header>

      {/* ✅ Área de conteúdo das páginas */}
      <main style={{ padding: "20px" }}>
        {user ? (
          <Dashboard />
        ) : currentPage === "register" ? (
          <Register onNavigate={setCurrentPage} />
        ) : currentPage === "login" ? (
          <Login onNavigate={setCurrentPage} />
        ) : (
          <Welcome onNavigate={setCurrentPage} />
        )}
      </main>
    </div>
  );
};

// =============================
// 🌐 App Principal com Provider
// =============================
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
