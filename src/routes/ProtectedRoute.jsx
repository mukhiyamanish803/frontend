import { useAuth } from '@/context/AuthContex';
import React from 'react'
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({children, allowedRoles}) => {
    const { user, loading } = useAuth();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user) {
        return <Navigate to="/login" replace />;
    }
    if (!allowedRoles.includes(user.role)) {
        return <Navigate to="/unauthorized" replace />; // Or show 403 page
    }
    return children;
}

export default ProtectedRoute