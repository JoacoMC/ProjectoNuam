// src/components/CorredorOrAdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserRole } from '../apiService'; // Importa la función de rol

function CorredorOrAdminRoute({ children }) {
    const role = getCurrentUserRole(); 

    // Permite el acceso si el rol es 'admin' O 'corredor_tributario'
    if (role === 'admin' || role === 'corredor_tributario') {
        return children; // Muestra la página solicitada
    }

    // Si es 'cliente' o no está logueado, redirige a /home
    return <Navigate to="/home" />;
}

export default CorredorOrAdminRoute;