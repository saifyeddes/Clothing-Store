import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShoppingCart, Heart } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { useFavorites } from '../contexts/FavoritesContext';
import { motion, useAnimation } from 'framer-motion';

const Header: React.FC = () => {
  const { totalItems } = useCart();
  const { favorites } = useFavorites();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const controls = useAnimation();

  // Gestion du défilement pour la couleur de la navbar
  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Démarrer l'animation 3D automatique
  useEffect(() => {
    const startAnimation = async () => {
      await new Promise(resolve => setTimeout(resolve, 500));
      controls.start('visible');
    };
    startAnimation();
  }, [controls]);

  return (
    <header className={`sticky top-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-md' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <motion.div 
              className="text-2xl font-bold relative"
              initial="initial"
              animate={controls}
              variants={{
                initial: { 
                  rotateY: 0,
                  scale: 1,
                },
                visible: {
                  rotateY: 360,
                  transition: { 
                    rotateY: { 
                      duration: 6,
                      ease: 'linear',
                      repeat: Infinity,
                      repeatType: 'loop'
                    }
                  }
                }
              }}
              style={{
                transformStyle: 'preserve-3d',
                perspective: '1000px',
                transformOrigin: 'center center',
                display: 'inline-flex',
                alignItems: 'center',
                height: '100%',
                position: 'relative',
                overflow: 'visible'
              }}
            >
              <div className="flex">
                {['R', 'o', 'o', 'm'].map((letter, index) => (
                  <motion.span
                    key={`letter-${index}`}
                    className="inline-block"
                    style={{
                      transformStyle: 'preserve-3d',
                      display: 'inline-block',
                      transform: 'translateZ(10px)',
                      position: 'relative',
                      color: 'black'
                    }}
                    animate={{
                      y: [0, -5, 0],
                      rotateX: [0, 360],
                      scale: [1, 1.2, 1],
                      transition: {
                        duration: 3,
                        delay: index * 0.1,
                        repeat: Infinity,
                        repeatType: 'loop',
                        ease: 'easeInOut'
                      }
                    }}
                  >
                    {letter}
                  </motion.span>
                ))}
                <motion.span 
                  className="text-yellow-600 ml-1"
                  style={{
                    display: 'inline-flex',
                    transform: 'translateZ(15px)',
                    position: 'relative'
                  }}
                  animate={{
                    y: [0, -3, 0],
                    scale: [1, 1.1, 1],
                    transition: {
                      duration: 2,
                      repeat: Infinity,
                      repeatType: 'reverse',
                      ease: 'easeInOut'
                    }
                  }}
                >
                  .tn
                </motion.span>
              </div>
              
              {/* Effet de lueur */}
              <motion.div 
                className="absolute inset-0 bg-gradient-to-r from-yellow-400/10 to-transparent"
                initial={{ opacity: 0 }}
                animate={{
                  opacity: [0, 0.2, 0],
                  left: ['0%', '100%'],
                  transition: { 
                    duration: 3, 
                    repeat: Infinity,
                    ease: 'easeInOut'
                  }
                }}
              />
            </motion.div>
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

          {/* Espace vide pour aligner les éléments */}
          <div className="flex-1"></div>

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            {/* Favorites */}
            <Link
              to="/favorites"
              className="relative p-2 text-gray-400 hover:text-red-400 transition-colors"
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
              className="relative p-2 text-gray-400 hover:text-yellow-500 transition-colors"
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