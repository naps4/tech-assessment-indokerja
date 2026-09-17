import { Routes, Route, Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import JobsListPage from './pages/JobsListPage';
import JobDetailPage from './pages/JobDetailPage';
import MyApplicationsPage from './pages/MyApplicationsPage';
import CompanyDashboardPage from './pages/CompanyDashboardPage';
import { useAuth } from './context/AuthContext';

function ProtectedRoute({ children, role }: { children: ReactNode; role?: 'JOB_SEEKER' | 'COMPANY' }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

export default function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/" element={<JobsListPage />} />
        <Route path="/jobs/:id" element={<JobDetailPage />} />
        <Route path="/my-applications" element={<ProtectedRoute role="JOB_SEEKER"><MyApplicationsPage /></ProtectedRoute>} />
        <Route path="/dashboard" element={<ProtectedRoute role="COMPANY"><CompanyDashboardPage /></ProtectedRoute>} />
      </Routes>
    </div>
  );
}