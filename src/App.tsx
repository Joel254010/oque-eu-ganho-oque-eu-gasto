import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Welcome from './components/Welcome';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard';

type Page = 'welcome' | 'register' | 'login';

const AppContent: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<Page>('welcome');
  const { user } = useAuth();

  if (user) {
    return <Dashboard />;
  }

  switch (currentPage) {
    case 'register':
      return <Register onNavigate={setCurrentPage} />;
    case 'login':
      return <Login onNavigate={setCurrentPage} />;
    default:
      return <Welcome onNavigate={setCurrentPage} />;
  }
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;