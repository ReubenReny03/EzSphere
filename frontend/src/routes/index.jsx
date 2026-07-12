import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Spinner } from '@/components/ui/Spinner';
import { AppShell } from '@/components/layout/AppShell';
import Login from '@/features/auth/Login';
import Dashboard from '@/features/dashboard';
import Environmental from '@/features/environmental';
import Social from '@/features/social';
import Governance from '@/features/governance';
import Gamification from '@/features/gamification';
import Reports from '@/features/reports';
import SettingsPage from '@/features/settings';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-bg">
        <Spinner className="h-8 w-8" />
      </div>
    );
  }

  if (!user) return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  return children;
};

export const AppRoutes = () => (
  <Routes>
    <Route path="/login" element={<Login />} />
    <Route
      element={
        <PrivateRoute>
          <AppShell />
        </PrivateRoute>
      }
    >
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/environmental" element={<Environmental />} />
      <Route path="/social" element={<Social />} />
      <Route path="/governance" element={<Governance />} />
      <Route path="/gamification" element={<Gamification />} />
      <Route path="/reports" element={<Reports />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Route>
  </Routes>
);
