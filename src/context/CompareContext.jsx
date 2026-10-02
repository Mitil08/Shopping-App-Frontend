import React, { createContext, useContext, useState, useEffect } from 'react';
import { useToast } from './ToastContext';

const CompareContext = createContext(null);

export const CompareProvider = ({ children }) => {
  const { success, info, error: toastError } = useToast();
  const [compareItems, setCompareItems] = useState(() => {
    try {
      const saved = localStorage.getItem('elane_compare_items');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCompareOpen, setIsCompareOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem('elane_compare_items', JSON.stringify(compareItems));
    } catch (e) {
      // Storage unavailable
    }
  }, [compareItems]);

  const addToCompare = (product) => {
    if (!product) return;
    if (compareItems.some((item) => item.id === product.id)) {
      info(`"${product.name}" is already in comparison`);
      return;
    }
    if (compareItems.length >= 3) {
      toastError('You can compare a maximum of 3 garments at once. Remove one first.');
      return;
    }

    setCompareItems((prev) => [...prev, product]);
    success(`Added "${product.name}" to comparison`);
  };

  const removeFromCompare = (productId) => {
    setCompareItems((prev) => prev.filter((item) => item.id !== productId));
  };

  const clearCompare = () => {
    setCompareItems([]);
  };

  const isInCompare = (productId) => {
    return compareItems.some((item) => item.id === productId);
  };

  const openCompare = () => setIsCompareOpen(true);
  const closeCompare = () => setIsCompareOpen(false);

  return (
    <CompareContext.Provider
      value={{
        compareItems,
        addToCompare,
        removeFromCompare,
        clearCompare,
        isInCompare,
        isCompareOpen,
        openCompare,
        closeCompare,
        compareCount: compareItems.length,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => {
  const context = useContext(CompareContext);
  if (!context) {
    throw new Error('useCompare must be used within a CompareProvider');
  }
  return context;
};
