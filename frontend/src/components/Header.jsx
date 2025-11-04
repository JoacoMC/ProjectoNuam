// src/components/Header.jsx (Actualizado)

import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
// Importamos las dos funciones que necesitamos del apiService
import { logoutUser, getCurrentUserRole } from '../apiService'; 
import './Header.css';

function Header() {
    const navigate = useNavigate();
    
    // 1. Obtenemos el rol del usuario desde localStorage
    const userRole = getCurrentUserRole();

    const handleLogout = () => {
        logoutUser(); // Llama a la función que borra los tokens
        navigate('/login'); 
    };

    // 2. Función para renderizar los enlaces correctos según el rol
    const renderNavLinks = () => {
        switch (userRole) {
            // --- Caso Admin (Tu solicitud) ---
            case 'admin':
                return (
                    <>
                        <Link to="/home">Home</Link>
                        <Link to="/carga">Carga</Link> 
                        <Link to="/logs">Logs</Link>
                        <button onClick={handleLogout} className="header-logout-btn">
                            Cerrar Sesión
                        </button>
                    </>
                );

            // --- Caso Corredor ---
            case 'corredor_tributario':
                return (
                    <>
                        <Link to="/home">Home</Link>
                        {/* Asumiendo que "cargar archivos" va a /carga */}
                        <Link to="/carga">Cargar Archivos</Link>
                        <button onClick={handleLogout} className="header-logout-btn">
                            Cerrar Sesión
                        </button>
                    </>
                );

            // --- Caso Cliente (y default) ---
            case 'cliente':
            default:
                return (
                    <>
                        <Link to="/home">Home</Link>
                        <button onClick={handleLogout} className="header-logout-btn">
                            Cerrar Sesión
                        </button>
                    </>
                );
        }
    };

    return (
        <header className="header-container">
            <div className="header-logo">
                <Link to="/home">Nuam</Link>
            </div>
            <nav className="header-nav">
                {/* 3. Llamamos a la función que renderiza los enlaces */}
                {renderNavLinks()}
            </nav>
        </header>
    );
}

export default Header;