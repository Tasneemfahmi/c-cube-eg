import React, { createContext, useContext, useEffect, useState } from 'react';
import { useCart } from './CartContext';
import { useDiscounts } from './DiscountContext';
import { calculateCartDiscounts, getAllDiscountEligibility } from '../utils/discountUtils';

const CartWithDiscountsContext = createContext();

export const useCartWithDiscounts = () => {
  const context = useContext(CartWithDiscountsContext);
  if (!context) {
    throw new Error('useCartWithDiscounts must be used within a CartWithDiscountsProvider');
  }
  return context;
};

export const CartWithDiscountsProvider = ({ children }) => {
  const cart = useCart();
  const { discounts } = useDiscounts();

  console.log('🛒 CartWithDiscountsProvider - Cart items:', cart.items?.length || 0);
  console.log('🎁 CartWithDiscountsProvider - Discounts:', discounts?.length || 0);
  const [discountData, setDiscountData] = useState({ 
    totalSavings: 0, 
    appliedDiscounts: [], 
    freeItems: [], 
    discountedItems: [] 
  });
  const [discountEligibility, setDiscountEligibility] = useState([]);

  // Calculate discounts whenever cart items or discounts change
  useEffect(() => {
    if (cart.items.length === 0 || discounts.length === 0) {
      setDiscountData({ totalSavings: 0, appliedDiscounts: [], freeItems: [], discountedItems: [] });
      setDiscountEligibility([]);
      return;
    }

    // Calculate applied discounts
    const calculatedDiscounts = calculateCartDiscounts(cart.items, discounts, cart.getItemPrice);
    setDiscountData(calculatedDiscounts);

    // Calculate discount eligibility with potential savings information
    const eligibility = getAllDiscountEligibility(cart.items, discounts, cart.getItemPrice);
    setDiscountEligibility(eligibility);
  }, [cart.items, discounts, cart.getItemPrice]);

  // Calculate final totals with discounts
  const subtotalWithoutDiscounts = cart.subtotal;
  const discountSavings = discountData.totalSavings;
  const subtotalWithDiscounts = subtotalWithoutDiscounts - discountSavings;

  // Tax calculation (14% for Egypt)
  const taxRate = 0.14;
  const tax = subtotalWithDiscounts * taxRate;
  const total = subtotalWithDiscounts + tax;

  const value = {
    // Original cart functionality
    ...cart,
    
    // Discount-related data
    discountData,
    discountEligibility,
    
    // Updated totals
    subtotalWithoutDiscounts,
    discountSavings,
    subtotalWithDiscounts,
    tax,
    total,
    
    // Helper functions
    hasDiscounts: discountData.totalSavings > 0,
    getFreeItemsForProduct: (productId) => {
      return discountData.freeItems.filter(item => item.product.id === productId);
    },
    getDiscountedItemsForProduct: (productId) => {
      return discountData.discountedItems.filter(item => item.product.id === productId);
    }
  };

  return (
    <CartWithDiscountsContext.Provider value={value}>
      {children}
    </CartWithDiscountsContext.Provider>
  );
};
