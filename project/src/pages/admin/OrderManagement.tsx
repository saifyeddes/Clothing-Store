import React, { useEffect, useState } from 'react';
import { ChevronDown, CheckCircle, XCircle, FileText } from 'lucide-react';
import { orders as ordersApi } from '../../services/api';

type BackendOrderItem = {
  product_id: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  price: number;
};

type BackendOrder = {
  _id: string;
  user_email: string;
  user_full_name: string;
  items: BackendOrderItem[];
  total_amount: number;
  status: 'pending' | 'approved' | 'rejected';
  shipping_address: string;
  phone: string;
  createdAt: string;
};

const OrderManagement: React.FC = () => {
  const [orders, setOrders] = useState<BackendOrder[]>([]);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data: BackendOrder[] = await ordersApi.list();
        setOrders(data);
      } catch (e) {
        console.error('Failed to load orders', e);
        setError("Impossible de charger les commandes");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleApprove = async (orderId: string) => {
    try {
      const updated = await ordersApi.approve(orderId);
      setOrders(prev => prev.map(o => (o._id === orderId ? updated : o)));
    } catch (e) {
      console.error('approve failed', e);
    }
  };

  const handleReject = async (orderId: string) => {
    try {
      const updated = await ordersApi.reject(orderId);
      setOrders(prev => prev.map(o => (o._id === orderId ? updated : o)));
    } catch (e) {
      console.error('reject failed', e);
    }
  };

  const toggleExpandOrder = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const getStatusBadge = (status: BackendOrder['status']) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleOpenPdf = async (orderId: string) => {
    try {
      setDownloadingId(orderId);
      const blob = await ordersApi.downloadPdf(orderId);
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
      // Optionally revoke after a delay
      setTimeout(() => URL.revokeObjectURL(url), 10000);
    } catch (e) {
      console.error('download pdf failed', e);
    } finally {
      setDownloadingId(null);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Gérer les Commandes</h1>
      
      {loading && <div className="text-gray-600">Chargement...</div>}
      {error && <div className="text-red-600">{error}</div>}
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
                <React.Fragment key={order._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button onClick={() => toggleExpandOrder(order._id)} className="text-gray-500 hover:text-gray-700">
                        <ChevronDown className={`h-5 w-5 transition-transform ${expandedOrder === order._id ? 'rotate-180' : ''}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{order._id}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.user_full_name} ({order.user_email})</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{new Date(order.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{order.total_amount.toFixed(3)} TND</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-3">
                      <button onClick={() => handleOpenPdf(order._id)} className="text-gray-600 hover:text-gray-900 inline-flex items-center disabled:opacity-50" disabled={downloadingId===order._id}>
                        <FileText className="h-5 w-5" />
                      </button>
                      <button onClick={() => handleApprove(order._id)} className="text-green-600 hover:text-green-800 inline-flex items-center"><CheckCircle className="h-5 w-5" /></button>
                      <button onClick={() => handleReject(order._id)} className="text-red-600 hover:text-red-800 inline-flex items-center"><XCircle className="h-5 w-5" /></button>
                    </td>
                  </tr>
                  {expandedOrder === order._id && (
                    <tr className="bg-gray-50">
                      <td colSpan={7} className="px-6 py-4">
                        <div className="p-4 bg-white rounded-md shadow-inner">
                          <h4 className="font-bold text-md mb-2">Détails de la commande</h4>
                          <p><strong>Adresse de livraison:</strong> {order.shipping_address}</p>
                          <p><strong>Téléphone:</strong> {order.phone}</p>
                          <div className="mt-4">
                            <h5 className="font-semibold mb-2">Articles:</h5>
                            <ul>
                              {order.items.map((item, idx) => (
                                <li key={`${order._id}-${idx}`} className="flex justify-between items-center py-1 border-b last:border-b-0">
                                  <div>
                                    <span className="font-medium">{item.name}</span>
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
          <div key={order._id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-semibold text-gray-800">Commande #{order._id}</p>
                <p className="text-sm text-gray-600">{order.user_full_name} ({order.user_email})</p>
              </div>
              <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusBadge(order.status)}`}>
                {order.status}
              </span>
            </div>
            <div className="text-sm text-gray-700 space-y-1">
              <p><strong>Date:</strong> {new Date(order.createdAt).toLocaleDateString()}</p>
              <p><strong>Total:</strong> {order.total_amount.toFixed(3)} TND</p>
            </div>
            <div className="flex justify-end items-center pt-2 border-t border-gray-200 space-x-3">
              <button onClick={() => handleOpenPdf(order._id)} className="text-gray-600 hover:text-gray-900 flex items-center text-sm disabled:opacity-50" disabled={downloadingId===order._id}>
                <FileText className="h-5 w-5 mr-1" /> PDF
              </button>
              <button onClick={() => handleApprove(order._id)} className="text-green-600 hover:text-green-800 flex items-center text-sm">
                <CheckCircle className="h-5 w-5 mr-1" /> Approuver
              </button>
              <button onClick={() => handleReject(order._id)} className="text-red-600 hover:text-red-800 flex items-center text-sm">
                <XCircle className="h-5 w-5 mr-1" /> Rejeter
              </button>
            </div>
            {expandedOrder === order._id && (
              <div className="pt-3 mt-3 border-t">
                  <h4 className="font-bold text-md mb-2">Détails de la commande</h4>
                  <p className="text-sm"><strong>Adresse:</strong> {order.shipping_address}</p>
                  <p className="text-sm"><strong>Téléphone:</strong> {order.phone}</p>
                  <div className="mt-4">
                    <h5 className="font-semibold mb-2">Articles:</h5>
                    <ul className="space-y-2">
                      {order.items.map((item, idx) => (
                        <li key={`${order._id}-${idx}`} className="flex justify-between items-center text-sm py-1 border-b last:border-b-0">
                          <div>
                            <span className="font-medium">{item.name}</span>
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

