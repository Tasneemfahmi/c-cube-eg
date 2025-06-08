import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchActiveDiscounts } from '../utils/discountUtils';

const DiscountContext = createContext();

export const useDiscounts = () => {
  const context = useContext(DiscountContext);
  if (!context) {
    throw new Error('useDiscounts must be used within a DiscountProvider');
  }
  return context;
};

export const DiscountProvider = ({ children }) => {
  const [discounts, setDiscounts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch discounts on component mount
  useEffect(() => {
    loadDiscounts();
  }, []);

  const loadDiscounts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('🔍 Loading discounts from Firestore...');
      const activeDiscounts = await fetchActiveDiscounts();
      console.log('✅ Discounts loaded:', activeDiscounts);
      setDiscounts(activeDiscounts || []);
    } catch (err) {
      console.error('❌ Error loading discounts:', err);
      setError(err.message);
      // Set empty array as fallback
      setDiscounts([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Refresh discounts (can be called manually)
  const refreshDiscounts = async () => {
    await loadDiscounts();
  };

  // Get discounts applicable to a specific product
  const getProductDiscounts = (productId) => {
    return discounts.filter(discount => 
      discount.active && 
      discount.applicableProducts && 
      discount.applicableProducts.includes(productId)
    );
  };

  // Check if a product has any active discounts
  const hasProductDiscounts = (productId) => {
    return getProductDiscounts(productId).length > 0;
  };

  // Get all active discounts
  const getActiveDiscounts = () => {
    return discounts.filter(discount => discount.active);
  };

  const value = {
    discounts,
    isLoading,
    error,
    refreshDiscounts,
    getProductDiscounts,
    hasProductDiscounts,
    getActiveDiscounts
  };

  return (
    <DiscountContext.Provider value={value}>
      {children}
    </DiscountContext.Provider>
  );
};
