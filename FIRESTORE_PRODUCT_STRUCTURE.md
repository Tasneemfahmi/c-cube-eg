# Firestore Product Structure Guide

## Overview
This guide explains how to structure your products in Firestore to support size-based pricing, multiple colors, and image galleries.

## Basic Product Structure

### Simple Product (Fixed Size)
```javascript
{
  id: "crob01",
  name: "Two-Tone Crochet Bag",
  category: "Crochet > Bags",
  description: "Beautiful handcrafted two-tone crochet bag...",
  price: "25.99",
  colors: [
    "Black & White",
    "Black & Beige", 
    "Black & Pink"
  ],
  images: [
    "https://res.cloudinary.com/your-cloud/image1.jpg",
    "https://res.cloudinary.com/your-cloud/image2.jpg"
  ],
  sizes: "Original", // String for single size
  inStock: true,
  featured: true
}
```

### Multi-Size Product with Dynamic Pricing (Your Structure)
```javascript
{
  id: "crob02",
  name: "Pearl Shell Crochet Bag",
  category: "Crochet > Bags",
  description: "Elegant pearl shell crochet bag with beautiful texture...",
  colors: [
    "Beige",
    "White"
  ],
  images: [
    "https://res.cloudinary.com/do0cup3rt/image/upload/v1748792336/Pearl_Shell_Crochet_Bag_oyrwcl.jpg"
  ],
  sizes: ["Small", "Large"], // Array of available sizes
  price: {
    "small": 200,  // Numbers (cents) or strings
    "large": 400
  },
  inStock: true,
  featured: true
}
```

## Field Explanations

### Required Fields
- **id**: Unique product identifier (e.g., "crob01", "crob02")
- **name**: Product display name
- **category**: Product category (supports nested like "Crochet > Bags")
- **description**: Product description
- **price**: Base price as string (e.g., "25.99")
- **inStock**: Boolean indicating availability

### Optional Fields
- **colors**: Array of color combinations (e.g., ["Black & White", "Blue & Pink"])
- **images**: Array of image URLs (first image used as main image)
- **sizes**: String for single size (e.g., "Original", "12oz")
- **sizeOptions**: Array of sizes for multi-size products
- **pricing**: Object mapping sizes to prices for dynamic pricing
- **featured**: Boolean for featured products
- **rating**: Number for star rating (0-5)
- **reviews**: Number of reviews

## Size-Based Pricing Implementation (Your Structure)

### Option 1: Single Size (String)
```javascript
{
  sizes: "Original", // Fixed size
  price: "25.99" // String price for single size
}
```

### Option 2: Multiple Sizes with Same Price
```javascript
{
  sizes: ["Small", "Medium", "Large"], // Array of sizes
  price: "25.99" // String price applies to all sizes
}
```

### Option 3: Multiple Sizes with Different Prices (Your Format)
```javascript
{
  sizes: ["Small", "Large"], // Array of available sizes
  price: {
    "small": 200,    // Lowercase keys, number values
    "large": 400     // Price in cents or dollars
  }
}
```

### Option 4: Legacy Format (Still Supported)
```javascript
{
  sizeOptions: ["Small", "Medium", "Large"],
  pricing: {
    "Small": "20.00",
    "Medium": "25.00",
    "Large": "30.00"
  }
}
```

## How the App Handles Different Structures

### Size Selection UI
- **String sizes**: Shows as disabled button (non-selectable)
- **Array sizeOptions**: Shows as selectable buttons
- **With pricing object**: Shows price next to each size option

### Price Display
- **No pricing object**: Uses base `price` field
- **With pricing object**: Updates price when size is selected
- **Fallback**: Uses base price if size not found in pricing

### Category Filtering
- **Nested categories**: "Crochet > Bags" matches "Crochet" filter
- **ID-based filtering**: Products with ID starting with "cro" match "Crochet" filter
- **Exact matching**: Also supports exact category matches

## Adding Products to Firestore

### Method 1: Using the App
1. Go to `/shop` page
2. Click "Add Sample Products" button
3. Sample products with different structures will be added

### Method 2: Firebase Console
1. Go to Firebase Console → Firestore Database
2. Navigate to `products` collection
3. Add document with the structure above

### Method 3: Programmatically
```javascript
import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase.js';

const product = {
  name: "Your Product Name",
  category: "Crochet > Bags",
  // ... other fields
};

await addDoc(collection(db, "products"), product);
```

## Best Practices

1. **Consistent Pricing**: Always include base `price` even with `pricing` object
2. **Image Quality**: Use high-quality images, first image is the main display
3. **Category Naming**: Use consistent category naming (e.g., "Crochet > Bags")
4. **ID Conventions**: Use meaningful IDs (e.g., "cro" prefix for crochet items)
5. **Color Names**: Use descriptive color combinations (e.g., "Black & White")
6. **Size Naming**: Use clear size names (e.g., "Small", "Medium", "Large")

## Troubleshooting

### Product Not Showing
- Check if `inStock` is true
- Verify category matches filter
- Check price is within filter range
- Ensure required fields are present

### Size Selection Not Working
- Verify `sizeOptions` is an array
- Check `setSelectedSize` function is called correctly
- Ensure pricing object keys match size names exactly

### Price Not Updating
- Check `pricing` object structure
- Verify size names match exactly (case-sensitive)
- Ensure `calculatePrice` function is working
