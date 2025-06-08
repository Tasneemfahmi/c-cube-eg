import { collection, getDocs, addDoc } from 'firebase/firestore';
import { db } from '../firebase.js';

// Test Firestore connection
export const testFirestoreConnection = async () => {
  try {
    console.log('Testing Firestore connection...');
    
    // Try to read from a collection
    const testCollection = collection(db, 'test');
    const snapshot = await getDocs(testCollection);
    
    console.log('✅ Firestore connection successful!');
    console.log(`Found ${snapshot.size} documents in test collection`);
    
    return { success: true, message: 'Firestore connection successful' };
  } catch (error) {
    console.error('❌ Firestore connection failed:', error);
    return { success: false, message: error.message };
  }
};

// Test adding a document
export const testAddDocument = async () => {
  try {
    console.log('Testing document creation...');
    
    const testDoc = {
      message: 'Hello from C-Cube app!',
      timestamp: new Date(),
      test: true
    };
    
    const docRef = await addDoc(collection(db, 'test'), testDoc);
    console.log('✅ Document created with ID:', docRef.id);
    
    return { success: true, message: `Document created with ID: ${docRef.id}` };
  } catch (error) {
    console.error('❌ Document creation failed:', error);
    return { success: false, message: error.message };
  }
};
