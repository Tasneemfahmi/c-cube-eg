# Discount System Implementation

## Overview

This document describes the comprehensive discount system implemented for the C³ Cube e-commerce platform. The system supports various discount types, with the initial implementation focusing on "Buy X Get Y Free" promotions.

**Important**: Only **one discount applies at a time** - the system automatically selects the best discount based on priority criteria.

## Features Implemented

### 1. Core Discount Engine
- **File**: `src/utils/discountUtils.js`
- **Features**:
  - Fetch active discounts from Firestore
  - Calculate "Buy X Get Y Free" discounts
  - Support for multiple discount types (extensible)
  - Intelligent free item distribution (gives away most expensive items first)
  - Discount eligibility checking

### 2. Context Management
- **DiscountContext** (`src/contexts/DiscountContext.jsx`): Manages discount data fetching and caching
- **CartWithDiscountsProvider** (`src/contexts/CartWithDiscountsProvider.jsx`): Integrates cart and discount functionality

### 3. UI Components
- **DiscountBanner** (`src/components/DiscountBanner.jsx`): Shows active promotions
- **DiscountBadge**: Product card overlay for discounted items
- **CartDiscountBanner**: Encourages users to add more items for discounts
- **DiscountSummary** (`src/components/DiscountSummary.jsx`): Shows applied discounts and savings
- **FreeItemsDisplay**: Highlights free items in cart

### 4. Integration Points
- **ShopPage**: Displays discount banners and sample discount management
- **ProductDetailPage**: Shows applicable discounts for specific products
- **CartPage**: Complete discount integration with savings breakdown
- **ProductCard**: Discount badges on applicable products

## Discount Data Structure

### Firestore Collection: `discounts`

```javascript
{
  active: true,                           // Boolean - whether discount is active
  applicableProducts: ["crob01", "crob02"], // Array - product IDs eligible for discount
  buyQuantity: 3,                         // Number - items needed to qualify
  freeQuantity: 1,                        // Number - free items received
  type: "buyXgetY",                       // String - discount type
  name: "Buy 3 Get 1 Free - Crochet Bags", // String - display name
  description: "Buy any 3 crochet bags and get 1 free!" // String - description
}
```

## How It Works

### 1. Single Discount Selection Logic
1. **Evaluate All Discounts**: Calculate potential savings for each active discount
2. **Apply Priority Rules**: Select the best discount based on:
   - **Priority 1**: Higher savings amount (most important)
   - **Priority 2**: More free items
   - **Priority 3**: Higher buy quantity requirement (better for business)
3. **Apply Only Best Discount**: Only the selected discount is applied to the cart

### 2. Discount Calculation Logic (for each discount)
1. **Filter Applicable Items**: Find cart items matching discount's `applicableProducts`
2. **Calculate Eligibility**: Check if total quantity meets `buyQuantity` requirement
3. **Determine Free Items**: Calculate how many free items user gets (`Math.floor(totalQty / buyQuantity) * freeQuantity`)
4. **Optimize Distribution**: Give away **cheapest items** first (business-friendly approach)
5. **Calculate Savings**: Sum up the value of all free items

### 3. Important Discount Rules
- **Total Items Required**: For "Buy X Get Y Free", cart must have at least (X + Y) total items
- **Cheapest Items Free**: The cheapest items are given away for free (not the most expensive)
- **Complete Sets Only**: Partial sets don't qualify for discounts
- **Single Product Focus**: All items must be from the `applicableProducts` list

### 4. Discount Eligibility Examples
- **Buy 2 Get 1 Free**: Requires 3 total items (2 to buy + 1 free)
- **Buy 3 Get 2 Free**: Requires 5 total items (3 to buy + 2 free)
- **Cart with 3 items**: Only "Buy 2 Get 1 Free" applies
- **Cart with 5 items**: Both discounts eligible, system picks the better one

### 2. Price Integration
- Works with existing size-based pricing system
- Supports both simple prices (`"25.99"`) and price maps (`{small: 200, large: 400}`)
- Calculates savings based on actual item prices including size variations

### 3. Cart Integration
- Real-time discount calculation as cart changes
- Automatic recalculation when discounts are updated
- Seamless integration with existing cart expiration and Firestore sync

## Usage Examples

### Adding Sample Discounts
```javascript
import { addSampleDiscounts } from '../utils/sampleProducts.js';

const result = await addSampleDiscounts();
if (result.success) {
  console.log('Discounts added successfully!');
}
```

## Example: Buy 3 Get 2 Free

**Scenario**: Customer has 5 candles in cart with prices: £E80, £E90, £E100, £E110, £E120

**Discount**: Buy 3 Get 2 Free for candles

**Result**:
- **Items to pay for**: £E100, £E110, £E120 (3 most expensive items)
- **Free items**: £E80, £E90 (2 cheapest items)
- **Total savings**: £E170
- **Customer pays**: £E330 instead of £E500

### Testing Discount System
```javascript
import { testDiscountSystem, testSingleDiscountBehavior, testSpecificDiscountLogic } from '../utils/testDiscounts.js';

// Test basic discount functionality
const testResult = testDiscountSystem();
console.log(testResult);

// Test single discount selection with multiple competing discounts
const singleDiscountResult = testSingleDiscountBehavior();
console.log(singleDiscountResult);

// Test specific discount logic (Buy 3 Get 2 Free example)
const specificResult = testSpecificDiscountLogic();
console.log(specificResult);
```

### Using in Components
```jsx
import { useCartWithDiscounts } from '../contexts/CartWithDiscountsProvider';

const MyComponent = () => {
  const { 
    discountData, 
    discountSavings, 
    hasDiscounts,
    subtotalWithDiscounts 
  } = useCartWithDiscounts();

  return (
    <div>
      {hasDiscounts && (
        <p>You saved £E{discountSavings.toFixed(2)}!</p>
      )}
    </div>
  );
};
```

## Sample Data

The system includes sample discounts:

1. **Crochet Bags**: Buy 3 Get 1 Free (applies to crob01, crob02)
2. **Concrete Items**: Buy 2 Get 1 Free (applies to conc01, conc02)

## Future Enhancements

The system is designed to be extensible. Future discount types can be easily added:

### Percentage Discounts
```javascript
{
  type: "percentage",
  discountPercent: 20,
  applicableProducts: ["prod1", "prod2"]
}
```

### Fixed Amount Discounts
```javascript
{
  type: "fixedAmount",
  discountAmount: 50,
  minimumPurchase: 200,
  applicableProducts: ["prod1", "prod2"]
}
```

### Category-Wide Discounts
```javascript
{
  type: "categoryDiscount",
  applicableCategories: ["Crochet", "Candles"],
  discountPercent: 15
}
```

## Testing

### Manual Testing
1. Go to `/shop` page
2. Click "Add Sample Products" (if no products exist)
3. Click "Add Sample Discounts" (if no discounts exist)
4. Add 3+ crochet items to cart
5. Go to `/cart` to see discount applied

### Programmatic Testing
```javascript
import { testDiscountSystem, testDiscountEdgeCases } from '../utils/testDiscounts.js';

// Test normal functionality
testDiscountSystem();

// Test edge cases
testDiscountEdgeCases();
```

## Architecture Benefits

1. **Separation of Concerns**: Discount logic separated from UI components
2. **Reusability**: Discount components can be used across different pages
3. **Extensibility**: Easy to add new discount types
4. **Performance**: Discounts cached in context, recalculated only when needed
5. **User Experience**: Real-time feedback on savings and eligibility

## Files Modified/Created

### New Files
- `src/utils/discountUtils.js`
- `src/contexts/DiscountContext.jsx`
- `src/contexts/CartWithDiscountsProvider.jsx`
- `src/components/DiscountBanner.jsx`
- `src/components/DiscountSummary.jsx`
- `src/utils/testDiscounts.js`

### Modified Files
- `src/App.jsx` - Added discount providers
- `src/pages/ShopPage.jsx` - Added discount banner and sample discount button
- `src/pages/CartPage.jsx` - Integrated discount display and calculations
- `src/pages/ProductDetailPage.jsx` - Added product-specific discount banner
- `src/components/ProductCard.jsx` - Added discount badge
- `src/utils/sampleProducts.js` - Added sample discount data and functions

## Currency Display

All prices and savings are displayed in Egyptian Pounds (£E or ج.م) as per user preference.

## Conclusion

The discount system is now fully integrated and ready for use. It provides a solid foundation for various promotional strategies while maintaining code quality and user experience standards.
