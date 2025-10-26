import React, { useState, useEffect } from 'react';
import type { User } from '../../types';
import { useAuth } from '../../contexts/AuthContext';

interface AdminFormProps {
  admin: User | null;
  onSubmit: (formData: any) => void;
  onClose: () => void;
}

const AdminForm: React.FC<AdminFormProps> = ({ admin, onSubmit, onClose }) => {
  const { user: currentUser } = useAuth();
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    password: '',
    role: 'admin' as User['role'],
  });
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (admin) {
      setFormData({
        full_name: admin.full_name,
        email: admin.email,
        password: '', // Password should not be pre-filled
        role: admin.role,
      });
    } else {
      setFormData({
        full_name: '',
        email: '',
        password: '',
        role: 'admin',
      });
    }
  }, [admin]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!admin) {
      if (!formData.password || formData.password.length < 6) {
        setError('Le mot de passe doit contenir au moins 6 caractères');
        return;
      }
    }
    // Prevent non super_admin from setting super_admin role
    const payload = { ...formData } as any;
    if (currentUser?.role !== 'super_admin') {
      payload.role = 'admin';
    }
    if (!payload.password) {
      delete payload.password; // Don't submit empty password
    }
    onSubmit(payload);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>
      )}
      <div>
        <label htmlFor="full_name" className="block text-sm font-medium text-gray-700">Nom complet</label>
        <input
          type="text"
          name="full_name"
          id="full_name"
          value={formData.full_name}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
        <input
          type="email"
          name="email"
          id="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-700">
          Mot de passe {admin ? '(laisser vide pour ne pas changer)' : ''}
        </label>
        <input
          type="password"
          name="password"
          id="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
          required={!admin} // Required only when creating a new admin
        />
      </div>
      <div>
        <label htmlFor="role" className="block text-sm font-medium text-gray-700">Rôle</label>
        <select
          name="role"
          id="role"
          value={formData.role}
          onChange={handleChange}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        >
          <option value="admin">Admin</option>
          {currentUser?.role === 'super_admin' && (
            <option value="super_admin">Super Admin</option>
          )}
        </select>
      </div>
      <div className="flex justify-end space-x-3 pt-4">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-200 text-gray-800 px-4 py-2 rounded-lg hover:bg-gray-300 transition"
        >
          Annuler
        </button>
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition"
        >
          {admin ? 'Mettre à jour' : 'Créer'}
        </button>
      </div>
    </form>
  );
};

export default AdminForm;
