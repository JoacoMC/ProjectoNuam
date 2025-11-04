// src/components/CreateUserPage.jsx

import React, { useState } from 'react';
import Header from './Header';
import { registerUser } from '../apiService'; // Reutiliza la misma función de API
import { Navigate } from 'react-router-dom';
import { getCurrentUserRole } from '../apiService';

function CreateUserPage() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('cliente'); // Rol por defecto
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    // Seguridad: Doble chequeo por si alguien accede a la ruta sin ser admin
    if (getCurrentUserRole() !== 'admin') {
        return <Navigate to="/home" />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Llama a la misma función 'registerUser' que ya tenías
            // Esta función ya sabe cómo enviar el rol al backend
            await registerUser(username, password, role);
            setSuccess(`¡Usuario '${username}' creado con éxito!`);
            
            // Limpia el formulario
            setUsername('');
            setPassword('');
            setRole('cliente');

        } catch (err) {
            setError('Error al crear el usuario. ¿Quizás el nombre ya existe?');
            console.error(err);
        }
    };

    return (
        <div>
            <main style={{ padding: '2rem', maxWidth: '500px', margin: 'auto' }}>
                <h2>Crear Nuevo Usuario (Admin)</h2>
                <form onSubmit={handleSubmit}>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    {success && <p style={{ color: 'green' }}>{success}</p>}
                    
                    <div>
                        <label>Nuevo Usuario:</label>
                        <input 
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label>Contraseña:</label>
                        <input 
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }}
                        />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                        <label>Rol del Nuevo Usuario:</label>
                        {/* El admin puede seleccionar CUALQUIER rol */}
                        <select 
                            value={role} 
                            onChange={(e) => setRole(e.target.value)}
                            style={{ width: '100%', padding: '8px' }}
                        >
                            <option value="cliente">Cliente</option>
                            <option value="corredor_tributario">Corredor Tributario</option>
                            <option value="admin">Administrador</option>
                        </select>
                    </div>
                    <button 
                        type="submit" 
                        style={{ ...buttonStyle, marginTop: '1rem', width: '100%' }}
                    >
                        Crear Usuario
                    </button>
                </form>
            </main>
        </div>
    );
}

// Estilos del botón (copiados de AdminHome para consistencia)
const buttonStyle = {
    padding: '10px 15px',
    backgroundColor: '#007bff',
    color: 'white',
    textDecoration: 'none',
    borderRadius: '5px',
    fontSize: '1rem',
    fontWeight: 'bold',
    border: 'none',
    cursor: 'pointer'
};

export default CreateUserPage;