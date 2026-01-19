import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

export const PrivateRoute = () => {
    const token = localStorage.getItem('user_token');
    return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export const PublicOnlyRoute = () => {
    const token = localStorage.getItem('user_token');
    return token ? <Navigate to="/dashboard" replace /> : <Outlet />;
};