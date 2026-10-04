import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useCart } from './CartContext';
import { useToast } from './ToastContext';
import { automationApi } from '../services/automationApi';

const WishlistContext = createContext(null);

export const WishlistProvider = ({ children }) => {
  const { addToCart } = useCart();
  const { success, info } = useToast();

  const [wishlist, setWishlist] = useState(() => {
    try {
      const saved = localStorage.getItem('elane_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem('elane_wishlist', JSON.stringify(wishlist));
    // Sync with backend for automated price drop & stock alert triggers
    try {
      const userStr = localStorage.getItem('elane_auth_user');
      const user = userStr ? JSON.parse(userStr) : null;
      automationApi.syncWishlist(user?.id, wishlist, user?.email, user?.phone).catch(() => {});
    } catch (e) {}
  }, [wishlist]);

  const isInWishlist = useCallback(
    (productId) => {
      return wishlist.some((item) => item.id === productId);
    },
    [wishlist]
  );

  const toggleWishlist = useCallback(
    (product) => {
      setWishlist((prev) => {
        const exists = prev.some((item) => item.id === product.id);
        if (exists) {
          info(`Removed "${product.name}" from your wishlist`);
          return prev.filter((item) => item.id !== product.id);
        } else {
          success(`Saved "${product.name}" to your wishlist`);
          return [...prev, product];
        }
      });
    },
    [info, success]
  );

  const removeFromWishlist = useCallback((productId) => {
    setWishlist((prev) => prev.filter((item) => item.id !== productId));
  }, []);

  const moveToCart = useCallback(
    (product) => {
      const defaultVariant = product.variants?.[0] || { size: 'M', color: 'Default' };
      addToCart(product, defaultVariant, 1);
      removeFromWishlist(product.id);
    },
    [addToCart, removeFromWishlist]
  );

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        wishlistCount: wishlist.length,
        isInWishlist,
        toggleWishlist,
        removeFromWishlist,
        moveToCart,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error('useWishlist must be used within a WishlistProvider');
  }
  return context;
};
