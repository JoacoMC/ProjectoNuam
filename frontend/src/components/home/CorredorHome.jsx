import React from 'react';
import { Link } from 'react-router-dom'; 

function CorredorHome() {
    return (
        // El Layout.jsx envuelve esta página
        <>
            <h1>Panel de Corredor Tributario</h1>
            
            <p>Acciones rápidas:</p>
            <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                
                {/* --- BOTÓN AÑADIDO --- */}
                <Link to="/corredor/ingresar-calificacion" style={buttonStyle}>
                    📊 Ingresar Calificación
                </Link>

                {/* --- Botones existentes --- */}
                <Link to="/carga" style={buttonStyle}>
                    📤 Cargar Archivos
                </Link>
                <Link to="/corredor/editar-registros" style={buttonStyle}>
                    ✏️ Editar Registros
                </Link>
                <Link to="/corredor/consultar-factores" style={buttonStyle}>
                    🔍 Consultar Factores
                </Link>
                <Link to="/corredor/firmar-documentos" style={buttonStyle}>
                    ✍️ Firmar Documentos
                </Link>
                <Link to="/corredor/historial-cliente" style={buttonStyle}>
                    📂 Historial de Cliente
                </Link>
            </div>
        </>
    );
}

// Estilos para los botones
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

export default CorredorHome;