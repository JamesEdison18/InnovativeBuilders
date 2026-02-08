import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function PrivateRoute({ children }) {
    const { currentUser, loading } = useAuth();

    if (loading) {
        return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-body)', color: 'white' }}>Loading...</div>;
    }

    return currentUser ? children : <Navigate to="/login" />;
}
