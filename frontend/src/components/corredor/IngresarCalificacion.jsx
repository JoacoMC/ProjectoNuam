import React, { useState, useEffect } from 'react';
import { getClientList, createCalificacion } from '../../apiService';
import { useNavigate } from 'react-router-dom';

// Estado inicial (los campos numéricos deben ser números)
const initialState = {
    client_id: '', 
    mercado: 'AC',
    descripcion: '',
    fecha: new Date().toISOString().split('T')[0],
    secuencia_evento: 0,
    valor_historico: 0.0,
    año: new Date().getFullYear(),
    instrumento: 'JEEP',
    factor: 0.0,
};

function IngresarCalificacion() {
    const [formData, setFormData] = useState(initialState);
    const [clientList, setClientList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const navigate = useNavigate();

    // Cargar la lista de clientes (sin cambios)
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await getClientList();
                setClientList(response.data);
            } catch (err) {
                setError("No se pudo cargar la lista de clientes.");
            }
        };
        fetchClients();
    }, []);

    // Manejador de cambios (versión de la respuesta anterior)
    const handleChange = (e) => {
        const { name, value, type } = e.target;
        
        let processedValue = value;

        if (type === 'number') {
            const integerFields = ['secuencia_evento', 'año'];
            const floatFields = ['valor_historico', 'factor'];

            if (value === '') {
                processedValue = (floatFields.includes(name)) ? 0.0 : 0;
            } else {
                if (integerFields.includes(name)) {
                    processedValue = parseInt(value, 10);
                } else if (floatFields.includes(name)) {
                    processedValue = parseFloat(value);
                }
                if (isNaN(processedValue)) {
                     processedValue = (floatFields.includes(name)) ? 0.0 : 0;
                }
            }
        }

        setFormData(prev => ({
            ...prev,
            [name]: processedValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.client_id === '') {
            setError("Debes seleccionar un cliente.");
            return;
        }

        setLoading(true);
        setError(null);
        setSuccess(null);

        try {
            console.log("Enviando estos datos al backend:", formData); // DEBUG: Muestra lo que se envía
            await createCalificacion(formData);
            setSuccess("¡Calificación guardada con éxito!");
            setFormData({...initialState, client_id: ''}); 
        
        } catch (err) {
            // --- BLOQUE DE ERROR MEJORADO ---
            console.error("Error completo de Axios:", err); // DEBUG: Muestra el error completo

            if (err.response && err.response.data) {
                // Si DRF envía un objeto de error (ej. {"campo": ["mensaje"]})
                const errorData = err.response.data;
                console.error("Respuesta de error del Backend:", errorData); // DEBUG: Muestra el error de DRF

                // Intenta formatear el error para el usuario
                const firstKey = Object.keys(errorData)[0];
                if (firstKey && Array.isArray(errorData[firstKey])) {
                    setError(`Error en el campo '${firstKey}': ${errorData[firstKey][0]}`);
                } else {
                    setError(errorData.error || "Error al guardar la calificación.");
                }
            } else {
                // Si no hay respuesta del backend (ej. error de red)
                setError("Error desconocido al guardar la calificación.");
            }
        }
        setLoading(false);
    };

    // --- (Resto del JSX: return(...)) ---
    // (El JSX no necesita cambios, solo el handleSubmit de arriba)
    return (
        <>
            <h1>Ingresar Calificación</h1>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}

            <form onSubmit={handleSubmit}>
                {/* --- SELECCIÓN DE CLIENTE --- */}
                <div style={formSectionStyle}>
                    <h3>Asignar a Cliente</h3>
                    <select 
                        name="client_id"
                        value={formData.client_id}
                        onChange={handleChange}
                        required
                        style={{ width: '100%', padding: '8px' }}
                    >
                        <option value="">-- Por favor, elige un cliente --</option>
                        {clientList.map(client => (
                            <option key={client.user_id} value={client.user_id}>
                                {client.username} (ID: {client.user_id})
                            </option>
                        ))}
                    </select>
                </div>

                {/* --- Formulario Principal --- */}
                <div style={formSectionStyle}>
                    <h3>Datos de Cabecera</h3>
                    {/* Fila 1 */}
                    <div style={gridStyle(3)}>
                        <div>
                            <label>Mercado</label>
                            <input type="text" name="mercado" value={formData.mercado} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Factor de</label>
                            <input type="number" step="0.00000001" name="factor" value={formData.factor} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Año</label>
                            <input type="number" name="año" value={formData.año} onChange={handleChange} />
                        </div>
                    </div>
                    {/* Fila 2 */}
                    <div style={gridStyle(3)}>
                        <div>
                            <label>Descripción</label>
                            <input type="text" name="descripcion" value={formData.descripcion} onChange={handleChange} />
                        </div>
                        <div>
                            <label>DD-MM-YYYY</label>
                            <input type="date" name="fecha" value={formData.fecha} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Instrumento</label>
                            <input type="text" name="instrumento" value={formData.instrumento} onChange={handleChange} />
                        </div>
                    </div>
                    {/* Fila 3 */}
                    <div style={gridStyle(3)}>
                        <div>
                            <label>Secuencia Evento</label>
                            <input type="number" name="secuencia_evento" value={formData.secuencia_evento} onChange={handleChange} />
                        </div>
                        <div>
                            <label>Valor Historico</label>
                            <input type="number" step="0.00000001" name="valor_historico" value={formData.valor_historico} onChange={handleChange} />
                        </div>
                    </div>
                </div>
                
                <button type="submit" disabled={loading} style={submitButtonStyle}>
                    {loading ? 'Guardando...' : 'Guardar Calificación'}
                </button>
            </form>
        </>
    );
}

// --- Estilos (sin cambios) ---
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
    gap: '1rem'
});
const submitButtonStyle = {
    padding: '10px 20px',
    fontSize: '1.1rem',
    backgroundColor: 'var(--naranja-principal)',
    color: 'white',
    border: 'none',
    borderRadius: '0', // <-- CAMBIADO a Cuadrado
    cursor: 'pointer'
};

export default IngresarCalificacion;