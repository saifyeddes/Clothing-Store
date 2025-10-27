import React, { useEffect, useState } from 'react';
import type { User } from '../../types';
import { Plus, Edit, Trash2, CheckCircle2, XCircle } from 'lucide-react';
import Modal from '../../components/Modal';
import AdminForm from './AdminForm';
import { adminUsers } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';

const UserManagement: React.FC = () => {
  interface AdminUser extends User { isApproved?: boolean }
  const [admins, setAdmins] = useState<AdminUser[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAdmin, setEditingAdmin] = useState<AdminUser | null>(null);
  const { user: currentUser } = useAuth();

  const mapFromBackend = (u: any): AdminUser => ({
    id: u._id,
    email: u.email,
    full_name: u.full_name,
    role: u.role,
    created_at: u.createdAt,
    isApproved: u.isApproved,
  });

  useEffect(() => {
    const load = async () => {
      try {
        const data = await adminUsers.list();
        setAdmins((data || []).map(mapFromBackend));
      } catch {
        console.error('Failed to load admins', e);
      }
    };
    load();
  }, []);

  const handleDelete = (adminId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cet administrateur ?')) {
      const prev = admins;
      setAdmins(admins.filter(a => a.id !== adminId));
      adminUsers.delete(adminId).catch(() => setAdmins(prev));
    }
  };

  const handleOpenModal = (admin: AdminUser | null = null) => {
    setEditingAdmin(admin);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingAdmin(null);
  };

  const handleFormSubmit = async (formData: Partial<User> & { password?: string; role?: User['role'] }) => {
    try {
      if (editingAdmin) {
        const updated = await adminUsers.update(editingAdmin.id, {
          full_name: formData.full_name!,
          email: formData.email!,
          role: formData.role as any,
        });
        const mapped = mapFromBackend(updated);
        setAdmins(prev => prev.map(a => (a.id === mapped.id ? mapped : a)));
      } else {
        const created = await adminUsers.create({
          full_name: formData.full_name!,
          email: formData.email!,
          password: formData.password!,
          role: (formData.role as any) || 'admin',
        });
        const mapped = mapFromBackend(created);
        setAdmins(prev => [mapped, ...prev]);
      }
      handleCloseModal();
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || 'Erreur lors de la sauvegarde';
      alert(msg);
    }
  };

  const handleApprove = async (adminId: string) => {
    try {
      const updated = await adminUsers.approve(adminId);
      const mapped = mapFromBackend(updated);
      setAdmins(prev => prev.map(a => (a.id === mapped.id ? mapped : a)));
    } catch (e: any) {
      const msg = e?.response?.data?.message || e?.message || "Erreur lors de l'approbation";
      alert(msg);
    }
  };

  const handleApproveAll = async () => {
    if (currentUser?.role !== 'super_admin') return;
    const pending = admins.filter(a => !a.isApproved);
    if (pending.length === 0) return;
    try {
      const results = await Promise.allSettled(pending.map(a => adminUsers.approve(a.id)));
      const approvedIds = results
        .map((r, i) => (r.status === 'fulfilled' ? pending[i].id : null))
        .filter(Boolean) as string[];
      setAdmins(prev => prev.map(a => (approvedIds.includes(a.id) ? { ...a, isApproved: true } : a)));
    } catch {
      alert("Erreur lors de l'approbation en masse");
    }
  };

  const handleRefuseAll = async () => {
    if (currentUser?.role !== 'super_admin') return;
    const pending = admins.filter(a => !a.isApproved && a.email !== 'admin@room.tn');
    if (pending.length === 0) return;
    if (!window.confirm('Confirmer la suppression de tous les admins en attente ?')) return;
    try {
      const results = await Promise.allSettled(pending.map(a => adminUsers.delete(a.id)));
      const deletedIds = results
        .map((r, i) => (r.status === 'fulfilled' ? pending[i].id : null))
        .filter(Boolean) as string[];
      setAdmins(prev => prev.filter(a => !deletedIds.includes(a.id)));
    } catch {
      alert('Erreur lors du refus en masse');
    }
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
        <div className="flex items-center space-x-2">
          {currentUser?.role === 'super_admin' && (
            <>
              <button onClick={handleApproveAll} className="bg-green-600 text-white px-3 py-2 rounded-lg shadow hover:bg-green-700 transition">
                Accepter tous
              </button>
              <button onClick={handleRefuseAll} className="bg-red-600 text-white px-3 py-2 rounded-lg shadow hover:bg-red-700 transition">
                Refuser tous
              </button>
            </>
          )}
          <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center">
            <Plus className="h-5 w-5 mr-2" />
            Ajouter un admin
          </button>
        </div>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rôle</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
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
                <td className="px-6 py-4 whitespace-nowrap text-sm">
                  {admin.isApproved ? (
                    <span className="inline-flex items-center text-green-700"><CheckCircle2 className="h-4 w-4 mr-1" />Approuvé</span>
                  ) : (
                    <span className="inline-flex items-center text-yellow-700">En attente</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                  {currentUser?.role === 'super_admin' && !admin.isApproved ? (
                    <div className="flex items-center space-x-3">
                      <button onClick={() => handleApprove(admin.id)} className="text-green-600 hover:text-green-800" title="Accepter">
                        <CheckCircle2 className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-800" title="Refuser">
                        <XCircle className="h-5 w-5" />
                      </button>
                    </div>
                  ) : (
                    new Date(admin.created_at).toLocaleDateString()
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(admin)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="h-5 w-5" />
                  </button>
                  {currentUser?.role === 'super_admin' && admin.email !== 'admin@room.tn' && (
                    <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900">
                      <Trash2 className="h-5 w-5" />
                    </button>
                  )}
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
            <div className="text-sm">
              {admin.isApproved ? (
                <span className="inline-flex items-center text-green-700"><CheckCircle2 className="h-4 w-4 mr-1" />Approuvé</span>
              ) : (
                <span className="inline-flex items-center text-yellow-700">En attente</span>
              )}
            </div>
            <div className="text-sm text-gray-500">
              <span>Membre depuis: </span>
              <span>{new Date(admin.created_at).toLocaleDateString()}</span>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-gray-200 space-x-3">
              <button onClick={() => handleOpenModal(admin)} className="text-indigo-600 hover:text-indigo-900">
                <Edit className="h-5 w-5" />
              </button>
              {currentUser?.role === 'super_admin' && !admin.isApproved && (
                <button onClick={() => handleApprove(admin.id)} className="text-green-600 hover:text-green-800">
                  <CheckCircle2 className="h-5 w-5" />
                </button>
              )}
              {currentUser?.role === 'super_admin' && !admin.isApproved && (
                <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-800" title="Refuser la demande">
                  <XCircle className="h-5 w-5" />
                </button>
              )}
              {currentUser?.role === 'super_admin' && admin.email !== 'admin@room.tn' && (
                <button onClick={() => handleDelete(admin.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingAdmin ? 'Modifier l\'Admin' : 'Ajouter un Admin'}>
        <AdminForm admin={editingAdmin as any} onSubmit={handleFormSubmit} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default UserManagement;

