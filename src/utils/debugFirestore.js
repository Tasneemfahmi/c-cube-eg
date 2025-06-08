import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

// Debug function to check Firestore connection and data
export const debugFirestore = async () => {
  console.log('🔍 Starting Firestore Debug...');
  
  try {
    // Test 1: Check if db is initialized
    console.log('📊 Database instance:', db);
    
    // Test 2: Try to fetch products collection
    console.log('📦 Fetching products collection...');
    const productsRef = collection(db, 'products');
    console.log('📦 Products collection reference:', productsRef);
    
    const querySnapshot = await getDocs(productsRef);
    console.log('📦 Query snapshot:', querySnapshot);
    console.log('📦 Number of documents:', querySnapshot.size);
    
    // Test 3: List all documents and check structure
    const documents = [];
    const products = [];

    querySnapshot.forEach((doc) => {
      console.log('📄 Document ID:', doc.id);
      const docData = doc.data();
      console.log('📄 Document data:', docData);
      console.log('📄 Document data type:', typeof docData);
      console.log('📄 Document keys:', Object.keys(docData));

      documents.push({
        id: doc.id,
        data: docData
      });

      // Check if this document contains an array of products
      if (Array.isArray(docData.products)) {
        console.log('📦 Found products array with', docData.products.length, 'items');
        docData.products.forEach((product, index) => {
          console.log(`📦 Product ${index}:`, product);
          products.push(product);
        });
      } else if (Array.isArray(docData.productList)) {
        console.log('📦 Found productList array with', docData.productList.length, 'items');
        docData.productList.forEach((product, index) => {
          console.log(`📦 Product ${index}:`, product);
          products.push(product);
        });
      } else {
        // Treat the document itself as a product
        console.log('📦 Treating document as individual product');
        products.push({
          id: doc.id,
          ...docData
        });
      }
    });

    console.log('📄 All documents:', documents);
    console.log('📦 All extracted products:', products);
    
    // Test 4: Try to fetch specific documents
    if (products.length === 0) {
      console.log('⚠️ No products found. Checking if crob01 and crob02 exist...');
      
      try {
        const crob01Ref = doc(db, 'products', 'crob01');
        const crob01Snap = await getDoc(crob01Ref);
        console.log('📄 crob01 exists:', crob01Snap.exists());
        if (crob01Snap.exists()) {
          console.log('📄 crob01 data:', crob01Snap.data());
        }
      } catch (err) {
        console.error('❌ Error fetching crob01:', err);
      }
      
      try {
        const crob02Ref = doc(db, 'products', 'crob02');
        const crob02Snap = await getDoc(crob02Ref);
        console.log('📄 crob02 exists:', crob02Snap.exists());
        if (crob02Snap.exists()) {
          console.log('📄 crob02 data:', crob02Snap.data());
        }
      } catch (err) {
        console.error('❌ Error fetching crob02:', err);
      }
    }
    
    return {
      success: true,
      productsCount: querySnapshot.size,
      products: products
    };
    
  } catch (error) {
    console.error('❌ Firestore Debug Error:', error);
    console.error('❌ Error code:', error.code);
    console.error('❌ Error message:', error.message);
    
    return {
      success: false,
      error: error.message,
      errorCode: error.code
    };
  }
};

// Function to check Firebase configuration
export const checkFirebaseConfig = () => {
  console.log('🔧 Checking Firebase configuration...');
  
  try {
    // Check if db is properly initialized
    console.log('🔧 Database app:', db.app);
    console.log('🔧 Database app name:', db.app.name);
    console.log('🔧 Database app options:', db.app.options);
    
    return {
      success: true,
      appName: db.app.name,
      projectId: db.app.options.projectId
    };
  } catch (error) {
    console.error('❌ Firebase config error:', error);
    return {
      success: false,
      error: error.message
    };
  }
};
