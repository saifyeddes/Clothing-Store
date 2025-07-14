import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import type { Product } from '../types';

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAddToCart }) => {
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
    <div className="group relative bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
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

      {/* Badges */}
      <div className="absolute top-2 left-2 flex flex-col space-y-1">
        {product.is_featured && (
          <span className="bg-yellow-600 text-white text-xs font-medium px-2 py-1 rounded">
            Nouveau
          </span>
        )}
        {product.stock_quantity < 5 && product.stock_quantity > 0 && (
          <span className="bg-red-500 text-white text-xs font-medium px-2 py-1 rounded">
            Stock Limité
          </span>
        )}
        {product.stock_quantity === 0 && (
          <span className="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
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
          <span className="text-sm text-gray-500 capitalize">
            {product.gender}
          </span>
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