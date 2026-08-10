export type Role = 'USER' | 'ADMIN' | 'MANAGER';

export type OrderStatus = 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl: string | null;
  role: Role;
  phone: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageUrl: string;
  _count?: { products: number };
}

export interface Product {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  description: string;
  specs: Record<string, string>;
  price: string;
  compareAtPrice: string | null;
  stock: number;
  images: string[];
  categoryId: string;
  category: Category;
  avgRating: number;
  reviewCount: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { id: string; name: string; avatarUrl: string | null };
}

export interface Address {
  id: string;
  userId: string;
  label: string;
  line1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault: boolean;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  productId: string;
  titleSnapshot: string;
  priceSnapshot: string;
  quantity: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  addressId: string;
  address?: Address;
  items: OrderItem[];
  subtotal: string;
  shippingFee: string;
  total: string;
  status: OrderStatus;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
  user?: { id: string; name: string; email: string };
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  published: boolean;
  createdAt: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  avatarUrl: string;
  message: string;
  rating: number;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  resolved: boolean;
  createdAt: string;
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface CartItem {
  productId: string;
  title: string;
  price: string;
  image: string;
  quantity: number;
  stock: number;
}
