// src/components/CargaPage.jsx (REEMPLAZO)

import React, { useState, useEffect } from 'react';
import Header from './Header';
// 1. Importa las funciones de rol y las nuevas funciones de API
import { uploadTributarioDocument, getClientList, getCurrentUserRole } from '../apiService';
import { useNavigate } from 'react-router-dom';

function CargaPage() {
    // 1. Cambiado a plural: selectedFiles
    const [selectedFiles, setSelectedFiles] = useState(null); 
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const [userRole, setUserRole] = useState(null);
    const [clientList, setClientList] = useState([]);
    const [selectedClient, setSelectedClient] = useState(''); 
    
    const navigate = useNavigate();

    useEffect(() => {
        const role = getCurrentUserRole(); 
        setUserRole(role);

        if (role === 'admin' || role === 'corredor_tributario') {
            const fetchClients = async () => {
                try {
                    const response = await getClientList();
                    setClientList(response.data);
                } catch (err) {
                    console.error("Error cargando la lista de clientes", err);
                    setError("No se pudo cargar la lista de clientes.");
                }
            };
            fetchClients();
        }
    }, []); 

    const handleFileChange = (e) => {
        // 2. Almacena el FileList completo (múltiples archivos)
        setSelectedFiles(e.target.files); 
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // 3. Comprueba la longitud
        if (!selectedFiles || selectedFiles.length === 0) {
            setError('Por favor, selecciona uno o más archivos.');
            return;
        }

        if ((userRole === 'admin' || userRole === 'corredor_tributario') && !selectedClient) {
            setError('Por favor, selecciona un cliente para asignarle los archivos.');
            return;
        }

        setUploading(true);
        setError(null);
        setSuccess(null);

        const formData = new FormData();

        // 4. Bucle para añadir todos los archivos bajo la misma clave 'archivo'
        for (const file of selectedFiles) {
            formData.append('archivo', file);
        }

        // Añade el client_id (lógica existente)
        if ((userRole === 'admin' || userRole === 'corredor_tributario') && selectedClient) {
            formData.append('client_id', selectedClient);
        }

        try {
            // Llama a la misma función de API, ahora envía múltiples archivos
            await uploadTributarioDocument(formData); 
            
            setSuccess(`¡${selectedFiles.length} archivo(s) subido(s) con éxito!`);
            setSelectedFiles(null); 
            document.getElementById('file-input').value = null; // Resetea el input
            
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.response?.data?.archivo?.[0] || 'Error al subir los archivos.';
            if (errorMsg.includes('extension')) {
                 setError('Error: Tipo de archivo no permitido. Solo se aceptan PDF, XLS o XLSX.');
            } else {
                 setError(errorMsg);
            }
            console.error(err);
        }
        setUploading(false);
    };

    // 5. Función de ayuda para renderizar la lista de nombres
    const renderPreview = () => {
        if (!selectedFiles || selectedFiles.length === 0) {
            return <p style={{ padding: '1rem', color: '#888' }}>Selecciona uno o más archivos.</p>;
        }

        // Convierte el FileList en un array para poder usar .map()
        const filesArray = Array.from(selectedFiles); 

        return (
            <div style={{ padding: '1rem' }}>
                <strong>Archivos seleccionados:</strong>
                <ul style={{ maxHeight: '200px', overflowY: 'auto', background: '#fff', padding: '10px' }}>
                    {filesArray.map((file, index) => (
                        <li key={index}>📄 {file.name}</li>
                    ))}
                </ul>
            </div>
        );
    };

    return (
        // Asumiendo que ya quitaste el <Header /> por el Layout
        <>
            <h1>Subir Nuevos Archivos</h1>
            <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '2rem' }}>
                
                {/* Columna Izquierda: Formulario */}
                <div style={{ flex: 1 }}>
                    <p>Formatos permitidos: PDF, XLS, XLSX.</p>

                    {/* Desplegable de Cliente (lógica existente) */}
                    {(userRole === 'admin' || userRole === 'corredor_tributario') && (
                        <div style={{ marginBottom: '1rem' }}>
                            <label htmlFor="cliente-select" style={{ display: 'block', marginBottom: '5px' }}>
                                <strong>Seleccionar Cliente:</strong>
                            </label>
                            <select 
                                id="cliente-select"
                                value={selectedClient}
                                onChange={(e) => setSelectedClient(e.target.value)}
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
                    )}

                    <div style={{ marginBottom: '1rem' }}>
                        <input 
                            id="file-input"
                            type="file" 
                            accept=".pdf,.xls,.xlsx"
                            onChange={handleFileChange}
                            multiple // 6. ¡Atributo 'multiple' añadido!
                        />
                    </div>
                    
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    
                    <button type="submit" disabled={uploading} style={{marginTop: '1rem'}}>
                        {uploading ? 'Subiendo...' : `Subir ${selectedFiles ? selectedFiles.length : 0} Archivo(s)`}
                    </button>
                </div>

                {/* Columna Derecha: Previsualización (Lista de archivos) */}
                <div style={{ flex: 1, border: '1px solid #ccc', background: '#f9f9f9', minHeight: '300px' }}>
                    {renderPreview()}
                </div>

            </form>
        </>
    );
}

export default CargaPage;