// src/components/AdminRoute.jsx

import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUserRole } from '../apiService'; // Importa la función de rol

function AdminRoute({ children }) {
    const role = getCurrentUserRole(); // Obtiene el rol actual

    // Verifica si el rol es 'admin'
    if (role !== 'admin') {
        // Si no es admin, redirige a la página principal
        return <Navigate to="/home" />;
    }

    // Si es admin, muestra el componente hijo
    return children;
}

export default AdminRoute;