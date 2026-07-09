import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { Spin } from 'antd';

interface ProtectedRouteProps {
  allowedRoles?: ('admin' | 'agent' | 'pelerin')[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f5f5f5' }}>
        <Spin size="large" tip="Chargement..." />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/connexion" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redirection selon le rôle de l'utilisateur s'il n'est pas autorisé
    if (user.role === 'admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else if (user.role === 'agent') {
      return <Navigate to="/agent/dashboard" replace />;
    } else {
      return <Navigate to="/pelerin/dashboard" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
