// src/components/cliente/MisArchivosPage.jsx

import React, { useState, useEffect } from 'react';
import Header from '../Header';
import { getClienteDocumentos, deleteClienteDocumento } from '../../apiService';

function MisArchivosPage() {
    const [documentos, setDocumentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDocumentos = async () => {
        try {
            setLoading(true);
            const response = await getClienteDocumentos();
            setDocumentos(response.data);
            setError(null);
        } catch (err) {
            setError('Error al cargar los documentos.');
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchDocumentos();
    }, []);

    const handleDelete = async (docId) => {
        if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
            try {
                await deleteClienteDocumento(docId);
                // Refresca la lista después de eliminar
                // La alerta se creará automáticamente en el backend
                fetchDocumentos(); 
            } catch (err) {
                alert('Error al eliminar el archivo.');
                console.error(err);
            }
        }
    };

    return (
        <div>
            <main style={{ padding: '2rem' }}>
                <h1>Mis Archivos Subidos</h1>
                {loading && <p>Cargando...</p>}
                {error && <p style={{ color: 'red' }}>{error}</p>}
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th>Nombre del Archivo</th>
                            <th>Fecha de Subida</th>
                            <th>Descargar</th>
                            <th>Acción</th>
                        </tr>
                    </thead>
                    <tbody>
                        {documentos.map(doc => (
                            <tr key={doc.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td>{doc.nombre_archivo}</td>
                                <td>{new Date(doc.fecha).toLocaleString()}</td>
                                <td>
                                    {/* doc.archivo es la URL relativa, ej: /media/documentos_tributarios/archivo.pdf */}
                                    <a href={`http://127.0.0.1:8000${doc.archivo}`} target="_blank" rel="noopener noreferrer">
                                        Descargar
                                    </a>
                                </td>
                                <td>
                                    <button onClick={() => handleDelete(doc.id)} style={{color: 'red'}}>
                                        Eliminar
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default MisArchivosPage;