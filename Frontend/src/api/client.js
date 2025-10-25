import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Cliente para llamadas al backend tradicional (Express)
export const apiClient = {
  get: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, { headers });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
      throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
  },

  post: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
      throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
  },

  put: async (endpoint, data, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'PUT',
      headers,
      body: JSON.stringify(data)
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
      throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
  },

  delete: async (endpoint, token = null) => {
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'DELETE',
      headers
    });
    if (!response.ok) {
      const error = await response.json().catch(() => ({ error: 'Error en la petición' }));
      throw new Error(error.error || 'Error en la petición');
    }
    return response.json();
  }
};

// Exportar también el cliente de Supabase para uso directo
export { supabase };