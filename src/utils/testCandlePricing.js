/**
 * Test candle pricing specifically to debug the zero price issue
 */

// Mock the cart context getItemPrice function
const getItemPrice = (product, selectedSize) => {
  console.log('🔍 Testing getItemPrice with:', { 
    productId: product.id, 
    productPrice: product.price, 
    priceType: typeof product.price,
    selectedSize 
  });

  // Handle size-based pricing (price as map object)
  if (product.price && typeof product.price === 'object') {
    console.log('   📊 Price is object:', product.price);
    if (selectedSize && product.price[selectedSize.toLowerCase()]) {
      const price = parseFloat(product.price[selectedSize.toLowerCase()]);
      console.log(`   ✅ Found size-based price for ${selectedSize}: ${price}`);
      return price;
    }
    // If no size selected or size not found, return first available price
    const prices = Object.values(product.price).map(p => parseFloat(p)).filter(p => !isNaN(p));
    const firstPrice = prices.length > 0 ? prices[0] : 0;
    console.log(`   ⚠️ No size match, using first price: ${firstPrice}`);
    return firstPrice;
  }
  
  // Handle legacy pricing object
  if (product.pricing && typeof product.pricing === 'object') {
    console.log('   📊 Using legacy pricing object:', product.pricing);
    const prices = Object.values(product.pricing).map(p => parseFloat(p)).filter(p => !isNaN(p));
    const firstPrice = prices.length > 0 ? prices[0] : 0;
    console.log(`   ✅ Legacy pricing result: ${firstPrice}`);
    return firstPrice;
  }
  
  // Handle simple price string
  if (typeof product.price === 'string') {
    const price = parseFloat(product.price) || 0;
    console.log(`   ✅ String price parsed: ${price}`);
    return price;
  }
  
  // Handle number price
  if (typeof product.price === 'number') {
    console.log(`   ✅ Number price: ${product.price}`);
    return product.price;
  }
  
  console.log('   ❌ No valid price found, returning 0');
  return 0;
};

/**
 * Test different candle product structures
 */
export const testCandlePricing = () => {
  console.log('🕯️ Testing Candle Pricing Logic...\n');

  // Test Case 1: Simple string price (like our updated sample)
  const candle1 = {
    id: 'cand01',
    name: 'Lavender Soy Candle',
    price: '185', // String price
    category: 'Candles > Scented',
    scent: ['Lavender', 'Vanilla Lavender', 'Pure Lavender']
  };

  console.log('Test 1: Simple string price');
  const price1 = getItemPrice(candle1, 'Standard');
  console.log(`Result: £E${price1}\n`);

  // Test Case 2: Size-based pricing
  const candle2 = {
    id: 'cand02',
    name: 'Multi-Size Scented Candle',
    price: {
      "small": 150,
      "medium": 220,
      "large": 300
    },
    category: 'Candles > Scented',
    scent: ['Rose Garden', 'Ocean Breeze']
  };

  console.log('Test 2: Size-based pricing');
  const price2a = getItemPrice(candle2, 'Small');
  const price2b = getItemPrice(candle2, 'Medium');
  const price2c = getItemPrice(candle2, 'Large');
  const price2d = getItemPrice(candle2, null); // No size selected
  console.log(`Results: Small=£E${price2a}, Medium=£E${price2b}, Large=£E${price2c}, No size=£E${price2d}\n`);

  // Test Case 3: Invalid/missing price
  const candle3 = {
    id: 'cand03',
    name: 'Broken Candle',
    // No price field
    category: 'Candles > Scented'
  };

  console.log('Test 3: Missing price');
  const price3 = getItemPrice(candle3, 'Standard');
  console.log(`Result: £E${price3}\n`);

  // Test Case 4: Zero/empty price
  const candle4 = {
    id: 'cand04',
    name: 'Zero Price Candle',
    price: '', // Empty string
    category: 'Candles > Scented'
  };

  console.log('Test 4: Empty price string');
  const price4 = getItemPrice(candle4, 'Standard');
  console.log(`Result: £E${price4}\n`);

  // Test Case 5: Null price
  const candle5 = {
    id: 'cand05',
    name: 'Null Price Candle',
    price: null,
    category: 'Candles > Scented'
  };

  console.log('Test 5: Null price');
  const price5 = getItemPrice(candle5, 'Standard');
  console.log(`Result: £E${price5}\n`);

  return {
    success: true,
    message: 'Candle pricing tests completed!',
    results: {
      stringPrice: price1,
      sizeBased: { small: price2a, medium: price2b, large: price2c, noSize: price2d },
      missingPrice: price3,
      emptyPrice: price4,
      nullPrice: price5
    }
  };
};

/**
 * Test cart item creation for candles
 */
export const testCandleCartItem = () => {
  console.log('🛒 Testing Candle Cart Item Creation...\n');

  const candleProduct = {
    id: 'cand01',
    name: 'Lavender Soy Candle',
    price: '185',
    colors: ['Lavender Purple', 'Natural White'],
    scent: ['Lavender', 'Vanilla Lavender', 'Pure Lavender'],
    sizes: 'Standard',
    category: 'Candles > Scented'
  };

  // Simulate cart item creation
  const selectedSize = 'Standard';
  const selectedColor = 'Lavender Purple';
  const selectedScent = 'Lavender';
  const quantity = 1;

  const cartItem = {
    key: `${candleProduct.id}-${selectedSize}-${selectedColor}-${selectedScent}`,
    product: candleProduct,
    quantity,
    selectedSize,
    selectedColor,
    selectedScent,
    addedAt: new Date().toISOString()
  };

  console.log('Cart Item Created:', cartItem);
  
  const itemPrice = getItemPrice(cartItem.product, cartItem.selectedSize);
  const totalPrice = itemPrice * cartItem.quantity;

  console.log(`\nPricing Calculation:`);
  console.log(`  Item price: £E${itemPrice}`);
  console.log(`  Quantity: ${cartItem.quantity}`);
  console.log(`  Total: £E${totalPrice}`);

  return {
    success: true,
    cartItem,
    itemPrice,
    totalPrice
  };
};

// Export for testing
export default { testCandlePricing, testCandleCartItem };
