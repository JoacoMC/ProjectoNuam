// src/components/cliente/AlertasDashboard.jsx

import React, { useState, useEffect } from 'react';
import { getClienteAlertas } from '../../apiService';

function AlertasDashboard() {
    const [alertas, setAlertas] = useState([]);

    useEffect(() => {
        const fetchAlertas = async () => {
            try {
                const response = await getClienteAlertas();
                setAlertas(response.data);
            } catch (err) {
                console.error("Error al cargar alertas", err);
            }
        };

        fetchAlertas();
        
        // Opcional: Refrescar las alertas cada 30 segundos
        const intervalId = setInterval(fetchAlertas, 30000);
        return () => clearInterval(intervalId);

    }, []);

    return (
        <div style={{ marginTop: '2rem' }}>
            <h2>Alertas Recientes</h2>
            {alertas.length === 0 ? (
                <p>No hay alertas recientes.</p>
            ) : (
                <ul style={{ listStyleType: 'none', paddingLeft: 0 }}>
                    {alertas.map(alerta => (
                        <li key={alerta.id} style={{ 
                            background: '#f4f4f4', 
                            padding: '10px', 
                            marginBottom: '5px',
                            borderLeft: '4px solid #007bff'
                        }}>
                            <strong>{alerta.mensaje}</strong>
                            <br />
                            <small>{new Date(alerta.fecha).toLocaleString()}</small>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default AlertasDashboard;