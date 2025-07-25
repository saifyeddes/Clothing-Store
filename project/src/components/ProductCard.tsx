import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart as HeartIcon, HeartOff as HeartOffIcon } from 'lucide-react';
import type { Product } from '../types';
import { useFavorites } from '../contexts/FavoritesContext';
import { showToast } from './ToastNotification';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Check if product is in favorites on component mount
  useEffect(() => {
    setIsFavorited(isFavorite(product.id));
  }, [product.id, isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    if (isFavorited) {
      removeFromFavorites(product.id);
      showToast('Produit retiré des favoris', 'info');
    } else {
      addToFavorites(product);
      showToast('Produit ajouté aux favoris', 'success');
    }
    
    setIsFavorited(!isFavorited);
    
    // Reset animation
    setTimeout(() => setIsAnimating(false), 300);
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(price);
  };

  const getColorStyle = (color: string) => {
    const colorMap: { [key: string]: string } = {
      'Noir': '#000000',
      'Blanc': '#FFFFFF',
      'Gris': '#808080',
      'Marine': '#000080',
      'Rouge': '#FF0000',
      'Bleu': '#0000FF',
      'Rose': '#FFC0CB',
      'Lavande': '#E6E6FA',
      'Jaune': '#FFFF00',
      'Menthe': '#98FB98',
      'Beige': '#F5F5DC',
      'Vert': '#008000',
      'Orange': '#FFA500',
      'Violet': '#8A2BE2',
      'Kaki': '#F0E68C',
      'Marron': '#A52A2A',
      'Bordeaux': '#800020'
    };
    return colorMap[color] || '#CCCCCC';
  };

  return (
    <div className="group relative bg-white rounded-3xl shadow-sm overflow-hidden hover:shadow-md transition-all duration-300 transform hover:-translate-y-1">
      {/* Image */}
      <div className="aspect-[3/4] overflow-hidden bg-gray-100">
        <Link to={`/product/${product.id}`} className="block w-full h-full" aria-label={`Voir les détails pour ${product.name}`}>
          <img
            src={product.images[0] || 'https://images.pexels.com/photos/996329/pexels-photo-996329.jpeg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
        </Link>
      </div>

      {/* Overlay actions */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
        <div className="flex space-x-2">
          <button
            onClick={() => onAddToCart(product)}
            className="bg-yellow-600 p-3 rounded-full shadow-lg hover:bg-yellow-700 transition-colors transform hover:scale-110 pointer-events-auto"
            aria-label={`Ajouter ${product.name} au panier`}
          >
            <ShoppingCart className="h-5 w-5 text-white" />
          </button>
        </div>
      </div>

      {/* Favorite Button */}
      <button
        onClick={handleFavoriteClick}
        className={`absolute top-3 right-3 p-2 rounded-full bg-white/80 backdrop-blur-sm shadow-md z-10 transition-all duration-300 ${
          isFavorited 
            ? 'text-red-500 hover:text-red-600' 
            : 'text-gray-400 hover:text-red-500'
        } ${isAnimating ? 'scale-125' : 'scale-100'}`}
        aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      >
        {isFavorited ? (
          <HeartIcon className="h-5 w-5 fill-current" />
        ) : (
          <HeartOffIcon className="h-5 w-5" />
        )}
      </button>

      {/* Badges */}
      <div className="absolute top-3 left-3 flex flex-col space-y-1">
        {product.is_featured && (
          <span className="bg-yellow-600 text-white text-xs font-medium text-center px-2 py-1 rounded-lg">
            Nouveau
          </span>
        )}
        {product.stock_quantity < 5 && product.stock_quantity > 0 && (
          <span className="bg-red-500 text-white text-xs font-medium text-center px-2 py-1 rounded-lg">
            {product.stock_quantity === 1 ? 'Reste une seule' : 'Stock Limité'}
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="bg-gray-500 text-white text-xs font-medium text-center px-2 py-1 rounded-lg">
            Épuisé
          </span>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <Link to={`/product/${product.id}`}>
          <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 hover:text-yellow-600 transition-colors">
            {product.name}
          </h3>
        </Link>
        
        <div className="flex items-center justify-between mb-3">
          <span className="text-xl font-bold text-gray-900">
            {formatPrice(product.price)}
          </span>
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <svg
                key={star}
                className={`w-4 h-4 ${
                  star <= Math.floor(product.rating) || (star === 5 && product.rating === 5)
                    ? 'text-yellow-400'
                    : star - 0.5 <= product.rating && product.rating < star
                    ? 'text-yellow-400'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                {star <= Math.floor(product.rating) ? (
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                ) : star - 0.5 <= product.rating && product.rating < star ? (
                  <>
                    <defs>
                      <linearGradient id="half" x1="0" x2="100%" y1="0" y2="0">
                        <stop offset="50%" stopColor="currentColor" />
                        <stop offset="50%" stopColor="#D1D5DB" />
                      </linearGradient>
                    </defs>
                    <path fill="url(#half)" d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </>
                ) : (
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                )}
              </svg>
            ))}
          </div>
        </div>

        {/* Colors */}
        {product.colors.length > 0 && (
          <div className="flex items-center space-x-1 mb-2">
            <span className="text-xs text-gray-500">Couleurs:</span>
            <div className="flex space-x-1">
              {product.colors.slice(0, 4).map((color, index) => (
                <div
                  key={index}
                  className="w-4 h-4 rounded-full border border-gray-300"
                  style={{ backgroundColor: getColorStyle(color) }}
                  title={color}
                />
              ))}
              {product.colors.length > 4 && (
                <span className="text-xs text-gray-500">+{product.colors.length - 4}</span>
              )}
            </div>
          </div>
        )}

        {/* Sizes */}
        {product.sizes.length > 0 && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-500">Tailles:</span>
            <div className="flex space-x-1">
              {product.sizes.slice(0, 5).map((size, index) => (
                <span key={index} className="text-xs bg-gray-100 px-1 py-0.5 rounded">
                  {size}
                </span>
              ))}
              {product.sizes.length > 5 && (
                <span className="text-xs text-gray-500">+{product.sizes.length - 5}</span>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductCard;