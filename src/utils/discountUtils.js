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
 * Requirements:
 * - Discount only applies when exact totalQuantity requirement is met
 * - All items must be from applicableProducts
 * - Cheapest items are free (not most expensive)
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

  // IMPORTANT: Check if we have enough items for the COMPLETE discount requirement
  // For "Buy X Get Y Free", we need at least (X + Y) total items to apply the discount
  const totalRequiredItems = discount.buyQuantity + discount.freeQuantity;

  if (totalQuantity < totalRequiredItems) {
    console.log(`❌ Discount "${discount.name}" requires ${totalRequiredItems} items (${discount.buyQuantity} buy + ${discount.freeQuantity} free), but cart only has ${totalQuantity} applicable items`);
    return { savings: 0, freeItems: [], discountedItems: [] };
  }

  // Calculate how many complete sets we can make
  const setsEligible = Math.floor(totalQuantity / totalRequiredItems);
  const freeItemsCount = setsEligible * discount.freeQuantity;

  if (freeItemsCount === 0) {
    return { savings: 0, freeItems: [], discountedItems: [] };
  }

  // Sort items by price (LOWEST first) to give away the CHEAPEST items for free
  const sortedItems = [...applicableItems].sort((a, b) => {
    const priceA = getItemPrice(a.product, a.selectedSize);
    const priceB = getItemPrice(b.product, b.selectedSize);
    return priceA - priceB; // Lowest price first (cheapest items free)
  });

  let remainingFreeItems = freeItemsCount;
  const freeItems = [];
  const discountedItems = [];

  // Distribute free items (starting with cheapest)
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

  // Add remaining items that are not free
  for (const item of applicableItems) {
    const existingDiscountedItem = discountedItems.find(di => di.key === item.key);
    if (!existingDiscountedItem) {
      // This item has no free quantity, all paid
      discountedItems.push({
        ...item,
        originalQuantity: item.quantity,
        paidQuantity: item.quantity,
        freeQuantity: 0
      });
    }
  }

  const totalSavings = freeItems.reduce((sum, item) => sum + item.savings, 0);

  console.log(`💰 Discount calculation for "${discount.name}":`);
  console.log(`   Total applicable items: ${totalQuantity}`);
  console.log(`   Discount requirement: Buy ${discount.buyQuantity} Get ${discount.freeQuantity} Free (needs ${totalRequiredItems} total items)`);
  console.log(`   Sets eligible: ${setsEligible}`);
  console.log(`   Free items: ${freeItemsCount} (cheapest items)`);
  console.log(`   Total savings: £E${totalSavings.toFixed(2)}`);

  return {
    savings: totalSavings,
    freeItems,
    discountedItems,
    discountInfo: {
      type: discount.type,
      buyQuantity: discount.buyQuantity,
      freeQuantity: discount.freeQuantity,
      setsEligible,
      totalFreeItems: freeItemsCount,
      totalApplicableItems: totalQuantity
    }
  };
};

/**
 * Compare two discounts to determine which is better
 * Priority: 1. Higher savings, 2. More free items, 3. Higher buy quantity requirement
 */
const compareBestDiscount = (discountA, discountB) => {
  // Priority 1: Higher savings (most important)
  if (discountA.savings !== discountB.savings) {
    return discountB.savings - discountA.savings; // Higher savings wins
  }

  // Priority 2: More free items
  const freeItemsA = discountA.discountInfo?.totalFreeItems || 0;
  const freeItemsB = discountB.discountInfo?.totalFreeItems || 0;
  if (freeItemsA !== freeItemsB) {
    return freeItemsB - freeItemsA; // More free items wins
  }

  // Priority 3: Higher buy quantity requirement (better for business)
  const buyQuantityA = discountA.discount?.buyQuantity || 0;
  const buyQuantityB = discountB.discount?.buyQuantity || 0;
  return buyQuantityB - buyQuantityA; // Higher buy quantity wins
};

/**
 * Calculate the best single discount for cart items (only one discount applies at a time)
 */
export const calculateCartDiscounts = (cartItems, discounts, getItemPrice) => {
  const eligibleDiscounts = [];

  // Calculate all eligible discounts
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

    // Only consider discounts that actually provide savings
    if (discountResult.savings > 0) {
      eligibleDiscounts.push({
        discount,
        ...discountResult
      });
    }
  }

  // If no eligible discounts, return empty result
  if (eligibleDiscounts.length === 0) {
    return {
      totalSavings: 0,
      appliedDiscounts: [],
      freeItems: [],
      discountedItems: []
    };
  }

  // Find the best discount using comparison function
  const bestDiscount = eligibleDiscounts.reduce((best, current) => {
    return compareBestDiscount(best, current) > 0 ? current : best;
  });

  // Log discount selection details for debugging
  if (eligibleDiscounts.length > 1) {
    console.log(`🎯 Multiple discounts available (${eligibleDiscounts.length}), selecting best one:`);
    eligibleDiscounts.forEach(discount => {
      console.log(`   - ${discount.discount.name}: £E${discount.savings.toFixed(2)} savings, ${discount.discountInfo?.totalFreeItems || 0} free items`);
    });
    console.log(`🎁 Selected: ${bestDiscount.discount.name} (£E${bestDiscount.savings.toFixed(2)} savings)`);
  } else {
    console.log(`🎁 Applied discount: ${bestDiscount.discount.name} (Savings: £E${bestDiscount.savings.toFixed(2)})`);
  }

  // Return only the best discount
  return {
    totalSavings: bestDiscount.savings,
    appliedDiscounts: [bestDiscount],
    freeItems: bestDiscount.freeItems,
    discountedItems: bestDiscount.discountedItems
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
 * Get all potential discounts and their eligibility status (for display purposes)
 */
export const getAllDiscountEligibility = (cartItems, discounts, getItemPrice) => {
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
        const isEligible = totalQuantity >= discount.buyQuantity;

        // Calculate potential savings if eligible
        let potentialSavings = 0;
        if (isEligible) {
          const discountResult = calculateBuyXGetYDiscount(cartItems, discount, getItemPrice);
          potentialSavings = discountResult.savings;
        }

        eligibility.push({
          discount,
          isEligible,
          itemsNeeded: Math.max(0, needed),
          currentQuantity: totalQuantity,
          potentialSavings,
          description: formatDiscountDescription(discount)
        });
        break;
    }
  }

  // Sort by potential savings (highest first) to show best discounts first
  return eligibility.sort((a, b) => b.potentialSavings - a.potentialSavings);
};

/**
 * Check if cart qualifies for any discounts (legacy function for backward compatibility)
 */
export const getCartDiscountEligibility = (cartItems, discounts) => {
  return getAllDiscountEligibility(cartItems, discounts, () => 0).map(item => ({
    discount: item.discount,
    isEligible: item.isEligible,
    itemsNeeded: item.itemsNeeded,
    currentQuantity: item.currentQuantity,
    description: item.description
  }));
};
