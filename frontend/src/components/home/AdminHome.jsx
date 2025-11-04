// src/components/home/AdminHome.jsx

import React from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom'; // Importa Link para la navegación

function AdminHome() {
    return (
        <div>
            <main style={{ padding: '2rem' }}>
                <h1>Panel de Administrador</h1>
                
                <p>Acciones rápidas:</p>
                {/* --- CONTENEDOR DE BOTONES --- */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/admin/create-user" style={buttonStyle}>
                        👤 Crear Nuevo Usuario
                    </Link>
                    
                    {/* --- BOTÓN NUEVO: GESTIONAR ROLES --- */}
                    <Link to="/admin/manage-roles" style={buttonStyle}>
                        🔄 Gestionar Roles
                    </Link>

                    {/* --- BOTÓN NUEVO: REVISAR LOGS --- */}
                    <Link to="/logs" style={buttonStyle}>
                        📋 Revisar Logs
                    </Link>
                </div>
                
                <hr style={{ margin: '2rem 0' }} />
            </main>
        </div>
    );
}

// Estilos simples para el botón
const buttonStyle = {
    display: 'inline-block',
    padding: '10px 15px',
    backgroundColor: 'var(--naranja-principal, #FF6600)', // <-- CAMBIADO a Naranja
    color: 'white',
    textDecoration: 'none',
    borderRadius: '0', // <-- CAMBIADO a Cuadrado
    fontSize: '1rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
};

export default AdminHome;