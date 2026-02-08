import React from 'react';
import { Navigate } from 'react-router-dom';
import { useRole } from '../../contexts/RoleContext';
import { useAuth } from '../../contexts/AuthContext';

export default function RequireRole({ allowedRoles, children }) {
    const { role } = useRole();
    const { loading } = useAuth();

    if (loading) return null; // Or a loading spinner

    if (!role) {
        // Not authenticated or role not loaded yet, handled by PrivateRoute usually, 
        // but safe to redirect to login
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles.includes(role)) {
        return children;
    }

    // Unauthorized - Redirect based on their actual role or to a generic 'unauthorized' page
    // For now, redirect to their allowed home
    return <Navigate to="/dashboard" replace />;
}
