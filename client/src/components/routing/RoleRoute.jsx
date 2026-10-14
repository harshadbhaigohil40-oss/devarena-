import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import toast from 'react-hot-toast';

export default function RoleRoute({ allowedRoles }) {
  const { user, loading } = useAuth();

  if (loading) return null;

  if (!user || !allowedRoles.includes(user.role)) {
    toast.error('You do not have permission to view this page.');
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
