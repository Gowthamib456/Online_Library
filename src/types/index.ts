export type Role = 'admin' | 'user' | null;

export interface User {
  id: string;
  email: string;
  phone: string;
  name: string;
  role: Role;
  addresses: Address[];
}

export interface Address {
  id: string;
  line1: string;
  city: string;
  state: string;
  zip: string;
  phone: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  category: string;
  rfid: string;
  inStock: boolean;
  price: number;
  rating: number;
  reviews: number;
}

export interface CartItem extends Book {
  type: 'buy' | 'borrow';
  // Borrowing specific fields
  borrowedDate?: string;
  dueDate?: string;
  isReturned?: boolean;
  renewalCount?: number;
  fine?: number;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  totalAmount: number;
  status: 'confirmed' | 'shipped' | 'dispatched' | 'out-for-delivery' | 'delivered';
  orderDate: string;
  expectedDelivery: string;
  actualDeliveryDate?: string; // Added to track early delivery
  address: Address;
  paymentMethod: 'cod' | 'online';
}

export const CATEGORIES = [
  "General Works",
  "Computer Science & Information",
  "Philosophy & Psychology",
  "Religion",
  "Social Sciences",
  "Language",
  "Science",
  "Technology",
  "Arts",
  "Literature",
  "History & Geography"
] as const;
