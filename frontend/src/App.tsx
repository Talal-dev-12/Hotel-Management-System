import { BrowserRouter, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
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
import { Loader2 } from 'lucide-react';
import { useState } from 'react';

// Protected Route Component
function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading LuxuryStay...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
}

// Auth Route Component (redirects to dashboard if already logged in)
function AuthRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-emerald-50">
        <div className="text-center">
          <Loader2 className="animate-spin text-emerald-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
}

// Main Layout Component
function MainLayout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  // Get current page from pathname
  const currentPage = location.pathname.split('/')[1] || 'dashboard';

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigate = (page: string) => {
    navigate(`/${page}`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Sidebar 
        currentPage={currentPage}
        onNavigate={handleNavigate}
        isCollapsed={isSidebarCollapsed}
        onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />
      <div className={`transition-all duration-300 ${isSidebarCollapsed ? 'ml-20' : 'ml-64'}`}>
        <Navbar onLogout={handleLogout} />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}

// App Content with Routes
function AppContent() {
  const navigate = useNavigate();

  return (
    <Routes>
      {/* Auth Routes */}
      <Route 
        path="/login" 
        element={
          <AuthRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
              <LoginPage 
                onLogin={() => navigate('/dashboard')}
                onRegister={() => navigate('/register')}
                onForgotPassword={() => navigate('/forgot-password')}
              />
            </div>
          </AuthRoute>
        } 
      />
      <Route 
        path="/register" 
        element={
          <AuthRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
              <RegisterPage onBack={() => navigate('/login')} />
            </div>
          </AuthRoute>
        } 
      />
      <Route 
        path="/forgot-password" 
        element={
          <AuthRoute>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-emerald-50">
              <ForgotPasswordPage onBack={() => navigate('/login')} />
            </div>
          </AuthRoute>
        } 
      />

      {/* Protected Routes */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Dashboard />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/users"
        element={
          <ProtectedRoute>
            <MainLayout>
              <UserManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/rooms"
        element={
          <ProtectedRoute>
            <MainLayout>
              <RoomManagement />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reservations"
        element={
          <ProtectedRoute>
            <MainLayout>
              <ReservationSystem />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/checkin"
        element={
          <ProtectedRoute>
            <MainLayout>
              <CheckInOut />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/billing"
        element={
          <ProtectedRoute>
            <MainLayout>
              <BillingInvoice />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/housekeeping"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Housekeeping />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/reports"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Reports />
            </MainLayout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/feedback"
        element={
          <ProtectedRoute>
            <MainLayout>
              <Feedback />
            </MainLayout>
          </ProtectedRoute>
        }
      />

      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* 404 Not Found */}
      <Route 
        path="*" 
        element={
          <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="text-center">
              <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
              <p className="text-xl text-gray-600 mb-8">Page not found</p>
              <button
                onClick={() => navigate('/dashboard')}
                className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-blue-600 text-white rounded-lg hover:from-emerald-700 hover:to-blue-700 transition-all shadow-lg"
              >
                Go to Dashboard
              </button>
            </div>
          </div>
        } 
      />
    </Routes>
  );
}

// Main App Component
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}