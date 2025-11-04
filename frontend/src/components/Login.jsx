// src/components/Login.jsx (Actualizado)

import React, { useState } from 'react';
import { loginUser } from '../apiService';
import { useNavigate, Link } from 'react-router-dom'; // 1. Importa Link
import './Login.css'; // 2. Importa los nuevos estilos

function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await loginUser(username, password); // Llama a la API
            navigate('/home'); // Redirige al Home
        } catch (err) {
            setError('Usuario o contraseña incorrectos.');
            console.error(err);
        }
    };

    return (
        // 3. Aplica las clases CSS
        <div className="login-container">
            <div className="login-form-wrapper">
                <form onSubmit={handleSubmit}>
                    <h2>Iniciar Sesión</h2>
                    
                    {error && <p className="login-error">{error}</p>}
                    
                    <div className="login-input-group">
                        <label htmlFor="username">Usuario:</label>
                        <input 
                            id="username"
                            type="text" 
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    
                    <div className="login-input-group">
                        <label htmlFor="password">Contraseña:</label>
                        <input 
                            id="password"
                            type="password" 
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    
                    <button type="submit" className="login-button">
                        Entrar
                    </button>
                </form>

                {/* 4. Sección de Registro (Nueva) */}
                <div className="login-register-link">
                    ¿No tienes una cuenta? 
                    <Link to="/register"> Regístrate aquí</Link>
                </div>
            </div>
        </div>
    );
}

export default Login;