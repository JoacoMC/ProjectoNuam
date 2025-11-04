// src/components/corredor/ConsultarFactores.jsx (REEMPLAZO)

import React, { useState, useEffect } from 'react';
import { getCalificacionesList, getCalificacionDetail } from '../../apiService';

// Estado inicial para el formulario de factores (vacío)
const factoresIniciales = {
    factor_09_sin_constitutiva: 0.0,
    factor_10_con_devolucion: 0.0,
    factor_10_sin_devolucion: 0.0,
    factor_11_no_constitutiva: 0.0,
    factor_12_no_gravados: 0.0,
    factor_13_ing_diferida: 0.0,
    factor_15_imp_ctg_colectivo: 0.0,
    factor_16_imp_ctg_individual: 0.0,
    factor_17_no_constitutiva: 0.0,
    factor_18_rentas_exentas: 0.0,
    factor_19_no_gravados: 0.0,
    factor_20_con_devolucion: 0.0,
    factor_27_impuesto_tasa: 0.0,
    factor_28_con_devolucion: 0.0,
    factor_29_sin_devolucion: 0.0,
    factor_30_con_derecho_pe: 0.0,
    factor_31_lib: 0.0,
    factor_32_credito_pe: 0.0,
    // (Añade el resto de los factores de tus mockups aquí)
};

function ConsultarFactores() {
    const [listaCalificaciones, setListaCalificaciones] = useState([]);
    const [selectedId, setSelectedId] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Estado para guardar los datos de la calificación seleccionada
    const [calificacionData, setCalificacionData] = useState(null);
    // Estado para los factores (inicia vacío o con los datos cargados)
    const [factores, setFactores] = useState(factoresIniciales);

    // 1. Cargar la lista de calificaciones para el <select>
    useEffect(() => {
        const fetchLista = async () => {
            try {
                const response = await getCalificacionesList();
                setListaCalificaciones(response.data);
            } catch (err) {
                setError("No se pudo cargar la lista de calificaciones.");
            }
        };
        fetchLista();
    }, []);

    // 2. Handler para cargar los detalles (con factores)
    const handleCargar = async () => {
        if (!selectedId) {
            setError("Por favor, selecciona una calificación.");
            return;
        }
        
        setLoading(true);
        setError(null);
        setCalificacionData(null);
        setFactores(factoresIniciales); // Resetea los factores

        try {
            const response = await getCalificacionDetail(selectedId);
            setCalificacionData(response.data);
            
            // Si el campo 'factores' no está vacío, lo usamos.
            // Si está vacío (default={}), usamos los 'factoresIniciales' (0.0)
            const factoresCargados = response.data.factores && Object.keys(response.data.factores).length > 0
                ? response.data.factores
                : factoresIniciales;
                
            setFactores(factoresCargados);

        } catch (err) {
            setError("Error al cargar los detalles de la calificación.");
        }
        setLoading(false);
    };

    return (
        <>
            <h1>Consultar Factores de Calificación</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* --- SELECCIÓN --- */}
            <div style={formSectionStyle}>
                <h3>Seleccionar Calificación</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <select
                        value={selectedId}
                        onChange={(e) => setSelectedId(e.target.value)}
                        style={{ flex: 1, padding: '8px' }}
                    >
                        <option value="">-- Elige una calificación --</option>
                        {listaCalificaciones.map(cal => (
                            <option key={cal.id} value={cal.id}>
                                {cal.id} - {cal.descripcion} ({cal.fecha})
                            </option>
                        ))}
                    </select>
                    <button onClick={handleCargar} disabled={loading} style={submitButtonStyle}>
                        {loading ? 'Cargando...' : 'Cargar Factores'}
                    </button>
                </div>
            </div>

            {/* --- VISUALIZACIÓN DE FACTORES (Mockups) --- */}
            {/* Esto solo se muestra si se cargaron datos */}
            {calificacionData && (
                <div style={formSectionStyle}>
                    <h3>Factores Aplicados (Visualización)</h3>
                    {/* Mostramos la cabecera (solo lectura) */}
                    <div style={gridStyle(3)}>
                        <strong>Mercado:</strong> {calificacionData.mercado}
                        <strong>Fecha:</strong> {calificacionData.fecha}
                        <strong>Valor:</strong> {calificacionData.valor_historico}
                    </div>

                    <hr style={{ margin: '2rem 0' }} />
                    
                    {/* Formulario grande (solo lectura) */}
                    <div style={gridStyle(3)}>
                        {/* Columna 1 */}
                        <div>
                            <label>Factor-09 Sin Constitutiva</label>
                            <input type="number" value={factores.factor_09_sin_constitutiva} readOnly />
                        </div>
                        <div>
                            <label>Factor-10 Con Devolución</label>
                            <input type="number" value={factores.factor_10_con_devolucion} readOnly />
                        </div>
                        <div>
                            <label>Factor-10 Sin Devolución</label>
                            <input type="number" value={factores.factor_10_sin_devolucion} readOnly />
                        </div>
                        {/* (Añade el resto de factores de la Col 1 aquí) */}

                        {/* Columna 2 */}
                        <div>
                            <label>Factor-15 Imp. Categ. Colectivo</label>
                            <input type="number" value={factores.factor_15_imp_ctg_colectivo} readOnly />
                        </div>
                        <div>
                            <label>Factor-16 Imp. Categ. Individual</label>
                            <input type="number" value={factores.factor_16_imp_ctg_individual} readOnly />
                        </div>
                        {/* (Añade el resto de factores de la Col 2 aquí) */}

                        {/* Columna 3 */}
                        <div>
                            <label>Factor-27 Impuesto Tasa</label>
                            <input type="number" value={factores.factor_27_impuesto_tasa} readOnly />
                        </div>
                        <div>
                            <label>Factor-28 Con Devolución</label>
                            <input type="number" value={factores.factor_28_con_devolucion} readOnly />
                        </div>
                        {/* (Añade el resto de factores de la Col 3 aquí) */}
                    </div>
                </div>
            )}
        </>
    );
}

// --- Estilos (copiados de IngresarCalificacion) ---
const formSectionStyle = {
    border: '1px solid #ccc',
    borderRadius: '8px',
    padding: '1rem',
    marginBottom: '1rem',
    backgroundColor: '#f9f9f9'
};

const gridStyle = (cols) => ({
    display: 'grid',
    gridTemplateColumns: `repeat(${cols}, 1fr)`,
    gap: '1rem',
    // Estilos para los inputs de solo lectura
    "& input[readOnly]": {
        backgroundColor: '#eee',
        border: '1px solid #ddd'
    }
});

const submitButtonStyle = {
    padding: '10px 20px',
    fontSize: '1rem',
    backgroundColor: 'var(--naranja-principal)',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer'
};

export default ConsultarFactores;