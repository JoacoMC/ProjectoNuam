// src/components/ManageRolesPage.jsx (Código completo)

import React, { useState, useEffect } from 'react';
import Header from './Header';
// 1. Importa las nuevas funciones de la API
import { getAllUsers, updateUserRole, getCurrentUserRole } from '../apiService';
import { Navigate } from 'react-router-dom';

function ManageRolesPage() {
    // 2. Define el estado para usuarios, carga y errores
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // 3. Doble chequeo de seguridad
    if (getCurrentUserRole() !== 'admin') {
        return <Navigate to="/home" />;
    }

    // 4. useEffect para cargar los usuarios cuando el componente se monta
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await getAllUsers();
                setUsers(response.data); // Guarda los usuarios en el estado
            } catch (err) {
                setError("Error al cargar los usuarios. ¿Tienes permisos de administrador?");
                console.error("Error fetching users", err);
            }
            setLoading(false);
        };
        fetchUsers();
    }, []); // El array vacío [] asegura que se ejecute solo una vez

    // 5. Handler para cuando el admin cambia el <select>
    const handleChangeRole = async (userId, newRole) => {
        try {
            // Llama a la API para actualizar el rol
            await updateUserRole(userId, newRole);
            
            // Actualiza el estado localmente para que el UI sea instantáneo
            setUsers(users.map(user => 
                user.id === userId ? { ...user, role: newRole } : user
            ));

        } catch (err) {
            console.error("Error updating role", err);
            alert("Error al actualizar el rol.");
        }
    };

    // 6. Lógica de renderizado
    if (loading) {
        return (
            <div>
                <main style={{ padding: '2rem' }}><p>Cargando usuarios...</p></main>
            </div>
        );
    }

    if (error) {
        return (
            <div>
                <main style={{ padding: '2rem' }}><p style={{color: 'red'}}>{error}</p></main>
            </div>
        );
    }

    return (
        <div>
            <main style={{ padding: '2rem' }}>
                <h1>Gestionar Roles de Usuario</h1>
                <p>Modifica el rol de cualquier usuario en el sistema.</p>
                
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '2px solid black' }}>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Usuario (ID)</th>
                            <th style={{ textAlign: 'left', padding: '8px' }}>Rol Actual</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id} style={{ borderBottom: '1px solid #ccc' }}>
                                <td style={{ padding: '8px' }}>
                                    {user.username} ({user.id})
                                </td>
                                <td style={{ padding: '8px' }}>
                                    <select 
                                        value={user.role} 
                                        onChange={(e) => handleChangeRole(user.id, e.target.value)}
                                        style={{ padding: '5px', fontSize: '1rem' }}
                                    >
                                        <option value="cliente">Cliente</option>
                                        <option value="corredor_tributario">Corredor Tributario</option>
                                        <option value="admin">Administrador</option>
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </main>
        </div>
    );
}

export default ManageRolesPage;