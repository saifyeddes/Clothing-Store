import React, { useState } from 'react';
import { mockOrders } from '../../lib/mockData';
import type { Order } from '../../types';
import { Eye, Trash2, ChevronDown } from 'lucide-react';

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>(mockOrders);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  const handleDelete = (orderId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer cette commande ?')) {
      setOrders(orders.filter(o => o.id !== orderId));
      // In a real app, you would also make an API call to delete the order.
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'shipped': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gérer les Commandes</h1>
      
      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"></th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commande ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Statut</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {orders.map(order => (
                <React.Fragment key={order.id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => toggleExpandOrder(order.id)} className="text-gray-500 hover:text-gray-700">
                        <ChevronDown className={`h-5 w-5 transition-transform ${expandedOrder === order.id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order.id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.user?.full_name || 'N/A'}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.total_amount.toFixed(3)} TND</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button className="text-blue-600 hover:text-blue-900 mr-4"><Eye className="h-5 w-5" /></button>
                      <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-900"><Trash2 className="h-5 w-5" /></button>
                    </td>
                  </tr>
                  {expandedOrder === order.id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="p-4 bg-white rounded-md shadow-inner">
                          <h4 className="font-bold text-md mb-2">Détails de la commande</h4>
                          <p><strong>Adresse de livraison:</strong> {order.shipping_address}</p>
                          <p><strong>Téléphone:</strong> {order.phone}</p>
                          <div className="mt-4">
                            <h5 className="font-semibold mb-2">Articles:</h5>
                            <ul>
                              {order.items.map(item => (
                                <li key={item.id} className="flex justify-between items-center py-1 border-b last:border-b-0">
                                  <div>
                                    <span className="font-medium">{item.product.name}</span>
                                    <span className="text-sm text-gray-500 ml-2">(Taille: {item.size}, Couleur: {item.color})</span>
                                  </div>
                                  <span>{item.quantity} x {item.price.toFixed(3)} TND</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="md:hidden grid grid-cols-1 gap-4">
        {orders.map(order => (
          <div key={order.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-800">Commande #{order.id}</p>
                <p className="text-sm text-gray-600">{order.user?.full_name || 'N/A'}</p>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Date:</strong> {new Date(order.created_at).toLocaleDateString()}</p>
              <p><strong>Total:</strong> {order.total_amount.toFixed(3)} TND</p>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-gray-200 space-x-3">
              <button onClick={() => toggleExpandOrder(order.id)} className="text-blue-600 hover:text-blue-900 flex items-center text-sm">
                <Eye className="h-5 w-5 mr-1" />
                Détails
              </button>
              <button onClick={() => handleDelete(order.id)} className="text-red-600 hover:text-red-900">
                <Trash2 className="h-5 w-5" />
              </button>
            </div>
            {expandedOrder === order.id && (
              <div className="pt-3 mt-3 border-t">
                  <h4 className="font-bold text-md mb-2">Détails de la commande</h4>
                  <p className="text-sm"><strong>Adresse:</strong> {order.shipping_address}</p>
                  <p className="text-sm"><strong>Téléphone:</strong> {order.phone}</p>
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2">Articles:</h5>
                    <ul className="space-y-2">
                      {order.items.map(item => (
                        <li key={item.id} className="flex justify-between items-center text-sm py-1 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{item.product.name}</span>
                            <span className="text-xs text-gray-500 ml-2">(Taille: {item.size}, Couleur: {item.color})</span>
                          </div>
                          <span className="text-xs text-right">{item.quantity} x {item.price.toFixed(3)} TND</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderManagement;

