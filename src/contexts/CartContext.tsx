import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';
import { toast } from 'sonner';

interface CartItem {
  productId: number;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

interface CartContextType {
  cart: CartItem[];
  loading: boolean;
  addToCart: (productId: number, cantidad: number) => Promise<void>;
  removeFromCart: (productId: number) => Promise<void>;
  updateQuantity: (productId: number, cantidad: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const { user, isAuthenticated } = useAuth();
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    if (!isAuthenticated || !user) {
      setCart([]);
      return;
    }

    try {
      setLoading(true);
      const cartData = await apiService.getCarrito(user.id);
      setCart(cartData.items || []);
    } catch (error: any) {
      console.error('Error al cargar carrito:', error);
      if (error.response?.status !== 404) {
        toast.error('Error al cargar el carrito');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && user) {
      loadCart();
    } else {
      setCart([]);
    }
  }, [isAuthenticated, user?.id]);

  const addToCart = async (productId: number, cantidad: number) => {
    if (!isAuthenticated || !user) {
      toast.error('Debes iniciar sesión para agregar productos al carrito');
      return;
    }

    try {
      await apiService.addToCart(user.id, productId, cantidad);
      await loadCart();
      toast.success('Producto agregado al carrito');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al agregar producto al carrito';
      toast.error(errorMessage);
    }
  };

  const removeFromCart = async (productId: number) => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      await apiService.removeFromCart(user.id, productId);
      await loadCart();
      toast.success('Producto eliminado del carrito');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al eliminar producto del carrito';
      toast.error(errorMessage);
    }
  };

  const updateQuantity = async (productId: number, cantidad: number) => {
    if (cantidad <= 0) {
      await removeFromCart(productId);
      return;
    }

    if (!isAuthenticated || !user) {
      return;
    }

    try {
      const currentItem = cart.find((item) => item.productId === productId);
      if (!currentItem) {
        return;
      }

      const difference = cantidad - currentItem.quantity;
      if (difference > 0) {
        await apiService.addToCart(user.id, productId, difference);
      } else {
        await apiService.removeFromCart(user.id, productId);
        if (cantidad > 0) {
          await apiService.addToCart(user.id, productId, cantidad);
        }
      }
      await loadCart();
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al actualizar cantidad';
      toast.error(errorMessage);
    }
  };

  const clearCart = async () => {
    if (!isAuthenticated || !user) {
      return;
    }

    try {
      await apiService.clearCart(user.id);
      await loadCart();
      toast.success('Carrito vaciado');
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Error al vaciar el carrito';
      toast.error(errorMessage);
    }
  };

  const getCartTotal = (): number => {
    return cart.reduce((total, item) => total + item.subtotal, 0);
  };

  const getCartItemsCount = (): number => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  const refreshCart = async () => {
    await loadCart();
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        refreshCart,
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
