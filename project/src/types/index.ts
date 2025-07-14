export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'customer' | 'admin' | 'super_admin';
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  image_url: string;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category_id: string;
  category?: Category;
  images: string[];
  sizes: string[];
  colors: string[];
  gender: 'homme' | 'femme' | 'unisexe';
  stock_quantity: number;
  is_featured: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  product_id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface Order {
  id: string;
  user_id: string;
  user?: User;
  items: OrderItem[];
  total_amount: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shipping_address: string;
  phone: string;
  created_at: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  product: Product;
  size: string;
  color: string;
  quantity: number;
  price: number;
}