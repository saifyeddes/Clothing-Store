import React from 'react';
import { ShoppingBag, Users, Star } from 'lucide-react';

const AdminDashboard: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Example Stats Cards */}
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-blue-500 p-3 rounded-full text-white mr-4">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Ventes Totales</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">12,345 TND</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-green-500 p-3 rounded-full text-white mr-4">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Clients</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">1,234</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-yellow-500 p-3 rounded-full text-white mr-4">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Avis</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">456</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center">
          <div className="bg-indigo-500 p-3 rounded-full text-white mr-4">
            <ShoppingBag className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-600">Produits</h3>
            <p className="text-3xl font-bold text-gray-800 mt-1">67</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
