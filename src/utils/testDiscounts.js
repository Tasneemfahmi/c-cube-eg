import { calculateCartDiscounts, getAllDiscountEligibility } from './discountUtils';

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
  const eligibility = getAllDiscountEligibility(cartItems, discounts, getItemPrice);
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

/**
 * Test the new single-discount behavior with multiple competing discounts
 */
export const testSingleDiscountBehavior = () => {
  console.log('🧪 Testing Single Discount Behavior...');

  // Sample products with different prices
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
      price: '150',
      category: 'Crochet > Bags',
      images: ['test.jpg']
    },
    {
      id: 'conc01',
      name: 'Concrete Item 1',
      price: '200',
      category: 'Concrete',
      images: ['test.jpg']
    }
  ];

  // Cart with items eligible for multiple discounts
  const cartItems = [
    {
      key: 'crob01-Standard-Default',
      product: sampleProducts[0],
      quantity: 3,
      selectedSize: 'Standard',
      selectedColor: 'Default'
    },
    {
      key: 'crob02-Standard-Default',
      product: sampleProducts[1],
      quantity: 1,
      selectedSize: 'Standard',
      selectedColor: 'Default'
    },
    {
      key: 'conc01-Standard-Default',
      product: sampleProducts[2],
      quantity: 2,
      selectedSize: 'Standard',
      selectedColor: 'Default'
    }
  ];

  // Multiple competing discounts
  const discounts = [
    {
      id: 'crochet-discount',
      active: true,
      applicableProducts: ['crob01', 'crob02'],
      buyQuantity: 3,
      freeQuantity: 1,
      type: 'buyXgetY',
      name: 'Buy 3 Get 1 Free - Crochet Bags'
    },
    {
      id: 'concrete-discount',
      active: true,
      applicableProducts: ['conc01'],
      buyQuantity: 2,
      freeQuantity: 1,
      type: 'buyXgetY',
      name: 'Buy 2 Get 1 Free - Concrete Items'
    }
  ];

  const getItemPrice = (product, selectedSize) => {
    return parseFloat(product.price) || 0;
  };

  console.log('📦 Cart Items:', cartItems.map(item => `${item.product.name} x${item.quantity} (£E${getItemPrice(item.product)})`));
  console.log('🎁 Available Discounts:', discounts.map(d => d.name));

  // Test discount calculation (should only apply the best one)
  const discountResult = calculateCartDiscounts(cartItems, discounts, getItemPrice);
  console.log('💰 Best Discount Applied:', discountResult);

  // Calculate what each discount would save individually
  console.log('\n🔍 Individual Discount Analysis:');
  discounts.forEach(discount => {
    const individualResult = calculateCartDiscounts(cartItems, [discount], getItemPrice);
    console.log(`   ${discount.name}: £E${individualResult.totalSavings.toFixed(2)} savings`);
  });

  // Test eligibility for all discounts
  const eligibility = getAllDiscountEligibility(cartItems, discounts, getItemPrice);
  console.log('\n✅ All Discount Eligibility:', eligibility);

  return {
    success: true,
    message: 'Single discount behavior test completed successfully!',
    results: {
      bestDiscount: discountResult.appliedDiscounts[0]?.discount?.name || 'None',
      totalSavings: discountResult.totalSavings,
      eligibility
    }
  };
};

/**
 * Test the specific discount logic with your example:
 * - Buy 3 Get 2 Free for cand01
 * - 5 items in cart (all cand01)
 * - 2 cheapest items should be free
 */
export const testSpecificDiscountLogic = () => {
  console.log('🧪 Testing Specific Discount Logic (Buy 3 Get 2 Free)...');

  // Sample candle products with different prices
  const candleProduct = {
    id: 'cand01',
    name: 'Scented Candle',
    price: '100', // £E100 each
    category: 'Candles',
    images: ['test.jpg']
  };

  // Cart with 5 candles (all same product, different options = different prices)
  const cartItems = [
    {
      key: 'cand01-Small-Red-Vanilla',
      product: { ...candleProduct, price: '80' }, // Cheapest
      quantity: 1,
      selectedSize: 'Small',
      selectedColor: 'Red',
      selectedScent: 'Vanilla'
    },
    {
      key: 'cand01-Medium-Blue-Lavender',
      product: { ...candleProduct, price: '90' }, // Second cheapest
      quantity: 1,
      selectedSize: 'Medium',
      selectedColor: 'Blue',
      selectedScent: 'Lavender'
    },
    {
      key: 'cand01-Large-Green-Rose',
      product: { ...candleProduct, price: '100' },
      quantity: 1,
      selectedSize: 'Large',
      selectedColor: 'Green',
      selectedScent: 'Rose'
    },
    {
      key: 'cand01-Large-White-Vanilla',
      product: { ...candleProduct, price: '110' },
      quantity: 1,
      selectedSize: 'Large',
      selectedColor: 'White',
      selectedScent: 'Vanilla'
    },
    {
      key: 'cand01-XL-Gold-Premium',
      product: { ...candleProduct, price: '120' }, // Most expensive
      quantity: 1,
      selectedSize: 'XL',
      selectedColor: 'Gold',
      selectedScent: 'Premium'
    }
  ];

  // Discount: Buy 3 Get 2 Free for cand01
  const discount = {
    id: 'candle-discount',
    active: true,
    applicableProducts: ['cand01'],
    buyQuantity: 3,
    freeQuantity: 2,
    type: 'buyXgetY',
    name: 'Buy 3 Get 2 Free - Candles'
  };

  const getItemPrice = (product, selectedSize) => {
    return parseFloat(product.price) || 0;
  };

  console.log('📦 Cart Items:');
  cartItems.forEach(item => {
    console.log(`   - ${item.selectedSize} ${item.selectedColor} ${item.selectedScent}: £E${getItemPrice(item.product)}`);
  });

  console.log(`\n🎁 Discount: ${discount.name}`);
  console.log(`   Buy ${discount.buyQuantity}, Get ${discount.freeQuantity} Free`);

  // Test discount calculation
  const discountResult = calculateCartDiscounts(cartItems, [discount], getItemPrice);

  console.log('\n💰 Discount Result:');
  console.log(`   Total savings: £E${discountResult.totalSavings.toFixed(2)}`);
  console.log(`   Free items: ${discountResult.freeItems.length}`);

  if (discountResult.freeItems.length > 0) {
    console.log('\n🎁 Free Items (should be the 2 cheapest):');
    discountResult.freeItems.forEach(item => {
      console.log(`   - ${item.selectedSize} ${item.selectedColor} ${item.selectedScent}: £E${getItemPrice(item.product)} (FREE)`);
    });
  }

  console.log('\n💳 Items to Pay For:');
  discountResult.discountedItems.forEach(item => {
    if (item.paidQuantity > 0) {
      console.log(`   - ${item.selectedSize} ${item.selectedColor} ${item.selectedScent}: £E${getItemPrice(item.product)} x${item.paidQuantity}`);
    }
  });

  // Calculate expected result
  const totalBeforeDiscount = cartItems.reduce((sum, item) => sum + getItemPrice(item.product), 0);
  const totalAfterDiscount = totalBeforeDiscount - discountResult.totalSavings;

  console.log('\n📊 Summary:');
  console.log(`   Total before discount: £E${totalBeforeDiscount.toFixed(2)}`);
  console.log(`   Discount savings: £E${discountResult.totalSavings.toFixed(2)}`);
  console.log(`   Total after discount: £E${totalAfterDiscount.toFixed(2)}`);
  console.log(`   Expected: 3 paid items (£E100 + £E110 + £E120 = £E330), 2 free items (£E80 + £E90 = £E170 saved)`);

  return {
    success: true,
    message: 'Specific discount logic test completed!',
    results: {
      totalSavings: discountResult.totalSavings,
      freeItems: discountResult.freeItems,
      expectedSavings: 170, // £E80 + £E90
      isCorrect: discountResult.totalSavings === 170
    }
  };
};

/**
 * Test the correct discount selection based on cart quantity
 * This tests your specific issue: 3 items should get Buy2Get1, not Buy3Get2
 */
export const testCorrectDiscountSelection = () => {
  console.log('🧪 Testing Correct Discount Selection Based on Cart Quantity...');

  // Sample product
  const product = {
    id: 'cand01',
    name: 'Scented Candle',
    price: '100',
    category: 'Candles'
  };

  // Two competing discounts
  const discounts = [
    {
      id: 'buy2get1',
      active: true,
      applicableProducts: ['cand01'],
      buyQuantity: 2,
      freeQuantity: 1,
      type: 'buyXgetY',
      name: 'Buy 2 Get 1 Free - Candles'
    },
    {
      id: 'buy3get2',
      active: true,
      applicableProducts: ['cand01'],
      buyQuantity: 3,
      freeQuantity: 2,
      type: 'buyXgetY',
      name: 'Buy 3 Get 2 Free - Candles'
    }
  ];

  const getItemPrice = (product, selectedSize) => {
    return parseFloat(product.price) || 0;
  };

  // Test Case 1: 3 items in cart
  console.log('\n📦 Test Case 1: 3 items in cart');
  const cartWith3Items = [
    { key: 'cand01-1', product, quantity: 1, selectedSize: 'Standard', selectedColor: 'Red', selectedScent: 'Vanilla' },
    { key: 'cand01-2', product, quantity: 1, selectedSize: 'Standard', selectedColor: 'Blue', selectedScent: 'Lavender' },
    { key: 'cand01-3', product, quantity: 1, selectedSize: 'Standard', selectedColor: 'Green', selectedScent: 'Rose' }
  ];

  console.log('Available discounts:');
  console.log('  - Buy 2 Get 1 Free (needs 3 total items: 2 buy + 1 free)');
  console.log('  - Buy 3 Get 2 Free (needs 5 total items: 3 buy + 2 free)');
  console.log('Cart has 3 items, so only Buy 2 Get 1 Free should apply');

  const result3Items = calculateCartDiscounts(cartWith3Items, discounts, getItemPrice);
  console.log(`\nResult: Applied "${result3Items.appliedDiscounts[0]?.discount?.name || 'None'}"`);
  console.log(`Savings: £E${result3Items.totalSavings}`);

  // Test Case 2: 5 items in cart
  console.log('\n📦 Test Case 2: 5 items in cart');
  const cartWith5Items = [
    ...cartWith3Items,
    { key: 'cand01-4', product, quantity: 1, selectedSize: 'Standard', selectedColor: 'White', selectedScent: 'Mint' },
    { key: 'cand01-5', product, quantity: 1, selectedSize: 'Standard', selectedColor: 'Black', selectedScent: 'Vanilla' }
  ];

  console.log('Cart has 5 items, so both discounts are eligible:');
  console.log('  - Buy 2 Get 1 Free: saves £E100 (1 free item)');
  console.log('  - Buy 3 Get 2 Free: saves £E200 (2 free items)');
  console.log('Should select Buy 3 Get 2 Free (higher savings)');

  const result5Items = calculateCartDiscounts(cartWith5Items, discounts, getItemPrice);
  console.log(`\nResult: Applied "${result5Items.appliedDiscounts[0]?.discount?.name || 'None'}"`);
  console.log(`Savings: £E${result5Items.totalSavings}`);

  // Test Case 3: 2 items in cart
  console.log('\n📦 Test Case 3: 2 items in cart');
  const cartWith2Items = cartWith3Items.slice(0, 2);

  console.log('Cart has 2 items, so neither discount should apply:');
  console.log('  - Buy 2 Get 1 Free needs 3 items (2 buy + 1 free)');
  console.log('  - Buy 3 Get 2 Free needs 5 items (3 buy + 2 free)');

  const result2Items = calculateCartDiscounts(cartWith2Items, discounts, getItemPrice);
  console.log(`\nResult: Applied "${result2Items.appliedDiscounts[0]?.discount?.name || 'None'}"`);
  console.log(`Savings: £E${result2Items.totalSavings}`);

  return {
    success: true,
    message: 'Correct discount selection test completed!',
    results: {
      with3Items: {
        appliedDiscount: result3Items.appliedDiscounts[0]?.discount?.name || 'None',
        savings: result3Items.totalSavings,
        expected: 'Buy 2 Get 1 Free',
        correct: result3Items.appliedDiscounts[0]?.discount?.name === 'Buy 2 Get 1 Free - Candles'
      },
      with5Items: {
        appliedDiscount: result5Items.appliedDiscounts[0]?.discount?.name || 'None',
        savings: result5Items.totalSavings,
        expected: 'Buy 3 Get 2 Free',
        correct: result5Items.appliedDiscounts[0]?.discount?.name === 'Buy 3 Get 2 Free - Candles'
      },
      with2Items: {
        appliedDiscount: result2Items.appliedDiscounts[0]?.discount?.name || 'None',
        savings: result2Items.totalSavings,
        expected: 'None',
        correct: result2Items.appliedDiscounts.length === 0
      }
    }
  };
};
