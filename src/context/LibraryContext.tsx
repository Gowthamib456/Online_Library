import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Book, CartItem, Order, User } from '../types';
import { INITIAL_BOOKS } from '../data/books';

interface LibraryContextType {
  books: Book[];
  cart: CartItem[];
  orders: Order[];
  addToCart: (book: Book, type: 'buy' | 'borrow') => { success: boolean; message: string };
  removeFromCart: (bookId: string) => void;
  clearCart: () => void;
  placeOrder: (user: User, address: any, paymentMethod: 'cod' | 'online') => void;
  updateBookStatus: (bookId: string, inStock: boolean) => void;
  updateOrderStatus: (orderId: string, status: Order['status']) => void;
  renewBook: (orderId: string, bookId: string) => { success: boolean; message: string };
  returnBook: (orderId: string, bookId: string) => { success: boolean; message: string };
  recommendations: Book[];
}

const LibraryContext = createContext<LibraryContextType | undefined>(undefined);

export const LibraryProvider = ({ children }: { children: ReactNode }) => {
  const [books, setBooks] = useState<Book[]>(INITIAL_BOOKS);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);

  const addToCart = (book: Book, type: 'buy' | 'borrow') => {
    if (type === 'borrow') {
      const borrowCount = cart.filter(item => item.type === 'borrow').length;
      if (borrowCount >= 2) {
        return { success: false, message: "You can only borrow up to 2 books for study & return." };
      }
    }
    
    if (cart.some(item => item.id === book.id)) {
        return { success: false, message: "Book already in cart." };
    }

    setCart([...cart, { ...book, type }]);
    return { success: true, message: "Added to cart" };
  };

  const removeFromCart = (bookId: string) => {
    setCart(cart.filter(item => item.id !== bookId));
  };

  const clearCart = () => setCart([]);

  const placeOrder = (user: User, address: any, paymentMethod: 'cod' | 'online') => {
    const now = new Date();
    
    const orderItems: CartItem[] = cart.map(item => {
      if (item.type === 'borrow') {
        const dueDate = new Date(now);
        dueDate.setDate(dueDate.getDate() + 7); // 7 days default
        return {
          ...item,
          borrowedDate: now.toISOString(),
          dueDate: dueDate.toISOString(),
          isReturned: false,
          renewalCount: 0,
          fine: 0
        };
      }
      return item;
    });

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      userId: user.id,
      items: orderItems,
      totalAmount: cart.reduce((sum, item) => sum + item.price, 0),
      status: 'confirmed',
      orderDate: now.toISOString(),
      expectedDelivery: new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000).toISOString(), // 3 days later
      address,
      paymentMethod
    };
    setOrders([newOrder, ...orders]);
    
    // Update stock
    const orderedIds = cart.map(c => c.id);
    setBooks(books.map(b => orderedIds.includes(b.id) ? { ...b, inStock: false } : b));
    
    clearCart();
  };

  const updateBookStatus = (bookId: string, inStock: boolean) => {
    setBooks(books.map(b => b.id === bookId ? { ...b, inStock } : b));
  };

  const updateOrderStatus = (orderId: string, status: Order['status']) => {
    setOrders(orders.map(o => {
      if (o.id === orderId) {
        const updates: Partial<Order> = { status };
        // If marking as delivered, record the actual delivery date
        if (status === 'delivered' && !o.actualDeliveryDate) {
          updates.actualDeliveryDate = new Date().toISOString();
        }
        return { ...o, ...updates };
      }
      return o;
    }));
  };

  const renewBook = (orderId: string, bookId: string) => {
    let success = false;
    let message = '';

    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id !== orderId) return order;

      const updatedItems = order.items.map(item => {
        if (item.id !== bookId || item.type !== 'borrow') return item;

        // Logic: Renew adds 7 days
        const currentDueDate = new Date(item.dueDate!);
        currentDueDate.setDate(currentDueDate.getDate() + 7);
        
        success = true;
        message = 'Renewal Successful! Due date extended by 7 days.';
        
        return {
          ...item,
          dueDate: currentDueDate.toISOString(),
          renewalCount: (item.renewalCount || 0) + 1
        };
      });

      return { ...order, items: updatedItems };
    }));

    return { success, message };
  };

  const returnBook = (orderId: string, bookId: string) => {
    let success = false;
    let message = '';

    setOrders(prevOrders => prevOrders.map(order => {
      if (order.id !== orderId) return order;

      const updatedItems = order.items.map(item => {
        if (item.id !== bookId || item.type !== 'borrow') return item;

        // Calculate Fine
        const now = new Date();
        const dueDate = new Date(item.dueDate!);
        
        // Reset time parts for accurate day calculation
        now.setHours(0, 0, 0, 0);
        dueDate.setHours(0, 0, 0, 0);

        let fine = 0;
        if (now > dueDate) {
          const diffTime = Math.abs(now.getTime() - dueDate.getTime());
          const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
          fine = diffDays * 50; // ₹50 per day fine
        }

        const deposit = Math.floor(item.price / 2);
        const refund = Math.max(0, deposit - fine); // Refund cannot be negative

        success = true;
        if (fine > 0) {
            message = `Returned Late! Fine: ₹${fine}. Refund Initiated: ₹${refund} (Deposit: ₹${deposit})`;
        } else {
            message = `Returned Successfully. Full Refund of ₹${refund} initiated.`;
        }
        
        // Update global stock
        updateBookStatus(bookId, true);

        return {
          ...item,
          isReturned: true,
          fine: fine
        };
      });

      return { ...order, items: updatedItems };
    }));

    return { success, message };
  };

  // Simple recommendation logic based on random selection for demo
  const recommendations = books.filter(b => b.rating > 4.5).slice(0, 5);

  return (
    <LibraryContext.Provider value={{ 
      books, cart, orders, addToCart, removeFromCart, clearCart, 
      placeOrder, updateBookStatus, updateOrderStatus, renewBook, returnBook, recommendations 
    }}>
      {children}
    </LibraryContext.Provider>
  );
};

export const useLibrary = () => {
  const context = useContext(LibraryContext);
  if (!context) throw new Error('useLibrary must be used within a LibraryProvider');
  return context;
};
