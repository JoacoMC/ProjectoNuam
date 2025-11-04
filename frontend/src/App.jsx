import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// --- Importaciones de Componentes Principales ---
import Login from './components/Login';
import Register from './components/Register';
import HomeSwitcher from './components/HomeSwitcher';
import CargaPage from './components/CargaPage';
import LogsPage from './components/LogsPage';
import Layout from './components/Layout'; // Importa la plantilla de Layout

// --- Importaciones de Rutas Protegidas ---
import ProtectedRoute from './components/ProtectedRoute'; 
import AdminRoute from './components/AdminRoute'; 
import CorredorOrAdminRoute from './components/CorredorOrAdminRoute';

// --- Importaciones de Páginas de Admin ---
import CreateUserPage from './components/CreateUserPage';
import ManageRolesPage from './components/ManageRolesPage';

// --- Importaciones de Páginas de Cliente ---
import MisArchivosPage from './components/cliente/MisArchivosPage';
import SubirArchivoPage from './components/cliente/SubirArchivoPage';

// --- Importaciones de Páginas de Corredor ---
import EditarRegistros from './components/corredor/EditarRegistros';
import ConsultarFactores from './components/corredor/ConsultarFactores';
import FirmarDocumentos from './components/corredor/FirmarDocumentos';
import HistorialCliente from './components/corredor/HistorialCliente';
import IngresarCalificacion from './components/corredor/IngresarCalificacion';


function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* --- Rutas Públicas (Sin Layout) --- */}
                {/* Cualquiera puede acceder a Login y Registro */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* --- RUTAS PROTEGIDAS (Envueltas en el Layout) --- */}
                {/* Todas las rutas aquí dentro usarán el Header y Footer */}
                <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                    
                    {/* Rutas Generales */}
                    <Route path="/home" element={<HomeSwitcher />} />
                    <Route path="/carga" element={<CargaPage />} />
                    
                    {/* Rutas de Cliente */}
                    <Route path="/mis-archivos" element={<MisArchivosPage />} />
                    <Route path="/subir-archivo" element={<SubirArchivoPage />} />

                    {/* Rutas de Corredor (Protegidas por CorredorOrAdminRoute) */}
                    <Route path="/corredor/editar-registros" element={<CorredorOrAdminRoute><EditarRegistros /></CorredorOrAdminRoute>} />
                    <Route path="/corredor/consultar-factores" element={<CorredorOrAdminRoute><ConsultarFactores /></CorredorOrAdminRoute>} />
                    <Route path="/corredor/firmar-documentos" element={<CorredorOrAdminRoute><FirmarDocumentos /></CorredorOrAdminRoute>} />
                    <Route path="/corredor/historial-cliente" element={<CorredorOrAdminRoute><HistorialCliente /></CorredorOrAdminRoute>} />
                    <Route path="/corredor/ingresar-calificacion" element={<CorredorOrAdminRoute><IngresarCalificacion /></CorredorOrAdminRoute>} />

                    {/* Rutas de Admin (Protegidas por AdminRoute) */}
                    <Route path="/logs" element={<AdminRoute><LogsPage /></AdminRoute>} />
                    <Route path="/admin/create-user" element={<AdminRoute><CreateUserPage /></AdminRoute>} />
                    <Route path="/admin/manage-roles" element={<AdminRoute><ManageRolesPage /></AdminRoute>} />
                    
                </Route>

                {/* --- Redirección por Defecto --- */}
                {/* Redirige cualquier otra ruta (incluyendo "/") al login */}
                <Route path="*" element={<Navigate to="/login" />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;