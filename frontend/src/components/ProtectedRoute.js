
import React, { useEffect } from 'react';
import toast from 'react-hot-toast';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const token = localStorage.getItem('token');
    
    useEffect(() => {
        if (!token) {
          toast.error("Please sign in to access the dashboard.");
        }
    }, [token]);

    if (!token) {
        // Bina token ke user seedha Login page par redirect ho jayega
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;