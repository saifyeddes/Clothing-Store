import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Heart as HeartIcon, HeartOff as HeartOffIcon, ShoppingCart, Star, Truck, Shield, RotateCcw, Heart } from 'lucide-react';
import { mockProducts } from '../lib/mockData';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { showToast } from '../components/ToastNotification';

const ProductDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavorites();
  const [isFavorited, setIsFavorited] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const product = mockProducts.find(p => p.id === id);

  // Check if product is in favorites on component mount
  useEffect(() => {
    if (product) {
      setIsFavorited(isFavorite(product.id));
    }
  }, [product, isFavorite]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!product) return;
    
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
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Produit non trouvé</h2>
          <button
            onClick={() => navigate('/')}
            className="bg-yellow-600 text-white px-6 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Retour à l'accueil
          </button>
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('fr-TN', {
      style: 'currency',
      currency: 'TND',
      minimumFractionDigits: 3,
    }).format(price);
  };

  const handleAddToCart = () => {
    if (!selectedSize || !selectedColor) {
      if (!selectedSize) {
        document.getElementById('size-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      if (!selectedColor) {
        document.getElementById('color-section')?.scrollIntoView({ behavior: 'smooth' });
      }
      showToast('⚠️ Veuillez sélectionner une taille et une couleur avant d\'ajouter au panier', 'error');
      return;
    }
    addToCart(product, selectedSize, selectedColor, quantity);
    showToast(
      `${product.name} ajouté au panier ! (Taille: ${selectedSize} | Couleur: ${selectedColor})`,
      'success'
    );
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
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 p-8">
            {/* Images du produit */}
            <div>
              <div className="aspect-square mb-4 overflow-hidden rounded-lg bg-gray-100">
                <img
                  src={product.images[selectedImage] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="flex space-x-2">
                  {product.images.map((image, index) => (
                    <button
                      key={index}
                      onClick={() => setSelectedImage(index)}
                      className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                        selectedImage === index ? 'border-yellow-600' : 'border-gray-200'
                      }`}
                    >
                      <img
                        src={image}
                        alt={`${product.name} ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Détails du produit */}
            <div>
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
                <button
                  onClick={handleFavoriteClick}
                  className={`p-2 rounded-full transition-all duration-300 ${
                    isFavorited 
                      ? 'text-red-500 hover:text-red-600' 
                      : 'text-gray-400 hover:text-red-500'
                  } ${isAnimating ? 'scale-125' : 'scale-100'}`}
                  aria-label={isFavorited ? 'Retirer des favoris' : 'Ajouter aux favoris'}
                >
                  {isFavorited ? (
                    <HeartIcon className="h-6 w-6 fill-current" />
                  ) : (
                    <HeartOffIcon className="h-6 w-6" />
                  )}
                </button>
              </div>
                <div className="flex items-center space-x-4 mb-4">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                    ))}
                    <span className="ml-2 text-gray-600">(4.8) • 124 avis</span>
                  </div>
                </div>
                <p className="text-3xl font-bold text-gray-900 mb-4">
                  {formatPrice(product.price)}
                </p>
                <p className="text-gray-600 leading-relaxed">{product.description}</p>
              </div>

              {/* Sélection de la couleur */}
              <div id="color-section" className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Couleur: {selectedColor ? <span className="text-yellow-600 font-bold">{selectedColor}</span> : <span className="text-red-500">Sélectionnez une couleur</span>}
                </h3>
                <div className="flex flex-wrap gap-3">
                  {product.colors.map((color) => (
                    <button
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      className={`flex items-center space-x-2 px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedColor === color
                          ? 'border-yellow-600 bg-yellow-50 text-yellow-600 ring-2 ring-yellow-200 transform scale-105'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      <div
                        className="w-5 h-5 rounded-full border border-gray-300"
                        style={{ backgroundColor: getColorStyle(color) }}
                      />
                      <span>{color}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Sélection de la taille */}
              <div id="size-section" className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  Taille: {selectedSize ? <span className="text-yellow-600 font-bold">{selectedSize}</span> : <span className="text-red-500">Sélectionnez une taille</span>}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 border rounded-lg font-medium transition-all ${
                        selectedSize === size
                          ? 'border-yellow-600 bg-yellow-50 text-yellow-600 ring-2 ring-yellow-200 transform scale-105'
                          : 'border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantité */}
              <div className="mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">Quantité</h3>
                <div className="flex items-center space-x-3">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    -
                  </button>
                  <span className="w-12 text-center font-semibold text-lg">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 border border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
                  >
                    +
                  </button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex space-x-4 mb-8">
                <button
                  onClick={handleAddToCart}
                  className="flex-1 bg-yellow-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-yellow-700 transition-colors flex items-center justify-center"
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  Ajouter au panier
                </button>
                <button className="p-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                  <Heart className="h-6 w-6 text-gray-600" />
                </button>
              </div>

              {/* Informations supplémentaires */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3 text-gray-600">
                  <Truck className="h-5 w-5" />
                  <span>Livraison gratuite en Tunisie</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <RotateCcw className="h-5 w-5" />
                  <span>Retour gratuit sous 14 jours</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-600">
                  <Shield className="h-5 w-5" />
                  <span>Garantie qualité</span>
                </div>
              </div>

              {/* Stock */}
              <div className="mt-6 p-4 bg-green-50 rounded-lg">
                <p className="text-green-800 font-medium">
                  ✓ En stock ({product.stock_quantity} disponibles)
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;