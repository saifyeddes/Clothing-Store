import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShoppingCart, Search, X, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchTimeoutRef = React.useRef<NodeJS.Timeout>();
  const navigate = useNavigate();

  // Vérifier si on est sur une page qui doit afficher la barre de recherche
  const shouldShowSearch = ['/', '/category'].some(path => 
    location.pathname.startsWith(path)
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    // Annuler le délai précédent
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    // Délai avant d'exécuter la recherche
    searchTimeoutRef.current = setTimeout(() => {
      if (query.trim()) {
        // Créer un paramètre de recherche pour le nom, la description et les couleurs
        navigate(`/category/all?search=${encodeURIComponent(query)}`);
      } else if (window.location.search) {
        navigate('/category/all');
      }
    }, 300);
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (window.location.pathname.startsWith('/category')) {
      navigate('/category/all');
    }
  };

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);



  /*
  const handleSignOut = async () => {
    try {
      await signOut();
      navigate('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };
  */

  return (
    <header
      className={`sticky top-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white shadow-md' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="text-2xl font-bold text-black">
              Room<span className="text-yellow-600">.tn</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          {/* <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/category/homme"
              className="transition-colors font-medium text-black hover:text-yellow-600"
            >
              Homme
            </Link>
            <Link
              to="/category/femme"
              className="transition-colors font-medium text-black hover:text-yellow-600"
            >
              Femme
            </Link>
            <Link
              to="/category/unisexe"
              className="transition-colors font-medium text-black hover:text-yellow-600"
            >
              Unisexe
            </Link>
            <Link
              to="/featured"
              className="transition-colors font-medium text-black hover:text-yellow-600"
            >
              Nouveautés
            </Link>
          </nav> */}

          {/* Barre de recherche (uniquement sur Home et Category) */}
          {shouldShowSearch && (
            <div className="hidden md:flex items-center flex-1 max-w-2xl mx-4">
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={(e) => e.target.select()}
                  onKeyDown={(e) => e.key === 'Escape' && e.currentTarget.blur()}
                  placeholder="Rechercher des produits..."
                  className="w-full pl-5 pr-10 py-2.5 rounded-full border-2 border-gray-200 focus:ring-2 focus:ring-yellow-400 focus:border-yellow-400 focus:border-opacity-50 focus:outline-none transition-all duration-200 text-gray-800 placeholder-gray-400 bg-white shadow-sm hover:shadow-md"
                  aria-label="Rechercher des produits"
                />
                {searchQuery ? (
                  <button
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors p-1"
                    aria-label="Effacer la recherche"
                  >
                    <X className="h-5 w-5" />
                  </button>
                ) : (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Search className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>
          )}
          {!shouldShowSearch && <div className="flex-1"></div>}

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 text-black hover:text-red-500 transition-colors"
              aria-label="Mes favoris"
            >
              <Heart className="h-6 w-6" />
              {favorites.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {favorites.length}
                </span>
              )}
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative p-2 text-black hover:text-yellow-600 transition-colors"
              aria-label="Panier"
            >
              <ShoppingCart className="h-6 w-6" />
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 bg-yellow-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* User Menu - Temporarily Disabled
            {user ? (
              <div className="relative group">
                <button className="flex items-center space-x-1 text-gray-700 hover:text-yellow-600 transition-colors">
                  <User className="h-6 w-6" />
                  <span className="hidden md:block">{user.full_name}</span>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">
                  <Link to="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mon Profil
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                    Mes Commandes
                  </Link>
                  {(user.role === 'admin' || user.role === 'super_admin') && (
                    <Link to="/admin" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100">
                      Administration
                    </Link>
                  )}
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    Déconnexion
                  </button>
                </div>
              </div>
            ) : (
              <Link
                to="/login"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
              >
                Connexion
              </Link>
            )}
            */}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-black transition-colors"
            >
              {isMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/category/homme"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Homme
              </Link>
              <Link
                to="/category/femme"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Femme
              </Link>
              <Link
                to="/category/enfant"
                className="block px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                onClick={() => setIsMenuOpen(false)}
              >
                Enfant
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;