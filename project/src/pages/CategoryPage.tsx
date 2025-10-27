import { useMemo, useState, useEffect, Fragment } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { X, Filter as FilterIcon, Check } from 'lucide-react';
import { Dialog, Transition } from '@headlessui/react';
import ProductCard from '../components/ProductCard';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';
import { products as productsApi, ASSETS_BASE } from '../services/api';

const CategoryPage: React.FC = () => {
  const navigate = useNavigate();
  const { gender } = useParams<{ gender: string }>();
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search')?.toLowerCase() || '';
  
  const { addToCart } = useCart();
  
  const [sortBy] = useState('name');
  const [priceRange, setPriceRange] = useState([0, 200]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  // State for filter modal
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [tempSelectedColors, setTempSelectedColors] = useState<string[]>([]);
  const [tempSelectedSizes, setTempSelectedSizes] = useState<string[]>([]);
  const [tempPriceRange, setTempPriceRange] = useState([0, 200]);
  const [maxPrice, setMaxPrice] = useState(200);

  // Initialize temp filters when opening the modal
  const openFilterModal = () => {
    setTempSelectedColors([...selectedColors]);
    setTempSelectedSizes([...selectedSizes]);
    setTempPriceRange([...priceRange]);
    setIsFilterModalOpen(true);
  };

  // Apply filters from modal
  const applyFilters = () => {
    setSelectedColors(tempSelectedColors);
    setSelectedSizes(tempSelectedSizes);
    setPriceRange(tempPriceRange);
    setIsFilterModalOpen(false);
  };

  // Reset all filters
  const resetAllFilters = () => {
    setTempSelectedColors([]);
    setTempSelectedSizes([]);
    setTempPriceRange([0, 200]);
  };
  
  // Remove unused mobile detection


  // Mettre à jour l'état des filtres lorsque les paramètres d'URL changent
  useEffect(() => {
    // Cette fonction est appelée lorsque les paramètres d'URL changent
    // Pas besoin de gérer searchInput ici car la recherche est maintenant gérée dans le Header
  }, [searchQuery]);

  const [fetchedProducts, setFetchedProducts] = useState<Product[]>([]);

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

  useEffect(() => {
    const load = async () => {
      try {
        // Optionally can pass query params, but backend filtering by category happens with ?category=...
        const params: Record<string, string> = {};
        if (gender === 'homme' || gender === 'femme' || gender === 'unisexe') {
          params.category = gender;
        }
        const data: BackendProduct[] = await productsApi.getAll(params);
        const mapped: Product[] = (data || []).map((p) => ({
          id: p._id,
          name: p.name,
          description: p.description,
          price: p.price,
          category_id: p.category,
          category: { id: p.category, name: p.category, image_url: '', created_at: p.createdAt },
          images: Array.isArray(p.images) ? p.images.map((img) => `${ASSETS_BASE}${img.url}`) : [],
          sizes: p.sizes || [],
          colors: Array.isArray(p.colors) ? p.colors.map((c) => (typeof c === 'string' ? c : c.name || c.code || '')) : [],
          stock_quantity: p.stock ?? 0,
          is_featured: !!p.is_featured,
          created_at: p.createdAt,
          rating: 5,
        }));
        setFetchedProducts(mapped);
        // Update max price and widen default filters to include all
        const newMax = Math.max(200, ...mapped.map(m => m.price));
        setMaxPrice(newMax);
        // If priceRange is still the initial [0,200], expand it to [0,newMax]
        setPriceRange(prev => (prev[0] === 0 && prev[1] === 200 ? [0, newMax] : prev));
        setTempPriceRange(prev => (prev[0] === 0 && prev[1] === 200 ? [0, newMax] : prev));
      } catch (e) {
        console.error('Failed to load products', e);
      }
    };
    load();
  }, [gender]);

  // Filter products by gender and search query (client-side on fetched list)
  const filteredProducts = useMemo(() => {
    return fetchedProducts.filter((product: Product) => {
      // Apply gender filter when route param is enfant -> unisexe
      if (gender === 'homme' && product.category_id !== 'homme') return false;
      if (gender === 'femme' && product.category_id !== 'femme') return false;
      if (gender === 'enfant' && product.category_id !== 'unisexe') return false;
      
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
  }, [gender, searchQuery, fetchedProducts]);

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
    const defaultSize = product.sizes?.[0] || '';
    const defaultColor = product.colors?.[0] || '';
    addToCart(product, defaultSize, defaultColor, 1);
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

  // Options dynamiques du modal: ne montrer que couleurs/tailles disponibles selon filtres temporaires
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    const withinPrice = (p: Product) => p.price >= 0 && p.price <= (tempPriceRange?.[1] ?? maxPrice);
    const sizeMatch = (p: Product) =>
      tempSelectedSizes.length === 0 || p.sizes?.some((s) => tempSelectedSizes.includes(s));
    filteredProducts
      .filter((p) => withinPrice(p) && sizeMatch(p))
      .forEach((p) => p.colors?.forEach((c) => colors.add(c)));
    return Array.from(colors).sort();
  }, [filteredProducts, tempPriceRange, tempSelectedSizes, maxPrice]);

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>();
    const withinPrice = (p: Product) => p.price >= 0 && p.price <= (tempPriceRange?.[1] ?? maxPrice);
    const colorMatch = (p: Product) =>
      tempSelectedColors.length === 0 || p.colors?.some((c) => tempSelectedColors.includes(c));
    filteredProducts
      .filter((p) => withinPrice(p) && colorMatch(p))
      .forEach((p) => p.sizes?.forEach((s) => sizes.add(s)));
    return Array.from(sizes).sort();
  }, [filteredProducts, tempPriceRange, tempSelectedColors, maxPrice]);

  // Count active filters
  const activeFilterCount = 
    (selectedColors.length > 0 ? 1 : 0) + 
    (selectedSizes.length > 0 ? 1 : 0) + 
    (priceRange[1] < maxPrice ? 1 : 0);
    
  // Update URL with filters
  useEffect(() => {
    const params = new URLSearchParams();
    if (selectedColors.length > 0) params.set('colors', selectedColors.join(','));
    if (selectedSizes.length > 0) params.set('sizes', selectedSizes.join(','));
    if (priceRange[1] < maxPrice) params.set('price', `${priceRange[0]}-${priceRange[1]}`);
    
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    window.history.replaceState({}, '', newUrl);
  }, [selectedColors, selectedSizes, priceRange]);

  // Remove unused resetFilters function

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
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

      {/* Single Filter Button - Visible on all devices */}
      <div className="fixed bottom-6 right-6 z-50">
        <button
          onClick={openFilterModal}
          className="flex items-center justify-center p-3 bg-yellow-500 hover:bg-yellow-600 text-white rounded-full shadow-lg transition-colors"
        >
          <FilterIcon className="w-6 h-6" />
          {activeFilterCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      {/* Filter Modal */}
      <Transition appear show={isFilterModalOpen} as={Fragment}>
        <Dialog as="div" className="fixed inset-0 z-50 overflow-y-auto" onClose={() => setIsFilterModalOpen(false)}>
          <div className="min-h-screen px-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <div className="fixed inset-0 bg-black/50" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span className="inline-block h-screen align-middle" aria-hidden="true">
              &#8203;
            </span>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="inline-block w-full max-w-md p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl rounded-2xl">
                <Dialog.Title
                  as="h3"
                  className="text-lg font-medium leading-6 text-gray-900 flex justify-between items-center"
                >
                  <span>Filtres</span>
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500"
                    onClick={() => setIsFilterModalOpen(false)}
                  >
                    <X className="h-6 w-6" />
                  </button>
                </Dialog.Title>

                <div className="mt-4 space-y-6">
                  {/* Price Range */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Prix</h4>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max={maxPrice}
                        value={tempPriceRange[1]}
                        onChange={(e) => setTempPriceRange([0, parseInt(e.target.value)])}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div className="flex justify-between text-sm text-gray-500 mt-2">
                        <span>0 TND</span>
                        <span>{tempPriceRange[1]} TND</span>
                      </div>
                    </div>
                  </div>

                  {/* Colors */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Couleurs</h4>
                    <div className="grid grid-cols-4 gap-2">
                      {availableColors.map((color) => (
                        <button
                          key={color}
                          onClick={() => {
                            setTempSelectedColors(prev =>
                              prev.includes(color)
                                ? prev.filter(c => c !== color)
                                : [...prev, color]
                            );
                          }}
                          className={`flex items-center justify-center p-2 rounded-md border ${
                            tempSelectedColors.includes(color)
                              ? 'ring-2 ring-yellow-500 ring-offset-2'
                              : 'border-gray-200'
                          }`}
                          style={{ backgroundColor: getColorCode(color) }}
                          title={color}
                        >
                          {tempSelectedColors.includes(color) && (
                            <Check className="h-4 w-4 text-white" />
                          )}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Sizes */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-3">Tailles</h4>
                    <div className="flex flex-wrap gap-2">
                      {availableSizes.map((size) => (
                        <button
                          key={size}
                          onClick={() => {
                            setTempSelectedSizes(prev =>
                              prev.includes(size)
                                ? prev.filter(s => s !== size)
                                : [...prev, size]
                            );
                          }}
                          className={`px-3 py-1.5 text-sm rounded-md border ${
                            tempSelectedSizes.includes(size)
                              ? 'bg-yellow-600 text-white border-yellow-600'
                              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                          }`}
                        >
                          {size}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-between">
                  <button
                    type="button"
                    onClick={resetAllFilters}
                    className="text-sm font-medium text-yellow-600 hover:text-yellow-700"
                  >
                    Réinitialiser
                  </button>
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={() => setIsFilterModalOpen(false)}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
                    >
                      Annuler
                    </button>
                    <button
                      type="button"
                      onClick={applyFilters}
                      className="px-4 py-2 text-sm font-medium text-white bg-yellow-600 border border-transparent rounded-md hover:bg-yellow-700"
                    >
                      Appliquer
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default CategoryPage;