import { calculateCartDiscounts, getCartDiscountEligibility } from './discountUtils';

/**
 * Test the discount system with sample data
 */
export const testDiscountSystem = () => {
  console.log('🧪 Testing Discount System...');

  // Sample products
  const sampleProducts = [
    {
      id: 'crob01',
      name: 'Crochet Bag 1',
      price: '100',
      category: 'Crochet > Bags',
      images: ['test.jpg']
    },
    {
      id: 'crob02',
      name: 'Crochet Bag 2',
      price: { small: 150, large: 200 },
      sizes: ['Small', 'Large'],
      category: 'Crochet > Bags',
      images: ['test.jpg']
    }
  ];

  // Sample cart items
  const cartItems = [
    {
      key: 'crob01-Standard-Default',
      product: sampleProducts[0],
      quantity: 3,
      selectedSize: 'Standard',
      selectedColor: 'Default'
    },
    {
      key: 'crob02-Small-Default',
      product: sampleProducts[1],
      quantity: 1,
      selectedSize: 'Small',
      selectedColor: 'Default'
    }
  ];

  // Sample discount
  const discounts = [
    {
      id: 'test-discount',
      active: true,
      applicableProducts: ['crob01', 'crob02'],
      buyQuantity: 3,
      freeQuantity: 1,
      type: 'buyXgetY',
      name: 'Buy 3 Get 1 Free - Crochet Bags'
    }
  ];

  // Mock getItemPrice function
  const getItemPrice = (product, selectedSize) => {
    if (typeof product.price === 'string') {
      return parseFloat(product.price);
    }
    if (typeof product.price === 'object' && selectedSize) {
      return parseFloat(product.price[selectedSize.toLowerCase()]) || 0;
    }
    return 0;
  };

  console.log('📦 Cart Items:', cartItems);
  console.log('🎁 Available Discounts:', discounts);

  // Test discount calculation
  const discountResult = calculateCartDiscounts(cartItems, discounts, getItemPrice);
  console.log('💰 Discount Calculation Result:', discountResult);

  // Test eligibility
  const eligibility = getCartDiscountEligibility(cartItems, discounts);
  console.log('✅ Discount Eligibility:', eligibility);

  // Calculate totals
  const subtotalWithoutDiscounts = cartItems.reduce((total, item) => {
    const itemPrice = getItemPrice(item.product, item.selectedSize);
    return total + (itemPrice * item.quantity);
  }, 0);

  const subtotalWithDiscounts = subtotalWithoutDiscounts - discountResult.totalSavings;
  const tax = subtotalWithDiscounts * 0.14;
  const total = subtotalWithDiscounts + tax;

  console.log('📊 Summary:');
  console.log(`   Subtotal (before discounts): £E${subtotalWithoutDiscounts.toFixed(2)}`);
  console.log(`   Discount Savings: £E${discountResult.totalSavings.toFixed(2)}`);
  console.log(`   Subtotal (after discounts): £E${subtotalWithDiscounts.toFixed(2)}`);
  console.log(`   Tax (14%): £E${tax.toFixed(2)}`);
  console.log(`   Total: £E${total.toFixed(2)}`);

  if (discountResult.freeItems.length > 0) {
    console.log('🎁 Free Items:');
    discountResult.freeItems.forEach(item => {
      console.log(`   - ${item.product.name} x${item.freeQuantity} (saved £E${item.savings.toFixed(2)})`);
    });
  }

  return {
    success: true,
    message: 'Discount system test completed successfully!',
    results: {
      discountResult,
      eligibility,
      totals: {
        subtotalWithoutDiscounts,
        discountSavings: discountResult.totalSavings,
        subtotalWithDiscounts,
        tax,
        total
      }
    }
  };
};

/**
 * Test discount system with edge cases
 */
export const testDiscountEdgeCases = () => {
  console.log('🧪 Testing Discount Edge Cases...');

  const getItemPrice = (product, selectedSize) => {
    if (typeof product.price === 'string') {
      return parseFloat(product.price);
    }
    if (typeof product.price === 'object' && selectedSize) {
      return parseFloat(product.price[selectedSize.toLowerCase()]) || 0;
    }
    return 0;
  };

  // Test 1: Empty cart
  console.log('Test 1: Empty cart');
  const emptyResult = calculateCartDiscounts([], [{ active: true, applicableProducts: ['test'], buyQuantity: 2, freeQuantity: 1, type: 'buyXgetY' }], getItemPrice);
  console.log('Result:', emptyResult);

  // Test 2: No applicable products
  console.log('Test 2: No applicable products');
  const noApplicableResult = calculateCartDiscounts(
    [{ product: { id: 'other', price: '100' }, quantity: 5 }],
    [{ active: true, applicableProducts: ['test'], buyQuantity: 2, freeQuantity: 1, type: 'buyXgetY' }],
    getItemPrice
  );
  console.log('Result:', noApplicableResult);

  // Test 3: Insufficient quantity
  console.log('Test 3: Insufficient quantity');
  const insufficientResult = calculateCartDiscounts(
    [{ product: { id: 'test', price: '100' }, quantity: 1 }],
    [{ active: true, applicableProducts: ['test'], buyQuantity: 3, freeQuantity: 1, type: 'buyXgetY' }],
    getItemPrice
  );
  console.log('Result:', insufficientResult);

  return {
    success: true,
    message: 'Edge case tests completed successfully!'
  };
};
