import React from 'react';
import { getCurrentUserRole } from '../apiService';
import AdminHome from './home/AdminHome';
import CorredorHome from './home/CorredorHome';
import ClienteHome from './home/ClienteHome';

function HomeSwitcher() {
    const role = getCurrentUserRole(); // Lee el rol de localStorage

    // Renderiza un componente diferente basado en el rol
    switch (role) {
        case 'admin':
            return <AdminHome />;
        case 'corredor_tributario':
            return <CorredorHome />;
        case 'cliente':
            return <ClienteHome />;
        default:
            // Si el rol es nulo o desconocido, muestra el de cliente
            return <ClienteHome />;
    }
}

export default HomeSwitcher;