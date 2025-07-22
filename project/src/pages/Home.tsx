import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, TrendingUp, Users, ShoppingBag } from 'lucide-react';
import { mockProducts, mockCategories } from '../lib/mockData';
import ProductCard from '../components/ProductCard';
import Testimonials from '../components/Testimonials';
import { useCart } from '../contexts/CartContext';
import type { Product } from '../types';


const heroImages = [
  'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg',
  'https://images.pexels.com/photos/994523/pexels-photo-994523.jpeg',
  'https://images.pexels.com/photos/1152994/pexels-photo-1152994.jpeg',
  'https://images.pexels.com/photos/3768005/pexels-photo-3768005.jpeg',
];

const Home: React.FC = () => {
  const { addToCart } = useCart();
  const featuredProducts = mockProducts.filter((product) => product.is_featured);

  const handleQuickAddToCart = (product: Product) => {
    const defaultSize = product.sizes[0];
    const defaultColor = product.colors[0];
    addToCart(product, defaultSize, defaultColor, 1);
    alert('Produit ajouté au panier !');
  };
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImageIndex((prevIndex) =>
        prevIndex === heroImages.length - 1 ? 0 : prevIndex + 1
      );
    }, 2000); // Change image every 2 seconds as requested
    return () => clearInterval(timer);
  }, []);


  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center bg-black overflow-hidden -mt-16">
        {/* Background Images Carousel */}
        {heroImages.map((image, index) => (
          <div
            key={index}
            className="absolute inset-0 bg-cover bg-center transition-opacity duration-1000 ease-in-out"
            style={{
              backgroundImage: `url(${image})`,
              opacity: index === currentImageIndex ? 1 : 0,
              transform: 'scale(1.05)',
              filter: 'brightness(0.7) contrast(1.1)',
            }}
          />
        ))}

        <div className="absolute inset-0 bg-black bg-opacity-40"></div>

        {/* Animated overlay patterns */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-yellow-600/20 via-transparent to-yellow-600/20 animate-pulse"></div>
          <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent via-yellow-600/10 to-transparent"></div>
        </div>

        <div className="relative z-10 text-center text-white px-4 max-w-6xl mx-auto">
          {/* Logo avec effet brillant */}
          <div className="mb-8">
            <h1 className="text-6xl md:text-8xl font-black mb-4 tracking-tight">
              <span className="bg-gradient-to-r from-white via-gray-100 to-white bg-clip-text text-transparent drop-shadow-2xl">
                Room
              </span>
              <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent drop-shadow-2xl animate-pulse">
                .tn
              </span>
            </h1>
            <div className="w-32 h-1 bg-gradient-to-r from-yellow-400 to-yellow-600 mx-auto rounded-full shadow-lg"></div>
          </div>

          {/* Slogan principal */}
          <div className="mb-8">
            <p className="text-2xl md:text-4xl font-bold mb-4 text-gray-100 drop-shadow-lg">
              Votre Boutique T-Shirts Premium
            </p>
            <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Découvrez notre collection exclusive de t-shirts de qualité
              supérieure pour
              <span className="text-yellow-400 font-semibold"> Homme</span>,
              <span className="text-pink-400 font-semibold"> Femme</span> &{' '}
              <span className="text-blue-400 font-semibold"> Enfant</span>
            </p>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-8 mb-10 max-w-2xl mx-auto">
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1">
                200+
              </div>
              <div className="text-sm text-gray-300">Modèles</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1">
                5K+
              </div>
              <div className="text-sm text-gray-300">Clients</div>
            </div>
            <div className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-yellow-400 mb-1">
                24H
              </div>
              <div className="text-sm text-gray-300">Livraison</div>
            </div>
          </div>

          {/* Call to Action */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/category/all"
              className="bg-yellow-500 text-gray-900 font-bold py-3 px-8 rounded-lg text-lg hover:bg-yellow-400 transition-all duration-300 shadow-lg transform hover:scale-105"
            >
              Découvrir les T-Shirts
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      {/* <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Pourquoi Choisir Room.tn ?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Qualité, style et service client exceptionnel, au cœur de la
              Tunisie.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500 text-white mx-auto mb-4">
                <TrendingUp className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Qualité Premium
              </h3>
              <p className="text-gray-600">
                T-shirts 100% coton, conçus pour durer et offrir un confort
                maximal.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500 text-white mx-auto mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Designs Exclusifs
              </h3>
              <p className="text-gray-600">
                Des designs uniques et tendances que vous ne trouverez nulle part
                ailleurs.
              </p>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-yellow-500 text-white mx-auto mb-4">
                <ShoppingBag className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                Achat Facile & Rapide
              </h3>
              <p className="text-gray-600">
                Expérience d'achat simple, livraison rapide et service client à
                votre écoute.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      {/* Categories Section */}
      {/* <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-10">Nos Catégories</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {mockCategories.map((category) => (
              <Link to={`/category/${category.name.toLowerCase().replace(' ', '-')}`} key={category.id} className="group block">
                <div className="relative overflow-hidden rounded-lg">
                  <img 
                    src={category.image_url} 
                    alt={category.name} 
                    className="w-full h-64 object-cover group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
                    <h3 className="text-2xl font-semibold text-white tracking-wider">{category.name}</h3>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section> */}

      {/* Featured Products Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nouveautés & Coups de Cœur
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez nos derniers t-shirts et les modèles les plus populaires
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={handleQuickAddToCart}
              />
            ))}
          </div>

          <div className="text-center">
            <Link
              to="/category/all"
              className="inline-flex items-center bg-yellow-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              Voir tous les t-shirts
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <Testimonials />

      {/* Newsletter Section */}
      <section className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Restez informé des nouveautés
          </h2>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Inscrivez-vous à notre newsletter pour recevoir les nouveaux t-shirts
            et offres exclusives
          </p>
          <form className="max-w-md mx-auto flex gap-4">
            <input
              type="email"
              placeholder="Votre adresse email"
              className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:ring-2 focus:ring-yellow-500 focus:outline-none"
            />
            <button
              type="submit"
              className="bg-yellow-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-yellow-700 transition-colors"
            >
              S'inscrire
            </button>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Home;