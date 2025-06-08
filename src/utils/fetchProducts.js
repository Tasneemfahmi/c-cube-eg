import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase.js';

/**
 * Flexible product fetching function that handles different Firestore structures:
 * 1. Individual documents as products (products/crob01, products/crob02)
 * 2. Array of products in a document (products/list -> {products: [...], productList: [...]})
 * 3. Mixed structures
 */
export const fetchAllProducts = async () => {
  try {
    console.log('🔍 Fetching products with flexible structure detection...');
    
    const querySnapshot = await getDocs(collection(db, "products"));
    const allProducts = [];
    
    console.log(`📦 Found ${querySnapshot.size} documents in products collection`);
    
    querySnapshot.forEach((doc) => {
      const docData = doc.data();
      const docId = doc.id;
      
      console.log(`📄 Processing document: ${docId}`);
      console.log(`📄 Document data:`, docData);
      
      // Strategy 1: Check if document contains an array of products
      if (docData.products && Array.isArray(docData.products)) {
        console.log(`📦 Found 'products' array with ${docData.products.length} items in document ${docId}`);
        docData.products.forEach((product, index) => {
          const productWithId = {
            ...product,
            // Use product.id if it exists, otherwise generate one
            id: product.id || `${docId}_product_${index}`,
            sourceDocument: docId,
            sourceIndex: index
          };
          console.log(`📦 Adding product from array:`, productWithId);
          allProducts.push(productWithId);
        });
      }
      // Strategy 2: Check if document contains a productList array
      else if (docData.productList && Array.isArray(docData.productList)) {
        console.log(`📦 Found 'productList' array with ${docData.productList.length} items in document ${docId}`);
        docData.productList.forEach((product, index) => {
          const productWithId = {
            ...product,
            id: product.id || `${docId}_productList_${index}`,
            sourceDocument: docId,
            sourceIndex: index
          };
          console.log(`📦 Adding product from productList:`, productWithId);
          allProducts.push(productWithId);
        });
      }
      // Strategy 3: Check if document contains an items array
      else if (docData.items && Array.isArray(docData.items)) {
        console.log(`📦 Found 'items' array with ${docData.items.length} items in document ${docId}`);
        docData.items.forEach((product, index) => {
          const productWithId = {
            ...product,
            id: product.id || `${docId}_item_${index}`,
            sourceDocument: docId,
            sourceIndex: index
          };
          console.log(`📦 Adding product from items:`, productWithId);
          allProducts.push(productWithId);
        });
      }
      // Strategy 4: Treat the entire document as a single product
      else if (docData.name || docData.title || docData.productName) {
        console.log(`📦 Treating document ${docId} as individual product`);
        const product = {
          ...docData,
          id: docId,
          sourceDocument: docId
        };
        console.log(`📦 Adding individual product:`, product);
        allProducts.push(product);
      }
      // Strategy 5: Check for any array fields that might contain products
      else {
        console.log(`📄 Checking for any array fields in document ${docId}`);
        Object.keys(docData).forEach(key => {
          if (Array.isArray(docData[key]) && docData[key].length > 0) {
            // Check if the first item looks like a product
            const firstItem = docData[key][0];
            if (typeof firstItem === 'object' && (firstItem.name || firstItem.title || firstItem.productName)) {
              console.log(`📦 Found potential products array in field '${key}' with ${docData[key].length} items`);
              docData[key].forEach((product, index) => {
                const productWithId = {
                  ...product,
                  id: product.id || `${docId}_${key}_${index}`,
                  sourceDocument: docId,
                  sourceField: key,
                  sourceIndex: index
                };
                console.log(`📦 Adding product from field ${key}:`, productWithId);
                allProducts.push(productWithId);
              });
            }
          }
        });
      }
    });
    
    console.log(`✅ Successfully extracted ${allProducts.length} products total`);
    console.log('📦 Final products list:', allProducts);
    
    return {
      success: true,
      products: allProducts,
      totalDocuments: querySnapshot.size,
      totalProducts: allProducts.length
    };
    
  } catch (error) {
    console.error('❌ Error fetching products:', error);
    return {
      success: false,
      error: error.message,
      products: []
    };
  }
};

/**
 * Simple product fetching function (original approach)
 */
export const fetchProductsSimple = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, "products"));
    const products = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    
    return {
      success: true,
      products: products
    };
  } catch (error) {
    console.error('❌ Error fetching products (simple):', error);
    return {
      success: false,
      error: error.message,
      products: []
    };
  }
};
