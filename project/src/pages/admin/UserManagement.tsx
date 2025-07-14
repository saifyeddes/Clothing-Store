import React, { useState } from 'react';
import { mockAdmins } from '../../lib/mockData';
import type { User } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import AdminForm from './AdminForm';

const UserManagement: React.FC = () => {
  const [admins, setAdmins] = useState<User[]>(mockAdmins);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<User | null>(null);

  const handleDelete = (adminId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      setAdmins(admins.filter(a => a.id !== adminId));
      // In a real app, you would also make an API call to delete the admin.
    }
  };

  const handleOpenModal = (admin: User | null = null) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleFormSubmit = (formData: Omit<User, 'id' | 'created_at'>) => {
    if (editingAdmin) {
      // Update existing admin
      const updatedAdmins = admins.map(a =>
        a.id === editingAdmin.id ? { ...a, ...formData } : a
      );
      setAdmins(updatedAdmins);
    } else {
      // Add new admin
      const newAdmin: User = {
        id: `admin-${Date.now()}`,
        created_at: new Date().toISOString(),
        ...formData,
      };
      setAdmins([newAdmin, ...admins]);
    }
    handleCloseModal();
  };

  const getRoleBadge = (role: User['role']) => {
    switch (role) {
      case 'super_admin': return 'bg-red-200 text-red-800';
      case 'admin': return 'bg-blue-200 text-blue-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gérer les Admins</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un admin
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date de création</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {admins.map(admin => (
              <tr key={admin.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{admin.full_name}</td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{admin.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(admin.role)}`}>
                    {admin.role}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(admin.created_at).toLocaleDateString()}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(admin)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900">
                    <Trash2 className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {admins.map(admin => (
          <div key={admin.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div>
              <div className="flex justify-between items-start">
                <h3 className="font-bold text-gray-800 text-lg">{admin.full_name}</h3>
                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getRoleBadge(admin.role)}`}>
                  {admin.role}
                </span>
              </div>
              <p className="text-sm text-gray-600">{admin.email}</p>
            </div>
            <div className="text-sm text-gray-500">
              <span>Membre depuis: </span>
              <span>{new Date(admin.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-gray-200 space-x-3">
              <button onClick={() => handleOpenModal(admin)} className="text-indigo-600 hover:text-indigo-900">
                <Edit className="h-5 w-5" />
              </button>
              <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAdmin ? 'Modifier l\'Admin' : 'Ajouter un Admin'}>
        <AdminForm admin={editingAdmin} onSubmit={handleFormSubmit} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default UserManagement;

