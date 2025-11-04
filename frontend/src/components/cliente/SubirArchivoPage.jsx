// src/components/cliente/SubirArchivoPage.jsx (Actualizado)

import React, { useState, useEffect } from 'react'; // 1. Importa useEffect
import Header from '../Header';
import { uploadTributarioDocument } from '../../apiService'; // Nombre corregido
import { useNavigate } from 'react-router-dom';

function SubirArchivoPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    // --- NUEVO: Estado para la previsualización ---
    const [previewUrl, setPreviewUrl] = useState(null);
    const [fileType, setFileType] = useState(null); // 'pdf', 'excel', u 'other'

    // 2. Limpia la URL temporal para evitar fugas de memoria
    useEffect(() => {
        // Esto se ejecuta cuando el componente se desmonta o 'previewUrl' cambia
        return () => {
            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        // Limpia la previsualización anterior
        if (previewUrl) {
            URL.revokeObjectURL(previewUrl);
            setPreviewUrl(null);
        }

        if (!file) {
            setSelectedFile(null);
            setFileType(null);
            return;
        }

        setSelectedFile(file);

        // 3. Revisa el tipo de archivo para la previsualización
        if (file.type === "application/pdf") {
            // Es un PDF: crea una URL temporal para el <iframe>
            const tempUrl = URL.createObjectURL(file);
            setPreviewUrl(tempUrl);
            setFileType('pdf');
        } else if (file.type.includes("excel") || file.type.includes("spreadsheetml")) {
            // Es Excel: no hay previsualización, solo muestra el nombre
            setFileType('excel');
        } else {
            // Otro tipo (aunque el 'accept' debería limitarlo)
            setFileType('other');
        }
    };

    const handleSubmit = async (e) => {
        // ... (Tu lógica de handleSubmit existente, no necesita cambios)
        e.preventDefault();
        if (!selectedFile) {
            setError('Por favor, selecciona un archivo.');
            return;
        }

        setUploading(true);
        setError(null);
        const formData = new FormData();
        formData.append('archivo', selectedFile);

        try {
            await uploadTributarioDocument(formData); // Usa el nombre corregido
            alert('¡Archivo subido con éxito! La alerta se ha generado.');
            navigate('/home'); 
        
        } catch (err) {
            // ... (manejo de errores existente) ...
             if (err.response && err.response.status === 400) {
                 setError('Error: Tipo de archivo no permitido. Solo se aceptan PDF, XLS o XLSX.');
            } else {
                 setError('Error al subir el archivo.');
            }
            console.error(err);
        }
        setUploading(false);
    };

    return (
        <div>
            <main style={{ padding: '2rem', maxWidth: '800px', margin: 'auto' }}>
                <h1>Subir Nuevo Archivo</h1>
                <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '2rem' }}>
                    
                    {/* Columna Izquierda: Formulario */}
                    <div style={{ flex: 1 }}>
                        <p>Formatos permitidos: PDF, XLS, XLSX.</p>
                        <input 
                            type="file" 
                            accept=".pdf,.xls,.xlsx"
                            onChange={handleFileChange}
                        />
                        
                        {error && <p style={{ color: 'red' }}>{error}</p>}
                        
                        <button type="submit" disabled={uploading} style={{marginTop: '1rem'}}>
                            {uploading ? 'Subiendo...' : 'Subir Archivo'}
                        </button>
                    </div>

                    {/* 4. Columna Derecha: Previsualización */}
                    <div style={{ flex: 1, border: '1px solid #ccc', background: '#f9f9f9', minHeight: '300px' }}>
                        {fileType === 'pdf' && previewUrl && (
                            <iframe 
                                src={previewUrl}
                                title="Previsualización de PDF"
                                width="100%"
                                height="400px"
                                style={{ border: 'none' }}
                            />
                        )}
                        
                        {fileType === 'excel' && selectedFile && (
                            <div style={{ padding: '1rem' }}>
                                <strong>Archivo Excel seleccionado:</strong>
                                <p>📄 {selectedFile.name}</p>
                                <small>(La previsualización no está disponible para archivos Excel)</small>
                            </div>
                        )}

                        {fileType === 'other' && (
                            <p style={{ padding: '1rem' }}>Tipo de archivo no soportado para previsualización.</p>
                        )}

                        {!fileType && (
                            <p style={{ padding: '1rem', color: '#888' }}>Selecciona un archivo para ver la previsualización.</p>
                        )}
                    </div>

                </form>
            </main>
        </div>
    );
}

export default SubirArchivoPage;