import { useMemo, useState, useEffect, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import { SlidersHorizontal, Filter as FilterIcon } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import { Product } from '../types';
import { showToast } from '../components/ToastNotification';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { gender } = useParams<{ gender: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  
  const { addToCart } = useCart();
  
  const [sortBy, setSortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const filterContentRef = useRef<HTMLDivElement>(null);
  
  // Check if the device is mobile on component mount and window resize
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 1024); // 1024px is the lg breakpoint in Tailwind
    };
    
    // Initial check
    checkIfMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkIfMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);


  // Mettre à jour l'état des filtres lorsque les paramètres d'URL changent
  useEffect(() => {
    // Cette fonction est appelée lorsque les paramètres d'URL changent
    // Pas besoin de gérer searchInput ici car la recherche est maintenant gérée dans le Header
  }, [searchQuery]);

  // Filter products by gender and search query
  const filteredProducts = useMemo(() => {
    return mockProducts.filter(product => {
      // Apply gender filter
      if (gender === 'homme' && product.gender !== 'homme') return false;
      if (gender === 'femme' && product.gender !== 'femme') return false;
      if (gender === 'enfant' && product.gender !== 'unisexe') return false;
      
      // Apply search query filter if present
      if (searchQuery) {
        const searchInName = product.name.toLowerCase().includes(searchQuery);
        const searchInDescription = product.description.toLowerCase().includes(searchQuery);
        const searchInColors = product.colors.some(color => 
          color.toLowerCase().includes(searchQuery)
        );
        return searchInName || searchInDescription || searchInColors;
      }
      
      return true;
    });
  }, [gender, searchQuery]);

  // Apply additional filters
  const finalProducts = useMemo(() => {
    return filteredProducts.filter(product => {
      const priceInRange = product.price >= priceRange[0] && product.price <= priceRange[1];
      const colorMatch = selectedColors.length === 0 || product.colors.some(color => selectedColors.includes(color));
      const sizeMatch = selectedSizes.length === 0 || product.sizes.some(size => selectedSizes.includes(size));
      
      return priceInRange && colorMatch && sizeMatch;
    });
  }, [filteredProducts, priceRange, selectedColors, selectedSizes]);

  // Sort products
  const sortedProducts = useMemo(() => {
    return [...finalProducts].sort((a, b) => {
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
  }, [finalProducts, sortBy]);

  const handleQuickAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    addToCart(product, defaultSize, defaultColor, 1);
    showToast(`${product.name} ajouté au panier !`, 'success');
  };

  const getCategoryTitle = () => {
    if (searchQuery) {
      return `Résultats pour "${searchQuery}"`;
    }
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
    
  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
    if (priceRange[1] < 200) params.set('price', `${priceRange[0]}-${priceRange[1]}`);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedColors, selectedSizes, priceRange]);

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
        
        {/* Affichage des résultats de recherche */}
        {searchQuery && (
          <div className="mb-6 max-w-3xl mx-auto px-4">
            <div className="flex items-center justify-between bg-gray-50 rounded-lg p-3">
              <div className="text-sm text-gray-700">
                <span className="font-medium">{finalProducts.length}</span> résultat{finalProducts.length !== 1 ? 's' : ''} pour "<span className="text-yellow-600 font-medium">{searchQuery}</span>"
              </div>
              <button 
                onClick={() => navigate('/category/all')}
                className="text-sm text-yellow-600 hover:text-yellow-700 font-medium flex items-center transition-colors"
              >
                <X className="h-4 w-4 mr-1" />
                Réinitialiser
              </button>
            </div>
          </div>
        )}

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

      {/* Single Filter Button - Visible on all devices but styled differently */}
      <div className={`fixed bottom-6 ${isMobile ? 'left-1/2 transform -translate-x-1/2' : 'right-6'} z-50`}>
        <button
          onClick={() => setIsFilterOpen(true)}
          className={`flex items-center justify-center ${
            isMobile 
              ? 'px-5 py-2.5 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-medium rounded-full shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 transition-all duration-200 transform hover:scale-105 active:scale-95'
              : 'p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg transition-colors'
          }`}
        >
          {isMobile ? (
            <>
              <SlidersHorizontal className="h-4 w-4 mr-2" />
              <span className="text-sm">Filtrer</span>
              {activeFilterCount > 0 && (
                <span className="ml-2 inline-flex items-center justify-center min-w-5 h-5 text-xs font-bold text-yellow-600 bg-white rounded-full border-2 border-white shadow-sm">
                  {activeFilterCount}
                </span>
              )}
            </>
          ) : (
            <>
              <SlidersHorizontal className="h-6 w-6" />
              {activeFilterCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      {isFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setIsFilterOpen(false)} />
          
          <div className="fixed inset-y-0 right-0 w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out">
            <div className="h-full flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b">
                <h3 className="text-lg font-medium">Filtres</h3>
                <button 
                  onClick={() => setIsFilterOpen(false)}
                  className="text-gray-400 hover:text-gray-500"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              
              {/* Scrollable content */}
              <div 
                ref={filterContentRef}
                className="flex-1 overflow-y-auto p-4 space-y-6"
              >
                {/* Sort by */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Trier par</label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
                  >
                    <option value="name">Nom (A-Z)</option>
                    <option value="price-low">Prix croissant</option>
                    <option value="price-high">Prix décroissant</option>
                  </select>
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