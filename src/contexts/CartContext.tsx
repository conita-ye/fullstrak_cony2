import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, Product } from '../types';
import { productos } from '../data/mockProductos';

interface CartContextType {
  cart: CartItem[];
  addToCart: (productId: string, cantidad: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, cantidad: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  getProductById: (productId: string) => Product | undefined;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  const addToCart = (productId: string, cantidad: number) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.productId === productId);
      
      if (existingItem) {
        return prevCart.map((item) =>
          item.productId === productId
            ? { ...item, cantidad: item.cantidad + cantidad }
            : item
        );
      }
      
      return [...prevCart, { productId, cantidad }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.productId !== productId));
  };

  const updateQuantity = (productId: string, cantidad: number) => {
    if (cantidad <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.productId === productId ? { ...item, cantidad } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getProductById = (productId: string): Product | undefined => {
    return productos.find((p) => p.id === productId);
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => {
      const product = getProductById(item.productId);
      return total + (product?.precio || 0) * item.cantidad;
    }, 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((count, item) => count + item.cantidad, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        getProductById,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
