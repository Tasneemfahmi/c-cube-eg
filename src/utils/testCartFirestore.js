import { db } from '../firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';

// Test function to verify Firestore cart operations
export const testCartFirestore = async () => {
  const testDeviceId = 'test_device_' + Date.now();
  
  console.log('🧪 Testing Firestore cart operations...');
  
  try {
    // Test data
    const testCart = {
      items: [
        {
          key: 'test-product-1-default-default',
          product: {
            id: 'test-product-1',
            name: 'Test Product',
            price: '25.00',
            category: 'Test',
            images: ['https://example.com/test.jpg']
          },
          quantity: 2,
          selectedSize: null,
          selectedColor: null,
          addedAt: new Date().toISOString()
        }
      ]
    };

    // Test saving to Firestore
    console.log('📝 Saving test cart to Firestore...');
    const cartRef = doc(db, 'carts', testDeviceId);
    await setDoc(cartRef, {
      items: testCart.items,
      lastUpdated: serverTimestamp(),
      deviceId: testDeviceId,
      itemCount: testCart.items.reduce((total, item) => total + item.quantity, 0)
    });
    console.log('✅ Cart saved successfully');

    // Test loading from Firestore
    console.log('📖 Loading test cart from Firestore...');
    const cartSnap = await getDoc(cartRef);
    
    if (cartSnap.exists()) {
      const cartData = cartSnap.data();
      console.log('✅ Cart loaded successfully:', cartData);
      
      // Verify data integrity
      if (cartData.items.length === testCart.items.length) {
        console.log('✅ Data integrity check passed');
        return { success: true, message: 'Firestore cart operations working correctly' };
      } else {
        console.log('❌ Data integrity check failed');
        return { success: false, message: 'Data integrity check failed' };
      }
    } else {
      console.log('❌ Cart not found in Firestore');
      return { success: false, message: 'Cart not found in Firestore' };
    }
    
  } catch (error) {
    console.error('❌ Firestore test failed:', error);
    return { success: false, message: `Firestore test failed: ${error.message}` };
  }
};

// Function to check Firestore connection
export const checkFirestoreConnection = async () => {
  try {
    console.log('🔗 Checking Firestore connection...');
    const testRef = doc(db, 'test', 'connection');
    await setDoc(testRef, { timestamp: serverTimestamp() });
    console.log('✅ Firestore connection successful');
    return { success: true, message: 'Firestore connection successful' };
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return { success: false, message: `Firestore connection failed: ${error.message}` };
  }
};
