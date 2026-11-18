export type Category = 'Cafetería' | 'Papelería' | 'Tecnología' | 'Ropa';

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Category;
  emoji: string;
  stock: number;
  sold: number;
}

export interface CartItem {
  productId: string;
  name: string;
  emoji: string;
  price: number;
  quantity: number;
}

export type UserRole = 'customer' | 'admin';

export interface AppUser {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
}

export type OrderStatus = 'pendiente' | 'preparando' | 'en camino' | 'entregado';

export interface Order {
  id: string;
  userId: string;
  userName: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  total: number;
  deliveryPoint: string;
  route: string[];
  distance: number;
  status: OrderStatus;
  createdAt: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  text: string;
  createdAt: number;
}

export interface ChatThread {
  userId: string;
  userName: string;
  lastMessage: string;
  updatedAt: number;
}
