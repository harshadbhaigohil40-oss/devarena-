import { Outlet, Navigate, useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import { useAuth } from '@/context/AuthContext';

export default function AuthLayout() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // If user is logged in and tries to access login or register, redirect them to dashboard
  if (isAuthenticated && (location.pathname === '/login' || location.pathname === '/register')) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar />
      <main style={{ flex: 1, marginTop: 'var(--navbar-height)' }}>
        <Outlet />
      </main>
    </div>
  );
}
