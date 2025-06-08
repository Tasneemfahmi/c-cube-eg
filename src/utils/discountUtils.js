import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * Fetch active discounts from Firestore
 */
export const fetchActiveDiscounts = async () => {
  try {
    const discountsRef = collection(db, 'discounts');
    const activeDiscountsQuery = query(discountsRef, where('active', '==', true));
    const querySnapshot = await getDocs(activeDiscountsQuery);
    
    const discounts = [];
    querySnapshot.forEach((doc) => {
      discounts.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    return discounts;
  } catch (error) {
    console.error('Error fetching discounts:', error);
    return [];
  }
};

/**
 * Check if a product is eligible for any discounts
 */
export const getApplicableDiscounts = (productId, discounts) => {
  return discounts.filter(discount => 
    discount.active && 
    discount.applicableProducts && 
    discount.applicableProducts.includes(productId)
  );
};

/**
 * Calculate discount for buyXgetY type
 */
const calculateBuyXGetYDiscount = (cartItems, discount, getItemPrice) => {
  const applicableItems = cartItems.filter(item => 
    discount.applicableProducts.includes(item.product.id)
  );
  
  if (applicableItems.length === 0) {
    return { savings: 0, freeItems: [], discountedItems: [] };
  }
  
  // Calculate total quantity of applicable items
  const totalQuantity = applicableItems.reduce((sum, item) => sum + item.quantity, 0);
  
  // Calculate how many free items we get
  const setsEligible = Math.floor(totalQuantity / discount.buyQuantity);
  const freeItemsCount = setsEligible * discount.freeQuantity;
  
  if (freeItemsCount === 0) {
    return { savings: 0, freeItems: [], discountedItems: [] };
  }
  
  // Sort items by price (highest first) to give away the most expensive items for free
  const sortedItems = [...applicableItems].sort((a, b) => {
    const priceA = getItemPrice(a.product, a.selectedSize);
    const priceB = getItemPrice(b.product, b.selectedSize);
    return priceB - priceA;
  });
  
  let remainingFreeItems = freeItemsCount;
  const freeItems = [];
  const discountedItems = [];
  
  // Distribute free items
  for (const item of sortedItems) {
    if (remainingFreeItems <= 0) break;
    
    const itemPrice = getItemPrice(item.product, item.selectedSize);
    const freeQuantityForThisItem = Math.min(remainingFreeItems, item.quantity);
    
    if (freeQuantityForThisItem > 0) {
      freeItems.push({
        ...item,
        freeQuantity: freeQuantityForThisItem,
        savings: itemPrice * freeQuantityForThisItem
      });
      
      discountedItems.push({
        ...item,
        originalQuantity: item.quantity,
        paidQuantity: item.quantity - freeQuantityForThisItem,
        freeQuantity: freeQuantityForThisItem
      });
      
      remainingFreeItems -= freeQuantityForThisItem;
    }
  }
  
  const totalSavings = freeItems.reduce((sum, item) => sum + item.savings, 0);
  
  return {
    savings: totalSavings,
    freeItems,
    discountedItems,
    discountInfo: {
      type: discount.type,
      buyQuantity: discount.buyQuantity,
      freeQuantity: discount.freeQuantity,
      setsEligible,
      totalFreeItems: freeItemsCount
    }
  };
};

/**
 * Calculate all applicable discounts for cart items
 */
export const calculateCartDiscounts = (cartItems, discounts, getItemPrice) => {
  let totalSavings = 0;
  const appliedDiscounts = [];
  const allFreeItems = [];
  const allDiscountedItems = [];
  
  for (const discount of discounts) {
    if (!discount.active) continue;
    
    let discountResult = { savings: 0, freeItems: [], discountedItems: [] };
    
    switch (discount.type) {
      case 'buyXgetY':
        discountResult = calculateBuyXGetYDiscount(cartItems, discount, getItemPrice);
        break;
      // Future discount types can be added here
      default:
        console.warn(`Unknown discount type: ${discount.type}`);
        continue;
    }
    
    if (discountResult.savings > 0) {
      totalSavings += discountResult.savings;
      appliedDiscounts.push({
        discount,
        ...discountResult
      });
      allFreeItems.push(...discountResult.freeItems);
      allDiscountedItems.push(...discountResult.discountedItems);
    }
  }
  
  return {
    totalSavings,
    appliedDiscounts,
    freeItems: allFreeItems,
    discountedItems: allDiscountedItems
  };
};

/**
 * Format discount description for display
 */
export const formatDiscountDescription = (discount) => {
  switch (discount.type) {
    case 'buyXgetY':
      return `Buy ${discount.buyQuantity}, Get ${discount.freeQuantity} Free!`;
    default:
      return 'Special Offer';
  }
};

/**
 * Check if cart qualifies for any discounts
 */
export const getCartDiscountEligibility = (cartItems, discounts) => {
  const eligibility = [];
  
  for (const discount of discounts) {
    if (!discount.active) continue;
    
    const applicableItems = cartItems.filter(item => 
      discount.applicableProducts.includes(item.product.id)
    );
    
    if (applicableItems.length === 0) continue;
    
    const totalQuantity = applicableItems.reduce((sum, item) => sum + item.quantity, 0);
    
    switch (discount.type) {
      case 'buyXgetY':
        const needed = discount.buyQuantity - totalQuantity;
        eligibility.push({
          discount,
          isEligible: totalQuantity >= discount.buyQuantity,
          itemsNeeded: Math.max(0, needed),
          currentQuantity: totalQuantity,
          description: formatDiscountDescription(discount)
        });
        break;
    }
  }
  
  return eligibility;
};
