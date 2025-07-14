import React from 'react';
import { Link } from 'react-router-dom';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { useCart } from '../contexts/CartContext';

const Cart: React.FC = () => {
  const { items, updateQuantity, removeFromCart, totalPrice, totalItems } = useCart();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(price);
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-400 mb-6" />
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Votre panier est vide</h2>
            <p className="text-xl text-gray-600 mb-8">
              Découvrez notre collection de t-shirts et ajoutez vos favoris au panier
            </p>
            <Link
              to="/"
              className="inline-flex items-center bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Continuer mes achats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h1 className="text-2xl font-bold text-gray-900">
              Mon Panier ({totalItems} article{totalItems > 1 ? 's' : ''})
            </h1>
          </div>

          <div className="divide-y divide-gray-200">
            {items.map((item) => (
              <div key={item.id} className="p-6 flex items-center space-x-4">
                <div className="flex-shrink-0">
                  <img
                    src={item.product.images[0]}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {item.product.name}
                  </h3>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                      📏 Taille: <span className="text-gray-900">{item.size}</span>
                    </span>
                    <span className="bg-gray-100 px-2 py-1 rounded font-medium">
                      🎨 Couleur: <span className="text-gray-900">{item.color}</span>
                    </span>
                  </div>
                  <p className="text-lg font-bold text-gray-900 mt-2">
                    {formatPrice(item.product.price)}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                    disabled={item.quantity <= 1}
                  >
                    <Minus className="h-4 w-4 text-gray-600" />
                  </button>
                  
                  <span className="w-12 text-center font-semibold">
                    {item.quantity}
                  </span>
                  
                  <button
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    className="p-1 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <Plus className="h-4 w-4 text-gray-600" />
                  </button>
                </div>

                <div className="text-right">
                  <p className="text-lg font-bold text-gray-900 mb-2">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <span className="text-xl font-semibold text-gray-900">Total:</span>
              <span className="text-2xl font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </span>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                to="/"
                className="flex-1 bg-gray-200 text-gray-800 px-6 py-3 rounded-lg text-center font-semibold hover:bg-gray-300 transition-colors"
              >
                Continuer mes achats
              </Link>
              <Link
                to="/checkout"
                className="flex-1 bg-yellow-600 text-white px-6 py-3 rounded-lg text-center font-semibold hover:bg-yellow-700 transition-colors"
              >
                Passer la commande
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;