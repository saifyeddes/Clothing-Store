import type { Product, Category, User, Order, Review } from '../types';

export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'T-Shirts Homme',
    image_url: 'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'T-Shirts Femme',
    image_url: 'https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'T-Shirts Enfant',
    image_url: 'https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg',
    created_at: '2025-01-01T00:00:00Z'
  }
];

export const mockProducts: Product[] = [
  // T-Shirts Homme
  {
    id: '1',
    name: 'T-Shirt Classique Homme Noir',
    description: 'T-shirt en coton 100% biologique, coupe moderne et confortable. Parfait pour un look décontracté au quotidien.',
    price: 35.000,
    category_id: '1',
    category: mockCategories[0],
    images: [
      'https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg',
      'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'
    ],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Noir', 'Blanc', 'Gris', 'Marine'],
    gender: 'homme',
    stock_quantity: 50,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '2',
    name: 'T-Shirt Graphique Homme Sport',
    description: 'T-shirt avec design graphique moderne, idéal pour le sport et les loisirs. Tissu respirant et séchage rapide.',
    price: 42.000,
    category_id: '1',
    category: mockCategories[0],
    images: ['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'],
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Noir', 'Rouge', 'Bleu'],
    gender: 'homme',
    stock_quantity: 30,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '3',
    name: 'T-Shirt Polo Homme Élégant',
    description: 'Polo classique en coton piqué, parfait pour un look casual-chic. Coupe ajustée et finitions soignées.',
    price: 55.000,
    category_id: '1',
    category: mockCategories[0],
    images: ['https://images.pexels.com/photos/1183266/pexels-photo-1183266.jpeg'],
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Marine', 'Blanc', 'Gris', 'Bordeaux'],
    gender: 'homme',
    stock_quantity: 25,
    is_featured: false,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '4',
    name: 'T-Shirt Homme Vintage',
    description: 'T-shirt au style vintage avec impression rétro. Coton doux et confortable pour un look authentique.',
    price: 38.000,
    category_id: '1',
    category: mockCategories[0],
    images: ['https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg'],
    sizes: ['M', 'L', 'XL'],
    colors: ['Beige', 'Kaki', 'Marron'],
    gender: 'homme',
    stock_quantity: 20,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },

  // T-Shirts Femme
  {
    id: '5',
    name: 'T-Shirt Femme Basique Coton',
    description: 'T-shirt basique en coton doux, coupe féminine flatteuse. Essentiel de la garde-robe moderne.',
    price: 32.000,
    category_id: '2',
    category: mockCategories[1],
    images: ['https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Rose', 'Blanc', 'Noir', 'Lavande'],
    gender: 'femme',
    stock_quantity: 40,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '6',
    name: 'T-Shirt Femme Crop Top',
    description: 'Crop top tendance en coton stretch, parfait pour les looks estivaux. Coupe moderne et confortable.',
    price: 28.000,
    category_id: '2',
    category: mockCategories[1],
    images: ['https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg'],
    sizes: ['XS', 'S', 'M', 'L'],
    colors: ['Blanc', 'Rose', 'Jaune', 'Menthe'],
    gender: 'femme',
    stock_quantity: 35,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '7',
    name: 'T-Shirt Femme Oversize',
    description: 'T-shirt oversize tendance, parfait pour un look décontracté et moderne. Coton premium ultra-doux.',
    price: 45.000,
    category_id: '2',
    category: mockCategories[1],
    images: ['https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg'],
    sizes: ['S', 'M', 'L'],
    colors: ['Beige', 'Gris', 'Blanc', 'Noir'],
    gender: 'femme',
    stock_quantity: 22,
    is_featured: false,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '8',
    name: 'T-Shirt Femme Motif Floral',
    description: 'T-shirt avec joli motif floral, parfait pour le printemps. Coupe féminine et tissu respirant.',
    price: 39.000,
    category_id: '2',
    category: mockCategories[1],
    images: ['https://images.pexels.com/photos/1036622/pexels-photo-1036622.jpeg'],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Blanc', 'Rose', 'Bleu'],
    gender: 'femme',
    stock_quantity: 28,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },

  // T-Shirts Enfant
  {
    id: '9',
    name: 'T-Shirt Enfant Coloré',
    description: 'T-shirt amusant pour enfants avec couleurs vives. Coton hypoallergénique et résistant aux lavages.',
    price: 22.000,
    category_id: '3',
    category: mockCategories[2],
    images: ['https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'],
    sizes: ['2-3 ans', '4-5 ans', '6-7 ans', '8-9 ans', '10-11 ans'],
    colors: ['Rouge', 'Bleu', 'Jaune', 'Vert'],
    gender: 'unisexe',
    stock_quantity: 45,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '10',
    name: 'T-Shirt Enfant Superhéros',
    description: 'T-shirt avec motifs de superhéros, parfait pour les petits aventuriers. Impression haute qualité.',
    price: 25.000,
    category_id: '3',
    category: mockCategories[2],
    images: ['https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'],
    sizes: ['2-3 ans', '4-5 ans', '6-7 ans', '8-9 ans'],
    colors: ['Bleu', 'Rouge', 'Noir'],
    gender: 'unisexe',
    stock_quantity: 30,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '11',
    name: 'T-Shirt Enfant Licorne',
    description: 'T-shirt magique avec motif licorne, parfait pour les petites princesses. Paillettes qui brillent.',
    price: 27.000,
    category_id: '3',
    category: mockCategories[2],
    images: ['https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'],
    sizes: ['2-3 ans', '4-5 ans', '6-7 ans', '8-9 ans', '10-11 ans'],
    colors: ['Rose', 'Violet', 'Blanc'],
    gender: 'femme',
    stock_quantity: 25,
    is_featured: false,
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: '12',
    name: 'T-Shirt Enfant Sport',
    description: 'T-shirt de sport pour enfants actifs. Tissu technique qui évacue la transpiration.',
    price: 30.000,
    category_id: '3',
    category: mockCategories[2],
    images: ['https://images.pexels.com/photos/1620760/pexels-photo-1620760.jpeg'],
    sizes: ['4-5 ans', '6-7 ans', '8-9 ans', '10-11 ans', '12-13 ans'],
    colors: ['Bleu', 'Vert', 'Orange', 'Noir'],
    gender: 'unisexe',
    stock_quantity: 35,
    is_featured: true,
    created_at: '2025-01-01T00:00:00Z'
  }
];

export const mockUser: User = {
  id: '1',
  email: 'user@example.com',
  full_name: 'Utilisateur Test',
  role: 'customer',
  created_at: '2025-01-01T00:00:00Z'
};

export const mockAdmins: User[] = [
  {
    id: 'admin-1',
    email: 'super.admin@example.com',
    full_name: 'Super Admin',
    role: 'super_admin',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'admin-2',
    email: 'admin.user@example.com',
    full_name: 'Admin User',
    role: 'admin',
    created_at: '2025-01-01T00:00:00Z'
  },
  {
    id: 'admin-3',
    email: 'another.admin@example.com',
    full_name: 'Another Admin',
    role: 'admin',
    created_at: '2025-01-01T00:00:00Z'
  },
];

export const mockReviews: Review[] = [
  {
    id: 'review-1',
    user_id: '1',
    user: mockUser,
    product_id: '1',
    product: mockProducts[0],
    rating: 5,
    comment: 'Excellent produit, très confortable et de bonne qualité. Je recommande vivement !',
    created_at: '2025-07-11T09:00:00Z',
  },
  {
    id: 'review-2',
    user_id: '1',
    user: mockUser,
    product_id: '5',
    product: mockProducts[4],
    rating: 4,
    comment: 'Jolie couleur et tissu agréable. La taille est un peu juste, je conseillerais de prendre une taille au-dessus.',
    created_at: '2025-07-13T15:20:00Z',
  },
  {
    id: 'review-3',
    user_id: '1',
    user: mockUser,
    product_id: '9',
    product: mockProducts[8],
    rating: 5,
    comment: 'Adorable et de très bonne qualité. Mon fils adore !',
    created_at: '2025-07-14T11:45:00Z',
  },
];

export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    user_id: '1',
    user: mockUser,
    items: [
      { id: 'item-1', order_id: 'ORD-001', product_id: '1', product: mockProducts[0], size: 'M', color: 'Noir', quantity: 1, price: 35.000 },
      { id: 'item-2', order_id: 'ORD-001', product_id: '5', product: mockProducts[4], size: 'S', color: 'Rose', quantity: 1, price: 32.000 },
    ],
    total_amount: 67.000,
    status: 'delivered',
    shipping_address: '123 Rue de la Liberté, Tunis, Tunisie',
    phone: '+216 12 345 678',
    created_at: '2025-07-10T10:30:00Z',
  },
  {
    id: 'ORD-002',
    user_id: '1',
    user: mockUser,
    items: [
      { id: 'item-3', order_id: 'ORD-002', product_id: '2', product: mockProducts[1], size: 'L', color: 'Blanc', quantity: 2, price: 42.000 },
    ],
    total_amount: 84.000,
    status: 'shipped',
    shipping_address: '456 Avenue Habib Bourguiba, Sousse, Tunisie',
    phone: '+216 98 765 432',
    created_at: '2025-07-12T14:00:00Z',
  },
  {
    id: 'ORD-003',
    user_id: '1',
    user: mockUser,
    items: [
      { id: 'item-4', order_id: 'ORD-003', product_id: '9', product: mockProducts[8], size: '4-5 ans', color: 'Rouge', quantity: 1, price: 22.000 },
    ],
    total_amount: 22.000,
    status: 'pending',
    shipping_address: '789 Boulevard de l\'Environnement, Sfax, Tunisie',
    phone: '+216 22 111 333',
    created_at: '2025-07-14T09:15:00Z',
  },
];