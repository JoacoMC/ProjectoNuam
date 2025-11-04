// src/components/Register.jsx

import React, { useState } from 'react';
import { registerUser } from '../apiService'; // Importa la función de registro

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    // Estado para el rol, por defecto 'cliente'
    const [role, setRole] = useState('cliente'); 
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        try {
            // Llama a registerUser con username, password y el ROL
            await registerUser(username, password, role);
            setSuccess('¡Usuario registrado con éxito! Ahora puedes iniciar sesión.');
            // Limpia el formulario
            setUsername('');
            setPassword('');
            setRole('cliente');

        } catch (err) {
            setError('Error al registrar el usuario. Inténtalo de nuevo.');
            console.error(err);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <h2>Registrar Nuevo Usuario</h2>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            {success && <p style={{ color: 'green' }}>{success}</p>}
            
            <div>
                <label>Usuario:</label>
                <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Contraseña:</label>
                <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
            </div>
            <div>
                <label>Rol:</label>
                {/* Selector para el ROL basado en el backend */}
                <select value={role} onChange={(e) => setRole(e.target.value)}>
                    <option value="cliente">Cliente</option>
                    <option value="corredor_tributario">Corredor Tributario</option>
                    <option value="admin">Administrador</option>
                </select>
            </div>
            <button type="submit">Registrar</button>
        </form>
    );
}

export default Register;