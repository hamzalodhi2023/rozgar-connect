import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

export const GuestRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: any) => state.auth);
  return !isAuthenticated ? <>{children}</> : <Navigate to="/" replace />;
};

export const RoleRoute = ({ children, requiredRole }: { children: React.ReactNode, requiredRole: string }) => {
  const { isAuthenticated, user } = useSelector((state: any) => state.auth);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const hasRole = user?.roles.includes(requiredRole);
  return hasRole ? <>{children}</> : <Navigate to="/" replace />;
};
