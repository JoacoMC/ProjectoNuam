// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
    // Revisa si el token de acceso existe en localStorage
    const token = localStorage.getItem('access_token');

    if (!token) {
        // Si no hay token, redirige al usuario a la página de login
        return <Navigate to="/login" />;
    }

    // Si hay un token, muestra el componente hijo (en este caso, la página Home)
    return children;
}

export default ProtectedRoute;