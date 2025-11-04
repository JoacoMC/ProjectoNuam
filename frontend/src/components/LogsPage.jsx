import React from 'react';
import Header from './Header';
import { Navigate } from 'react-router-dom';
import { getCurrentUserRole } from '../apiService';

function LogsPage() {
    const role = getCurrentUserRole();

    // Protegemos esta ruta solo para el admin
    if (role !== 'admin') {
        return <Navigate to="/home" />;
    }

    return (
        <div>
            <main style={{ padding: '2rem' }}>
                <h1>Página de Logs del Sistema</h1>
                <p>Este componente es solo para 'Admin'.</p>
                {/* Aquí irá tu lógica para ver logs */}
            </main>
        </div>
    );
}

export default LogsPage;