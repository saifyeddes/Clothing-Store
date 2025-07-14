import React, { useState } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, Users, Star, LogOut, ArrowLeft, Menu, X } from 'lucide-react';

const AdminLayout: React.FC = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('isAdminAuthenticated');
    navigate('/admin');
  };

  const handleGoBack = () => {
    navigate(-1); // Go back to the previous page
  };

  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors ${
      isActive
        ? 'bg-blue-600 text-white shadow-md'
        : 'text-gray-700 hover:bg-blue-100 hover:text-blue-700'
    }`;

  return (
    <div className="flex h-screen bg-gray-100 font-sans">
      {/* Sidebar for mobile */}
      {isSidebarOpen && (
        <div className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-20" onClick={() => setSidebarOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 w-64 bg-white border-r border-gray-200 flex flex-col transform ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition-transform duration-300 ease-in-out z-30`}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-700">Admin</h1>
          <button onClick={() => setSidebarOpen(false)} className="md:hidden text-gray-600 hover:text-gray-800">
            <X className="h-6 w-6" />
          </button>
        </div>
        <nav className="flex-grow p-4 space-y-2">
          <button onClick={handleGoBack} className="flex items-center px-4 py-2.5 text-sm font-medium rounded-lg transition-colors text-gray-700 hover:bg-gray-200 w-full mb-2">
            <ArrowLeft className="h-5 w-5 mr-3" />
            Retour
          </button>
          <NavLink to="/admin/dashboard" className={navLinkClasses} end onClick={() => setSidebarOpen(false)}>
            <LayoutDashboard className="h-5 w-5 mr-3" />
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
            <ShoppingBag className="h-5 w-5 mr-3" />
            Gérer les Produits
          </NavLink>
          <NavLink to="/admin/orders" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
            <ShoppingBag className="h-5 w-5 mr-3" />
            Gérer les Commandes
          </NavLink>
          <NavLink to="/admin/users" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
            <Users className="h-5 w-5 mr-3" />
            Gérer les Admins
          </NavLink>
          <NavLink to="/admin/reviews" className={navLinkClasses} onClick={() => setSidebarOpen(false)}>
            <Star className="h-5 w-5 mr-3" />
            Gérer les Avis
          </NavLink>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-4 py-2.5 text-sm font-medium rounded-lg text-red-600 hover:bg-red-100 transition-colors"
          >
            <LogOut className="h-5 w-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="md:hidden bg-white shadow-sm z-10">
            <div className="h-16 flex items-center px-4">
                <button onClick={() => setSidebarOpen(true)} className="text-gray-600 hover:text-gray-800">
                    <Menu className="h-6 w-6" />
                </button>
                <h1 className="text-lg font-semibold ml-4">Admin Panel</h1>
            </div>
        </header>
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
