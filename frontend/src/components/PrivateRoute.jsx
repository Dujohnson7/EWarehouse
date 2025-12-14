import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import { canAccessPage } from '../config/roleConfig';

const PrivateRoute = ({ children, requiredPath }) => {
    const isAuthenticated = authService.isAuthenticated();
    const userRole = authService.getUserRole();
    const location = useLocation();

    if (!isAuthenticated) {
        return <Navigate to="/auth/login" state={{ from: location }} replace />;
    }
 
    if (requiredPath && !canAccessPage(userRole, requiredPath)) {
        return <Navigate to="/auth/login" replace />;
    }

    return children;
};

export default PrivateRoute;
