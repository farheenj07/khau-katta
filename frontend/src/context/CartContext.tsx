import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { CartItem, CartSummary, Product } from '../types';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';
import {
  getCart,
  addToCartApi,
  updateCartQuantityApi,
  removeFromCartApi,
  clearCartApi
} from '../services/api';

interface CartContextType {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  grandTotal: number;
  loading: boolean;
  addItem: (product: Product, quantity?: number) => Promise<boolean>;
  updateQuantity: (productId: string, quantity: number) => Promise<boolean>;
  removeItem: (productId: string) => Promise<boolean>;
  clearCart: () => Promise<boolean>;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, token } = useAuth();
  const { showToast } = useToast();

  const userKey = user?.id ? `khau_katta_cart_${user.id}` : 'khau_katta_cart_guest';

  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(userKey);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {
      // ignore
    }
    return [];
  });

  const [loading, setLoading] = useState(false);

  // Sync to user-specific localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(userKey, JSON.stringify(items));
    } catch {
      // ignore
    }
  }, [items, userKey]);

  // When user or token changes (e.g. customer switches, login/logout), refresh cart for that user
  useEffect(() => {
    let isMounted = true;

    async function syncUserCart() {
      if (!token || !user) {
        // Load guest or existing local storage for guest
        const saved = localStorage.getItem('khau_katta_cart_guest');
        if (isMounted) {
          setItems(saved ? JSON.parse(saved) : []);
        }
        return;
      }

      setLoading(true);
      try {
        const cartSummary: CartSummary = await getCart(token);
        if (isMounted && cartSummary && Array.isArray(cartSummary.items)) {
          // If server has items, use them; if server is empty but local had items, we can keep or sync
          if (cartSummary.items.length > 0) {
            setItems(cartSummary.items);
          } else {
            const localSaved = localStorage.getItem(`khau_katta_cart_${user.id}`);
            if (localSaved) {
              const parsed: CartItem[] = JSON.parse(localSaved);
              if (parsed.length > 0) {
                // Sync local items to server
                for (const it of parsed) {
                  await addToCartApi(it.productId, it.quantity, token);
                }
                const refreshed = await getCart(token);
                if (isMounted) setItems(refreshed.items || []);
              } else {
                setItems([]);
              }
            } else {
              setItems([]);
            }
          }
        }
      } catch (err) {
        console.error('Cart sync error:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    syncUserCart();

    return () => {
      isMounted = false;
    };
  }, [user?.id, token]);

  const addItem = useCallback(
    async (product: Product, quantityToAdd: number = 1): Promise<boolean> => {
      if (!product.isAvailable) {
        showToast(`"${product.name}" is out of stock.`, 'error');
        return false;
      }

      if (token) {
        // Backend persistent cart flow with price validation
        try {
          const res = await addToCartApi(product.id, quantityToAdd, token);
          if (res.success && res.data) {
            setItems(res.data.items);
            showToast(`Added "${product.name}" to cart!`, 'success');
            return true;
          } else {
            showToast(res.message || 'Failed to add item to cart.', 'error');
            return false;
          }
        } catch {
          showToast('Network error adding item to cart.', 'error');
          return false;
        }
      } else {
        // Client-side state fallback for non-logged-in visitors
        setItems(prev => {
          const existing = prev.find(i => i.productId === product.id);
          if (existing) {
            return prev.map(i =>
              i.productId === product.id
                ? {
                    ...i,
                    quantity: i.quantity + quantityToAdd,
                    itemTotal: (i.quantity + quantityToAdd) * i.price
                  }
                : i
            );
          } else {
            return [
              ...prev,
              {
                id: `ci-client-${Date.now()}`,
                productId: product.id,
                productName: product.name,
                productImage: product.imageUrl,
                stallId: product.stallId,
                stallName: product.stallName || 'Khau Katta Stall',
                price: product.price,
                quantity: quantityToAdd,
                itemTotal: product.price * quantityToAdd,
                isVeg: product.isVeg,
                isAvailable: product.isAvailable
              }
            ];
          }
        });
        showToast(`Added "${product.name}" to cart!`, 'success');
        return true;
      }
    },
    [token, showToast]
  );

  const updateQuantity = useCallback(
    async (productId: string, newQuantity: number): Promise<boolean> => {
      if (token) {
        try {
          const res = await updateCartQuantityApi(productId, newQuantity, token);
          if (res.success && res.data) {
            setItems(res.data.items);
            return true;
          } else {
            showToast(res.message || 'Failed to update quantity.', 'error');
            return false;
          }
        } catch {
          showToast('Network error updating cart.', 'error');
          return false;
        }
      } else {
        setItems(prev => {
          if (newQuantity <= 0) {
            return prev.filter(i => i.productId !== productId);
          }
          return prev.map(i =>
            i.productId === productId
              ? {
                  ...i,
                  quantity: newQuantity,
                  itemTotal: newQuantity * i.price
                }
              : i
          );
        });
        return true;
      }
    },
    [token, showToast]
  );

  const removeItem = useCallback(
    async (productId: string): Promise<boolean> => {
      if (token) {
        try {
          const res = await removeFromCartApi(productId, token);
          if (res.success && res.data) {
            setItems(res.data.items);
            showToast('Item removed from cart.', 'info');
            return true;
          }
        } catch {
          showToast('Failed to remove item.', 'error');
          return false;
        }
      }
      setItems(prev => prev.filter(i => i.productId !== productId));
      showToast('Item removed from cart.', 'info');
      return true;
    },
    [token, showToast]
  );

  const clearCart = useCallback(async (): Promise<boolean> => {
    if (token) {
      try {
        await clearCartApi(token);
      } catch {
        // ignore
      }
    }
    setItems([]);
    return true;
  }, [token]);

  const getItemQuantity = useCallback(
    (productId: string): number => {
      const found = items.find(i => i.productId === productId);
      return found ? found.quantity : 0;
    },
    [items]
  );

  const subtotal = items.reduce((sum, i) => sum + i.itemTotal, 0);
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const deliveryFee = items.length > 0 ? 30 : 0;
  const grandTotal = subtotal + deliveryFee;

  const value: CartContextType = {
    items,
    totalItems,
    subtotal,
    deliveryFee,
    grandTotal,
    loading,
    addItem,
    updateQuantity,
    removeItem,
    clearCart,
    getItemQuantity
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
