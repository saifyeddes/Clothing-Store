// src/services/api.ts
import axios from 'axios';

const API_URL = 'http://localhost:5000/api';
export const ASSETS_BASE = API_URL.replace(/\/?api\/?$/, '');

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT aux requêtes
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercepteur pour gérer les erreurs
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Si non autorisé, déconnecter l'utilisateur
      localStorage.removeItem('token');
      localStorage.removeItem('userInfo');
      window.location.href = '/admin';
    }
    return Promise.reject(error);
  }
);

export const auth = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      return response.data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  },
};

export const products = {
  getAll: async (params?: Record<string, unknown>) => {
    const res = await api.get('/products', { params });
    return res.data;
  },
  create: async (formData: FormData) => {
    const res = await api.post('/products', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  update: async (id: string, formData: FormData) => {
    const res = await api.put(`/products/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/products/${id}`);
    return res.data;
  },
};

export const adminUsers = {
  list: async () => {
    const res = await api.get('/admin/users');
    return res.data;
  },
  create: async (payload: { full_name: string; email: string; password?: string; role?: 'admin' | 'super_admin' }) => {
    const res = await api.post('/admin/users', payload);
    return res.data;
  },
  update: async (id: string, payload: Partial<{ full_name: string; email: string; role: 'admin' | 'super_admin'; isApproved: boolean }>) => {
    const res = await api.put(`/admin/users/${id}`, payload);
    return res.data;
  },
  approve: async (id: string) => {
    const res = await api.post(`/admin/users/${id}/approve`);
    return res.data;
  },
  delete: async (id: string) => {
    const res = await api.delete(`/admin/users/${id}`);
    return res.data;
  },
};

export default api;