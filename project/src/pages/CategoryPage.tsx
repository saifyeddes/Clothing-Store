import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';

const CategoryPage: React.FC = () => {
  const { gender } = useParams<{ gender: string }>();
  const { addToCart } = useCart();
  
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  // Filter products by gender
  const filteredProducts = mockProducts.filter(product => {
    if (gender === 'homme') return product.gender === 'homme';
    if (gender === 'femme') return product.gender === 'femme';
    if (gender === 'enfant') return product.gender === 'unisexe'; // Assuming kids products are unisex
    return true;
  });

  // Apply additional filters
  const finalProducts = filteredProducts.filter(product => {
    const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
    const colorMatch = selectedColors.length === 0 || product.colors.some(color => selectedColors.includes(color));
    const sizeMatch = selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.includes(size));
    
    return priceInRange && colorMatch && sizeMatch;
  });

  // Sort products
  const sortedProducts = [...finalProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name':
        return a.name.localeCompare(b.name);
      default:
        return 0;
    }
  });

  const handleQuickAddToCart = (product: any) => {
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    addToCart(product, defaultSize, defaultColor, 1);
    alert('Produit ajouté au panier !');
  };

  const getCategoryTitle = () => {
    switch (gender) {
      case 'homme':
        return 'T-Shirts Homme';
      case 'femme':
        return 'T-Shirts Femme';
      case 'enfant':
        return 'T-Shirts Enfant';
      default:
        return 'Tous les T-Shirts';
    }
  };

  // Get all unique colors and sizes for filters
  const allColors = [...new Set(filteredProducts.flatMap(p => p.colors))];
  const allSizes = [...new Set(filteredProducts.flatMap(p => p.sizes))];

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">{getCategoryTitle()}</h1>
          <p className="text-gray-600">
            {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Filters Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <div className="flex items-center mb-6">
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                <h2 className="text-lg font-semibold">Filtres</h2>
              </div>

              {/* Sort */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Trier par</h3>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500 focus:border-transparent"
                >
                  <option value="name">Nom</option>
                  <option value="price-low">Prix croissant</option>
                  <option value="price-high">Prix décroissant</option>
                </select>
              </div>

              {/* Price Range */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Prix (TND)</h3>
                <div className="space-y-2">
                  <input
                    type="range"
                    min="0"
                    max="200"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-full"
                  />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>{priceRange[0]} TND</span>
                    <span>{priceRange[1]} TND</span>
                  </div>
                </div>
              </div>

              {/* Colors */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Couleurs</h3>
                <div className="space-y-2">
                  {allColors.map(color => (
                    <label key={color} className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedColors.includes(color)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedColors([...selectedColors, color]);
                          } else {
                            setSelectedColors(selectedColors.filter(c => c !== color));
                          }
                        }}
                        className="mr-2"
                      />
                      <span className="text-sm">{color}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Sizes */}
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-3">Tailles</h3>
                <div className="grid grid-cols-3 gap-2">
                  {allSizes.map(size => (
                    <button
                      key={size}
                      onClick={() => {
                        if (selectedSizes.includes(size)) {
                          setSelectedSizes(selectedSizes.filter(s => s !== size));
                        } else {
                          setSelectedSizes([...selectedSizes, size]);
                        }
                      }}
                      className={`p-2 text-sm border rounded ${
                        selectedSizes.includes(size)
                          ? 'border-yellow-600 bg-yellow-50 text-yellow-600'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products Grid */}
          <div className="lg:col-span-3">
            {sortedProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedProducts.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    product={product} 
                    onAddToCart={handleQuickAddToCart}
                  />
                ))}
              </div>
            ) : (
              <>
                {gender === 'femme' ? (
                  <div className="text-center py-12">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Pas de produits pour le moment
                    </h3>
                    <p className="text-gray-600">
                      Nous avons travaillé pour produire des nouveaux produits pour femme.
                    </p>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Aucun produit trouvé
                    </h3>
                    <p className="text-gray-600">
                      Essayez de modifier vos filtres pour voir plus de produits.
                    </p>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;