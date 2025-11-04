// src/components/home/ClienteHome.jsx (Actualizado)

import React from 'react';
import Header from '../Header';
import { Link } from 'react-router-dom';
import AlertasDashboard from '../cliente/AlertasDashboard'; // 1. Importa el dashboard de alertas

function ClienteHome() {
    return (
        <div>
            <main style={{ padding: '2rem' }}>
                <h1>Mi Portal de Cliente</h1>

                {/* 2. Añade los botones */}
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    <Link to="/mis-archivos" style={buttonStyle}>
                        Ver Mis Archivos
                    </Link>
                    <Link to="/subir-archivo" style={buttonStyle}>
                        Subir Archivo (PDF/Excel)
                    </Link>
                </div>
                
                <hr style={{ margin: '2rem 0' }} />

                {/* 3. Muestra el componente de Alertas */}
                <AlertasDashboard />

                {/* (Sección de Calificaciones Tributarias iría aquí) */}
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

export default ClienteHome;