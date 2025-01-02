import React from 'react';
import { Navigate } from 'react-router-dom';

// ProtectedRoute checks for authentication
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('authToken'); // Check for token

  if (!token) {
    // Redirect to login if no token found
    return <Navigate to="/login" />;
  }

  return children;
};

export default ProtectedRoute;
