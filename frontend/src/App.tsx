import { useState } from 'react';
import Sidebar from './components/layout/Sidebar';
import Navbar from './components/layout/Navbar';
import Dashboard from './components/dashboard/Dashboard';
import UserManagement from './components/users/UserManagement';
import RoomManagement from './components/rooms/RoomManagement';
import ReservationSystem from './components/reservations/ReservationSystem';
import CheckInOut from './components/checkin/CheckInOut';
import BillingInvoice from './components/billing/BillingInvoice';
import Housekeeping from './components/housekeeping/Housekeeping';
import Reports from './components/reports/Reports';
import Feedback from './components/feedback/Feedback';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import ForgotPasswordPage from './components/auth/ForgotPasswordPage';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authPage, setAuthPage] = useState<'login' | 'register' | 'forgot'>('login');
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleLogin = () => {
    setIsAuthenticated(true);
    setCurrentPage('dashboard');
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        {authPage === 'login' && (
          <LoginPage 
            onLogin={handleLogin} 
            onRegister={() => setAuthPage('register')}
            onForgotPassword={() => setAuthPage('forgot')}
          />
        )}
        {authPage === 'register' && (
          <RegisterPage onBack={() => setAuthPage('login')} />
        )}
        {authPage === 'forgot' && (
          <ForgotPasswordPage onBack={() => setAuthPage('login')} />
        )}
      </div>
    );
  }

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <UserManagement />;
      case 'rooms':
        return <RoomManagement />;
      case 'reservations':
        return <ReservationSystem />;
      case 'checkin':
        return <CheckInOut />;
      case 'billing':
        return <BillingInvoice />;
      case 'housekeeping':
        return <Housekeeping />;
      case 'reports':
        return <Reports />;
      case 'feedback':
        return <Feedback />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={setCurrentPage}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Navbar onLogout={() => setIsAuthenticated(false)} />
        <main className="p-6">
          {renderPage()}
        </main>
      </div>
    </div>
  );
}
