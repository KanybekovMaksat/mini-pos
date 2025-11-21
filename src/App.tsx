import { useState } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import Login from './components/Login';
import Layout from './components/Layout';
import POS from './components/POS';
import Products from './components/Products';
import History from './components/History';
import Reports from './components/Reports';
import Analytics from './components/Analytics';
import Settings from './components/Settings';
import DebtBook from './components/DebtBook';

function AppContent() {
  const { isAuthenticated } = useAuth();
  const [currentPage, setCurrentPage] = useState('pos');

  if (!isAuthenticated) {
    return <Login />;
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'pos':
        return <POS />;
      case 'products':
        return <Products />;
      case 'history':
        return <History />;
      case 'reports':
        return <Reports />;
      case 'analytics':
        return <Analytics />;
      case 'settings':
        return <Settings />;
      case 'debtBook':
        return <DebtBook/>;
      default:
        return <POS />;
    }
  };

  return (
    <Layout currentPage={currentPage} onNavigate={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppProvider>
        <AppContent />
      </AppProvider>
    </AuthProvider>
  );
}

export default App;
