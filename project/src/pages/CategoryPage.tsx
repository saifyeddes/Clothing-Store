import { useState, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { SlidersHorizontal, X, Filter as FilterIcon } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';

const CategoryPage: React.FC = () => {
  const { gender } = useParams<{ gender: string }>();
  const { addToCart } = useCart();
  
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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

  const handleQuickAddToCart = (product: Product) => {
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

  // Map color names to their corresponding hex codes
  const getColorCode = (colorName: string): string => {
    const colorMap: { [key: string]: string } = {
      'Noir': '#000000',
      'Blanc': '#FFFFFF',
      'Bleu': '#3B82F6',
      'Rouge': '#EF4444',
      'Vert': '#10B981',
      'Jaune': '#F59E0B',
      'Rose': '#EC4899',
      'Gris': '#9CA3AF',
      'Marron': '#92400E',
      'Beige': '#D1B48C',
      'Orange': '#F97316',
      'Violet': '#8B5CF6',
    };
    return colorMap[colorName] || '#CCCCCC';
  };

  // Get all unique colors and sizes for filters
  const allColors = useMemo(() => {
    const colors = new Set<string>();
    filteredProducts.forEach((product: Product) => {
      if (product.colors) {
        product.colors.forEach((color: string) => colors.add(color));
      }
    });
    return Array.from(colors).sort();
  }, [filteredProducts]);

  const allSizes = useMemo(() => {
    const sizes = new Set<string>();
    filteredProducts.forEach((product: Product) => {
      if (product.sizes) {
        product.sizes.forEach((size: string) => sizes.add(size));
      }
    });
    return Array.from(sizes).sort();
  }, [filteredProducts]);

  // Count active filters
  const activeFilterCount = 
    (selectedColors.length > 0 ? 1 : 0) + 
    (selectedSizes.length > 0 ? 1 : 0) + 
    (priceRange[1] < 200 ? 1 : 0);

  const resetFilters = () => {
    setSortBy('name');
    setPriceRange([0, 200]);
    setSelectedColors([]);
    setSelectedSizes([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 pt-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">{getCategoryTitle()}</h1>
            <p className="text-gray-600">
              {sortedProducts.length} produit{sortedProducts.length > 1 ? 's' : ''} trouvé{sortedProducts.length > 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="w-full">
          {/* Products Grid */}
          <div className="w-full">
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
                    <FilterIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
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

      {/* Floating Filter Button */}
      <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
        <button
          onClick={() => setIsFilterOpen(true)}
          className="flex items-center justify-center px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95"
        >
          <SlidersHorizontal className="h-4 w-4 mr-2" />
          <span className="text-sm">Filtrer</span>
          {activeFilterCount > 0 && (
            <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 text-xs font-bold text-yellow-600 bg-white rounded-full border-2 border-white shadow-sm">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Popup */}
      {/* Filter Popup Overlay */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto">
          {/* Backdrop with Blur */}
          <div 
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsFilterOpen(false)}
          ></div>
          
          {/* Modal */}
          <div className="flex min-h-full items-center justify-center p-4 sm:p-6">
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-hidden border border-gray-100">
              {/* Header */}
              <div className="sticky top-0 bg-white z-10 border-b border-gray-100">
                <div className="flex items-center justify-between p-6 pb-4 bg-gradient-to-r from-yellow-50 to-white">
                  <div className="flex items-center">
                    <div className="p-2 bg-yellow-100 rounded-lg mr-3">
                      <SlidersHorizontal className="h-5 w-5 text-yellow-600" />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-gray-900">Filtres avancés</h2>
                      {activeFilterCount > 0 && (
                        <p className="text-sm text-gray-500 mt-0.5">
                          {activeFilterCount} {activeFilterCount > 1 ? 'filtres actifs' : 'filtre actif'}
                        </p>
                      )}
                    </div>
                  </div>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500 hover:text-gray-700"
                    aria-label="Fermer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                
                {/* Active Filters Bar */}
                {activeFilterCount > 0 && (
                  <div className="px-6 py-3 bg-yellow-50 border-b border-yellow-100">
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
                      <span className="text-xs font-medium text-gray-500 whitespace-nowrap">Filtres :</span>
                      {selectedColors.length > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-yellow-800 border border-yellow-200 shadow-sm whitespace-nowrap">
                          🎨 {selectedColors.length} couleur{selectedColors.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {selectedSizes.length > 0 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-blue-800 border border-blue-200 shadow-sm whitespace-nowrap">
                          📏 {selectedSizes.length} taille{selectedSizes.length > 1 ? 's' : ''}
                        </span>
                      )}
                      {priceRange[1] < 200 && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-white text-green-800 border border-green-200 shadow-sm whitespace-nowrap">
                          💰 Jusqu'à {priceRange[1]} TND
                        </span>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Filter Content */}
              <div className="p-6 space-y-8 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 180px)' }}>
                {/* Sort */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
                    </svg>
                    Trier par
                  </h3>
                  <div className="space-y-2">
                    {[
                      { value: 'name', label: 'Nom (A-Z)' },
                      { value: 'price-low', label: 'Prix croissant' },
                      { value: 'price-high', label: 'Prix décroissant' }
                    ].map((option) => (
                      <label key={option.value} className="flex items-center p-2 hover:bg-white rounded-lg cursor-pointer transition-colors">
                        <input
                          type="radio"
                          name="sort"
                          value={option.value}
                          checked={sortBy === option.value}
                          onChange={() => setSortBy(option.value)}
                          className="h-4 w-4 text-yellow-600 focus:ring-yellow-500 border-gray-300"
                        />
                        <span className="ml-3 text-sm text-gray-700">{option.label}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fourchette de prix
                  </h3>
                  <div className="space-y-4">
                    <div className="relative">
                      <input
                        type="range"
                        min="0"
                        max="200"
                        value={priceRange[1]}
                        onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                        className="w-full h-2 bg-gradient-to-r from-yellow-200 to-yellow-400 rounded-full appearance-none cursor-pointer"
                        style={{
                          backgroundImage: `linear-gradient(to right, #FEF3C7 0%, #F59E0B ${(priceRange[1] / 200) * 100}%, #E5E7EB ${(priceRange[1] / 200) * 100}%, #E5E7EB 100%)`
                        }}
                      />
                      <div className="absolute top-0 h-2 w-full -z-10 bg-gray-200 rounded-full"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="px-3 py-1 bg-white border border-gray-200 rounded-lg shadow-sm">
                        {priceRange[0]} TND
                      </span>
                      <span className="text-gray-500">à</span>
                      <span className="px-3 py-1 bg-yellow-100 text-yellow-800 font-medium border border-yellow-200 rounded-lg shadow-sm">
                        {priceRange[1]} TND
                      </span>
                    </div>
                  </div>
                </div>

                {/* Colors */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.486M7 17h.01" />
                    </svg>
                    Couleurs
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {allColors.map(color => {
                      const isSelected = selectedColors.includes(color);
                      return (
                        <label 
                          key={color} 
                          className={`flex items-center p-3 rounded-lg border-2 transition-all cursor-pointer ${
                            isSelected 
                              ? 'border-yellow-400 bg-yellow-50' 
                              : 'border-gray-200 hover:border-gray-300 bg-white'
                          }`}
                        >
                          <div 
                            className={`w-5 h-5 rounded-full mr-3 border ${
                              isSelected ? 'ring-2 ring-offset-1 ring-yellow-400' : ''
                            }`}
                            style={{ backgroundColor: getColorCode(color) }}
                          ></div>
                          <span className="text-sm font-medium text-gray-700">{color}</span>
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedColors([...selectedColors, color]);
                              } else {
                                setSelectedColors(selectedColors.filter(c => c !== color));
                              }
                            }}
                            className="sr-only"
                          />
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Sizes */}
                <div className="bg-gray-50 p-4 rounded-xl">
                  <h3 className="font-semibold text-gray-800 mb-4 flex items-center">
                    <svg className="w-4 h-4 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 4v12l-4-2-4 2V4M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    Tailles disponibles
                  </h3>
                  <div className="grid grid-cols-4 gap-2">
                    {allSizes.map(size => {
                      const isSelected = selectedSizes.includes(size);
                      return (
                        <button
                          key={size}
                          onClick={() => {
                            if (isSelected) {
                              setSelectedSizes(selectedSizes.filter(s => s !== size));
                            } else {
                              setSelectedSizes([...selectedSizes, size]);
                            }
                          }}
                          className={`p-3 text-sm font-medium rounded-lg transition-all transform hover:scale-105 ${
                            isSelected
                              ? 'bg-yellow-100 text-yellow-800 border-2 border-yellow-400 shadow-md'
                              : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-yellow-300 hover:bg-yellow-50'
                          }`}
                        >
                          {size}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="sticky bottom-0 bg-white border-t border-gray-100 p-4 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)]">
                <div className="flex gap-3">
                  <button
                    onClick={resetFilters}
                    className="flex-1 px-4 py-3.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all duration-200 flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Tout effacer
                  </button>
                  <button
                    onClick={() => setIsFilterOpen(false)}
                    className="flex-1 px-4 py-3.5 text-sm font-medium text-white bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 rounded-xl transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl active:scale-95"
                  >
                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Voir {sortedProducts.length} article{sortedProducts.length > 1 ? 's' : ''}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryPage;