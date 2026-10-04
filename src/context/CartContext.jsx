import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { cartApi } from '../services/cartApi';
import { useAuth } from './AuthContext';
import { useToast } from './ToastContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { isAuthenticated, user } = useAuth();
  const { success, info } = useToast();

  const [items, setItems] = useState(() => {
    try {
      const saved = localStorage.getItem('elane_guest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [promoCode, setPromoCode] = useState('');
  const [appliedDiscountRate, setAppliedDiscountRate] = useState(0); // 0.1 for 10%
  const [loading, setLoading] = useState(false);

  // Sync / load cart on auth change
  useEffect(() => {
    const handleAuthSync = async () => {
      if (isAuthenticated) {
        setLoading(true);
        try {
          // If we had guest items in localStorage, sync them with server
          const guestItems = JSON.parse(localStorage.getItem('elane_guest_cart') || '[]');
          if (guestItems.length > 0) {
            await cartApi.syncCart(guestItems);
            localStorage.removeItem('elane_guest_cart');
          }
          // Fetch user cart
          const res = await cartApi.getCart();
          if (res?.data?.items) {
            setItems(res.data.items);
          }
        } catch (err) {
          console.warn('Cart backend sync fallback to local cache:', err.message);
        } finally {
          setLoading(false);
        }
      } else {
        // Guest mode: load from localStorage
        try {
          const saved = localStorage.getItem('elane_guest_cart');
          if (saved) setItems(JSON.parse(saved));
        } catch {
          setItems([]);
        }
      }
    };

    handleAuthSync();
  }, [isAuthenticated, user?.id]);

  // Persist guest cart to localStorage
  useEffect(() => {
    if (!isAuthenticated) {
      localStorage.setItem('elane_guest_cart', JSON.stringify(items));
    }
  }, [items, isAuthenticated]);

  const addToCart = useCallback(
    async (product, variant, quantity = 1, openDrawerOnAdd = true, monogramConfig = null) => {
      const monogramSuffix = monogramConfig?.text ? `-mono-${monogramConfig.text}` : '';
      const cartItemId = `${product.id}-${variant?.id || 'standard'}${monogramSuffix}`;
      const unitPrice = product.sale_price || product.base_price;

      setItems((prevItems) => {
        const existingIndex = prevItems.findIndex((item) => item.id === cartItemId);
        if (existingIndex > -1) {
          const updated = [...prevItems];
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + quantity,
          };
          return updated;
        } else {
          const newItem = {
            id: cartItemId,
            productId: product.id,
            slug: product.slug,
            name: product.name,
            price: unitPrice,
            basePrice: product.base_price,
            image: product.images?.[0] || '',
            size: variant?.size || 'Standard',
            color: variant?.color || 'Default',
            colorHex: variant?.colorHex,
            variantId: variant?.id,
            quantity,
            monogram: monogramConfig,
          };
          return [...prevItems, newItem];
        }
      });

      if (isAuthenticated) {
        try {
          await cartApi.addItem({
            productId: product.id,
            variantId: variant?.id,
            quantity,
          });
        } catch (err) {
          console.warn('Cart server sync notice:', err.message);
        }
      }

      success(`Added "${product.name}" to your bag`);
      if (openDrawerOnAdd) {
        setIsDrawerOpen(true);
      }
    },
    [isAuthenticated, success]
  );

  const updateQuantity = useCallback(
    async (cartItemId, newQuantity) => {
      if (newQuantity <= 0) {
        removeFromCart(cartItemId);
        return;
      }

      setItems((prev) =>
        prev.map((item) => (item.id === cartItemId ? { ...item, quantity: newQuantity } : item))
      );

      if (isAuthenticated) {
        try {
          await cartApi.updateItem(cartItemId, newQuantity);
        } catch (err) {
          console.warn('Update quantity server sync notice:', err.message);
        }
      }
    },
    [isAuthenticated]
  );

  const removeFromCart = useCallback(
    async (cartItemId) => {
      setItems((prev) => prev.filter((item) => item.id !== cartItemId));

      if (isAuthenticated) {
        try {
          await cartApi.removeItem(cartItemId);
        } catch (err) {
          console.warn('Remove item server sync notice:', err.message);
        }
      }
      info('Item removed from your bag');
    },
    [isAuthenticated, info]
  );

  const clearCart = useCallback(async () => {
    setItems([]);
    setAppliedDiscountRate(0);
    setPromoCode('');
    if (!isAuthenticated) {
      localStorage.removeItem('elane_guest_cart');
    } else {
      try {
        await cartApi.clearCart();
      } catch (err) {
        // ignore
      }
    }
  }, [isAuthenticated]);

  const [flatDiscountAmount, setFlatDiscountAmount] = useState(0);

  const removePromo = () => {
    setPromoCode('');
    setAppliedDiscountRate(0);
    setFlatDiscountAmount(0);
    info('Promo coupon removed');
  };

  // Auto-apply discount from URL query parameter (e.g. from Abandoned Cart Recovery emails)
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const discountParam = params.get('discount');
      if (discountParam) {
        applyPromo(discountParam);
      }
    } catch {
      // ignore
    }
  }, []);

  const applyPromo = (code) => {
    const clean = code.trim().toUpperCase();
    if (clean === 'ELANE10' || clean === 'WELCOME10') {
      setAppliedDiscountRate(0.1);
      setFlatDiscountAmount(0);
      setPromoCode(clean);
      success(`Coupon ${clean} applied: 10% instant discount!`);
      return { success: true, message: '10% discount applied' };
    } else if (clean === 'RECOVER5') {
      setAppliedDiscountRate(0.05);
      setFlatDiscountAmount(0);
      setPromoCode(clean);
      success('✨ 5% Abandoned Bag Courtesy Voucher RECOVER5 applied!');
      return { success: true, message: '5% recovery discount applied' };
    } else if (clean === 'VIP20') {
      setAppliedDiscountRate(0.2);
      setFlatDiscountAmount(0);
      setPromoCode(clean);
      success('VIP Code VIP20 applied: 20% privilege discount!');
      return { success: true, message: '20% discount applied' };
    } else if (clean === 'FESTIVE500') {
      setAppliedDiscountRate(0);
      setFlatDiscountAmount(500);
      setPromoCode(clean);
      success('Festive Code FESTIVE500 applied: ₹500 off your order!');
      return { success: true, message: '₹500 flat discount applied' };
    } else if (clean === 'AMAZON15') {
      setAppliedDiscountRate(0.15);
      setFlatDiscountAmount(0);
      setPromoCode(clean);
      success('Coupon AMAZON15 applied: 15% instant discount!');
      return { success: true, message: '15% discount applied' };
    } else {
      return { success: false, message: 'Invalid promo code. Try "RECOVER5", "WELCOME10", "FESTIVE500", or "VIP20"' };
    }
  };

  // Calculations
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const totalQuantity = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const discountAmount = useMemo(() => {
    if (flatDiscountAmount > 0) {
      return Math.min(subtotal, flatDiscountAmount);
    }
    return Math.round(subtotal * appliedDiscountRate);
  }, [subtotal, appliedDiscountRate, flatDiscountAmount]);

  // Free shipping on orders over ₹100
  const shippingThreshold = 100;
  const shippingCost = subtotal >= shippingThreshold || items.length === 0 ? 0 : 25;
  const amountToFreeShipping = Math.max(0, shippingThreshold - subtotal);

  const total = useMemo(() => {
    return Math.max(0, subtotal - discountAmount + shippingCost);
  }, [subtotal, discountAmount, shippingCost]);

  return (
    <CartContext.Provider
      value={{
        items,
        totalQuantity,
        subtotal,
        discountAmount,
        shippingCost,
        shippingThreshold,
        amountToFreeShipping,
        total,
        promoCode,
        appliedDiscountRate,
        isDrawerOpen,
        setIsDrawerOpen,
        openDrawer: () => setIsDrawerOpen(true),
        closeDrawer: () => setIsDrawerOpen(false),
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyPromo,
        removePromo,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
