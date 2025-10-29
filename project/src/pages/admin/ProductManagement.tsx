import React, { useState } from 'react';
import type { Product } from '../../types';
import { Plus, Edit, Trash2 } from 'lucide-react';
import Modal from '../../components/Modal';
import ProductForm from './ProductForm';
import { products as productsApi } from '../../services/api';

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const API_HOST = 'http://localhost:5000';

  const mapFromBackend = React.useCallback((p: BackendProduct): Product => {
    return {
      id: p._id,
      name: p.name,
      description: p.description,
      price: p.price,
      category_id: p.category,
      category: { id: p.category, name: p.category, image_url: '', created_at: p.createdAt },
      images: Array.isArray(p.images) ? p.images.map((img) => `${API_HOST}${img.url}`) : [],
      sizes: p.sizes || [],
      colors: Array.isArray(p.colors) ? p.colors.map((c) => (typeof c === 'string' ? c : c.name || c.code || '')) : [],
      stock_quantity: p.stock ?? 0,
      is_featured: !!p.is_featured,
      created_at: p.createdAt,
      rating: 5,
    };
  }, [API_HOST]);

  React.useEffect(() => {
    const load = async () => {
      try {
        const data: BackendProduct[] = await productsApi.getAll();
        const mapped: Product[] = (data || []).map((p) => mapFromBackend(p));
        setProducts(mapped);
      } catch (e) {
        console.error('Failed to load products', e);
      }
    };
    load();
  }, [mapFromBackend]);

  type BackendImage = { url: string; alt?: string };
  type BackendColor = { name?: string; code?: string } | string;
  type BackendProduct = {
    _id: string;
    name: string;
    description: string;
    price: number;
    category: string;
    colors?: BackendColor[];
    sizes?: string[];
    images?: BackendImage[];
    stock?: number;
    is_featured?: boolean;
    createdAt: string;
  };

   const getColorStyle = (color: string) => {
    const isHex = /^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/i.test(color);
    if (isHex) return color;
    const isRgb = /^rgba?\(/i.test(color);
    if (isRgb) return color;
    const colorMap: { [key: string]: string } = {
      Noir: '#000000',
      Blanc: '#FFFFFF',
      Gris: '#808080',
      Marine: '#000080',
      Rouge: '#FF0000',
      Bleu: '#0000FF',
      Rose: '#FFC0CB',
      Lavande: '#E6E6FA',
      Jaune: '#FFFF00',
      Menthe: '#98FB98',
      Beige: '#F5F5DC',
      Vert: '#008000',
      Orange: '#FFA500',
      Violet: '#8A2BE2',
      Kaki: '#F0E68C',
      Marron: '#A52A2A',
      Bordeaux: '#800020',
    };
    if (colorMap[color]) return colorMap[color];
    const cap = color.charAt(0).toUpperCase() + color.slice(1).toLowerCase();
    if (colorMap[cap]) return colorMap[cap];
    return color || '#CCCCCC';
  };

  const handleDelete = (productId: string) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce produit ?')) {
      // Optimistic UI
      const prev = products;
      setProducts(products.filter(p => p.id !== productId));
      productsApi.delete(productId).catch(() => setProducts(prev));
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

  const handleFormSubmit = async (data: FormData) => {
    try {
      if (editingProduct) {
        const updated = await productsApi.update(editingProduct.id, data);
        const mapped = mapFromBackend(updated);
        setProducts((prev) => prev.map((p) => (p.id === mapped.id ? mapped : p)));
      } else {
        const created = await productsApi.create(data);
        const mapped = mapFromBackend(created);
        setProducts((prev) => [mapped, ...prev]);
      }
      handleCloseModal();
    } catch (e: any) {
      console.error('Save product failed', e);
      const msg = e?.response?.data?.message || e?.message || 'Erreur lors de la sauvegarde du produit';
      alert(msg);
    }
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
      {/* utilitaires simples */}

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow-md rounded-lg overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nom</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prix</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stock</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tailles</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Couleurs</th>
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
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-1">
                    {(product.sizes || []).map((s) => (
                      <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                        {s}
                      </span>
                    ))}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-wrap gap-2 items-center">
                    {(product.colors || []).map((c, idx) => (
                      <span
                        key={`${c}-${idx}`}
                        title={c}
                        className="inline-block h-4 w-4 rounded-full border border-gray-300"
                        style={{ backgroundColor: getColorStyle(c) }}
                      />
                    ))}
                  </div>
                </td>
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
                <p className="text-blue-600 font-semibold text-md mt-1">{product.price.toFixed(3)} TND</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(product.sizes || []).map((s) => (
                <span key={s} className="px-2 py-0.5 text-xs rounded-full bg-gray-100 text-gray-800 border border-gray-200">
                  {s}
                </span>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-2">
              {(product.colors || []).map((c, idx) => (
                <span
                  key={`${c}-${idx}`}
                  title={c}
                  className="inline-block h-4 w-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColorStyle(c) }}
                />
              ))}
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

