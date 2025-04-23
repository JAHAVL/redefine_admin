import React from 'react';
import { Navigate } from 'react-router-dom';

interface ProtectedRouteProps {
  component: React.ComponentType<any>;
}

/**
 * ProtectedRoute component to handle authentication
 * Redirects to login page if user is not authenticated
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ component: Component }) => {
  // For now, we'll assume the user is always authenticated
  // In a real application, you would check if the user is authenticated
  const isAuthenticated = true;

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return <Component />;
};
