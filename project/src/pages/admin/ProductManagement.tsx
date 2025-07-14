import React, { useState } from 'react';
import { mockProducts, mockCategories } from '../../lib/mockData';
import type { Product } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ProductForm from './ProductForm';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      setProducts(products.filter(p => p.id !== productId));
      // In a real app, you would also make an API call to delete the product from the database.
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  const handleFormSubmit = (formData: Omit<Product, 'id' | 'created_at'>) => {
    if (editingProduct) {
      // Update existing product
      const updatedProducts = products.map(p =>
        p.id === editingProduct.id ? { ...p, ...formData, category: mockCategories.find(c => c.id === formData.category_id) } : p
      );
      setProducts(updatedProducts);
    } else {
      // Add new product
      const newProduct: Product = {
        id: (Math.random() * 10000).toString(), // Temporary ID
        created_at: new Date().toISOString(),
        ...formData,
        category: mockCategories.find(c => c.id === formData.category_id),
      };
      setProducts([newProduct, ...products]);
    }
    handleCloseModal();
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gérer les Produits</h1>
        <button onClick={() => handleOpenModal()} className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition flex items-center">
          <Plus className="h-5 w-5 mr-2" />
          Ajouter un produit
        </button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Catégorie</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {products.map(product => (
              <tr key={product.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img src={product.images[0]} alt={product.name} className="h-12 w-12 rounded-md object-cover" />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{product.name}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700">{product.price.toFixed(3)} TND</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                    {product.stock_quantity}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{product.category?.name || 'Non assigné'}</td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                    <Edit className="h-5 w-5" />
                  </button>
                  <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
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
        {products.map(product => (
          <div key={product.id} className="bg-white rounded-lg shadow-md p-4 space-y-3">
            <div className="flex items-start space-x-4">
              <img src={product.images[0]} alt={product.name} className="h-20 w-20 rounded-md object-cover flex-shrink-0" />
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800 text-lg">{product.name}</h3>
                <p className="text-gray-600 text-sm">{product.category?.name || 'Non assigné'}</p>
                <p className="text-blue-600 font-semibold text-md mt-1">{product.price.toFixed(3)} TND</p>
              </div>
            </div>
            <div className="flex justify-between items-center pt-2 border-t border-gray-200">
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.stock_quantity > 10 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                Stock: {product.stock_quantity}
              </span>
              <div className="flex space-x-3">
                <button onClick={() => handleOpenModal(product)} className="text-indigo-600 hover:text-indigo-900">
                  <Edit className="h-5 w-5" />
                </button>
                <button onClick={() => handleDelete(product.id)} className="text-red-600 hover:text-red-900">
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingProduct ? 'Modifier le Produit' : 'Ajouter un Produit'}>
        <ProductForm product={editingProduct} onSubmit={handleFormSubmit} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ProductManagement;

