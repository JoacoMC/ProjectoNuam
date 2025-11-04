// src/apiService.js

import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Obtiene la URL base desde las variables de entorno
const baseURL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000/api";

// Crea una instancia de Axios
const api = axios.create({
    baseURL: baseURL
});

/* * Interceptor de Petición (Request)
 * Esto se ejecuta ANTES de que se envíe cada petición.
 * Su trabajo es tomar el token de localStorage y añadirlo a 
 * la cabecera 'Authorization'.
 */
api.interceptors.request.use(
    (config) => {
        // Obtiene el token de acceso de localStorage
        const token = localStorage.getItem("access_token");
        
        if (token) {
            // Si el token existe, lo añade a las cabeceras
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        // Maneja errores de la petición
        return Promise.reject(error);
    }
);

// --- FUNCIONES DE AUTENTICACIÓN ---

/**
 * Registra un nuevo usuario en el backend.
 * @param {string} username 
 * @param {string} password 
 * @param {string} role ('cliente', 'admin', 'corredor_tributario')
 */
export const registerUser = (username, password, role = 'cliente') => {
    // Envía los datos al endpoint de registro que creamos en Django
    return api.post("/user/register/", { 
        username: username, 
        password: password, 
        role: role // Envía el rol seleccionado
    });
};

/**
 * Inicia sesión obteniendo los tokens JWT.
 * @param {string} username 
 * @param {string} password 
 */
export const loginUser = async (username, password) => {
    try {
        // 1. Obtener los tokens (como antes)
        const tokenResponse = await api.post("/token/", { 
            username: username, 
            password: password 
        });
        
        localStorage.setItem("access_token", tokenResponse.data.access);
        localStorage.setItem("refresh_token", tokenResponse.data.refresh);
        
        // 2. OBTENER EL ROL (NUEVO PASO)
        // Usamos el interceptor que ya añade el token a esta petición
        const profileResponse = await api.get("/user/profile/");
        
        // 3. Guardar el ROL en localStorage
        localStorage.setItem("user_role", profileResponse.data.role);

        return profileResponse; // Devuelve la data del perfil

    } catch (error) {
        // Si falla, limpia todo
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        localStorage.removeItem("user_role");
        console.error("Error en el login:", error);
        throw error;
    }
};

/**
 * Cierra la sesión del usuario borrando los tokens.
 */
export const logoutUser = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    localStorage.removeItem("user_role"); // <-- Asegúrate de borrar el rol también
};

export const getCurrentUserRole = () => {
    return localStorage.getItem("user_role");
};

// --- FUNCIONES DE DATOS (EJEMPLOS) ---

/**
 * Obtiene los documentos tributarios.
 * Esta petición irá autenticada gracias al interceptor.
 */
export const getDocumentos = () => {
    // Llama al endpoint que creamos
    return api.get("/documentos/");
};

/**
 * Obtiene las Alertas.
 */
export const getAlertas = () => {
    return api.get("/alertas/");
};
export const getAllUsers = () => {
    return api.get("/admin/users/");
};

/**
 * (Admin) Actualiza el rol de un usuario específico.
 * Llama al endpoint: PUT /api/admin/user/update-role/
 * @param {number} userId - El ID del usuario a modificar
 * @param {string} newRole - El nuevo rol ('admin', 'cliente', 'corredor_tributario')
 */
export const updateUserRole = (userId, newRole) => {
    return api.put("/admin/user/update-role/", {
        user_id: userId,
        new_role: newRole
    });
};

export const getClienteDocumentos = () => {
    // Apunta a la vista DocumentoTributarioListCreate
    return api.get("/documentos/");
};

/**
 * Sube un nuevo archivo de cliente.
 * Llama a: POST /api/documentos/
 * @param {FormData} formData - El objeto FormData que contiene el archivo.
 */
export const uploadTributarioDocument = (formData) => {
    return api.post("/documentos/", formData, {
        headers: {
            'Content-Type': 'multipart/form-data'
        }
    });
};

/**
 * Elimina un documento de cliente por su ID.
 * Llama a: DELETE /api/documentos/<id>/
 * @param {number} docId - El ID del documento a eliminar.
 */
export const deleteClienteDocumento = (docId) => {
    return api.delete(`/documentos/${docId}/`);
};

/**
 * Obtiene las alertas recientes del cliente.
 * Llama a: GET /api/cliente/alertas/
 */
export const getClienteAlertas = () => {
    // Apunta a la nueva vista ClienteAlertaListView
    return api.get("/cliente/alertas/");
};

export const getClientList = () => {
    return api.get("/admin/clientes/");
};

export const createCalificacion = (calificacionData) => {
    return api.post("/corredor/calificaciones/create/", calificacionData);
};

export const getCalificacionesList = () => {
    return api.get("/corredor/calificaciones/");
};

export const getCalificacionDetail = (id) => {
    return api.get(`/corredor/calificaciones/${id}/`);
};
// Exporta la instancia de api por si necesitas usarla directamente
export default api;