import { Navigate } from 'react-router-dom';
import type { ReactNode } from 'react';

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: string | string[];
}

const ProtectedRoute = ({ children, requiredRole }: ProtectedRouteProps) => {
    // Check if user is authenticated
    const token = localStorage.getItem('accessToken') || localStorage.getItem('token');

    if (!token) {
        // Not authenticated, redirect to login
        return <Navigate to="/login" replace />;
    }

    // Check user role if required
    if (requiredRole) {
        const userStr = localStorage.getItem('user');

        if (!userStr) {
            // No user data, redirect to login
            return <Navigate to="/login" replace />;
        }

        try {
            const user = JSON.parse(userStr);
            const userRole = user.role || user.userRole || localStorage.getItem('userRole');

            if (Array.isArray(requiredRole)) {
                if (!requiredRole.includes(userRole)) {
                    return <Navigate to="/unauthorized" replace />;
                }
            } else if (userRole !== requiredRole) {
                // User doesn't have required role, redirect to unauthorized page or home
                return <Navigate to="/unauthorized" replace />;
            }
        } catch (error) {
            console.error('Error parsing user data:', error);
            return <Navigate to="/login" replace />;
        }
    }

    // User is authenticated and has required role (if any)
    return <>{children}</>;
};

export default ProtectedRoute;
