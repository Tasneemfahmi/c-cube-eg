import { db } from '../firebase.js';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';

// Cart expiration time (2 hours in milliseconds)
const CART_EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Clean up expired carts from Firestore
 * This function can be called periodically to remove old cart data
 */
export const cleanupExpiredCarts = async () => {
  try {
    console.log('🧹 Starting cleanup of expired carts...');
    
    const cartsRef = collection(db, 'carts');
    const now = new Date();
    const expirationThreshold = new Date(now.getTime() - CART_EXPIRATION_TIME);
    
    // Query for carts that have expired
    const expiredCartsQuery = query(
      cartsRef,
      where('expiresAt', '<', expirationThreshold.toISOString())
    );
    
    const expiredCartsSnapshot = await getDocs(expiredCartsQuery);
    
    if (expiredCartsSnapshot.empty) {
      console.log('✅ No expired carts found');
      return { success: true, deletedCount: 0, message: 'No expired carts found' };
    }
    
    // Delete expired carts
    const deletePromises = expiredCartsSnapshot.docs.map(async (cartDoc) => {
      await deleteDoc(doc(db, 'carts', cartDoc.id));
      console.log(`🗑️ Deleted expired cart: ${cartDoc.id}`);
    });
    
    await Promise.all(deletePromises);
    
    const deletedCount = expiredCartsSnapshot.size;
    console.log(`✅ Cleanup completed. Deleted ${deletedCount} expired carts`);
    
    return { 
      success: true, 
      deletedCount, 
      message: `Successfully deleted ${deletedCount} expired carts` 
    };
    
  } catch (error) {
    console.error('❌ Error during cart cleanup:', error);
    return { 
      success: false, 
      deletedCount: 0, 
      message: `Cleanup failed: ${error.message}` 
    };
  }
};

/**
 * Check if a specific cart is expired
 */
export const isCartExpired = (cartData) => {
  if (!cartData.createdAt) return false;
  const now = new Date().getTime();
  const cartCreated = new Date(cartData.createdAt).getTime();
  return (now - cartCreated) > CART_EXPIRATION_TIME;
};

/**
 * Get cart expiration info
 */
export const getCartExpirationInfo = (cartData) => {
  if (!cartData.createdAt) {
    return { isExpired: false, timeRemaining: null, expiresAt: null };
  }
  
  const now = new Date().getTime();
  const cartCreated = new Date(cartData.createdAt).getTime();
  const expiresAt = cartCreated + CART_EXPIRATION_TIME;
  const timeRemaining = expiresAt - now;
  const isExpired = timeRemaining <= 0;
  
  return {
    isExpired,
    timeRemaining: isExpired ? 0 : timeRemaining,
    expiresAt: new Date(expiresAt),
    hoursRemaining: isExpired ? 0 : Math.floor(timeRemaining / (1000 * 60 * 60)),
    minutesRemaining: isExpired ? 0 : Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60))
  };
};

/**
 * Format time remaining for display
 */
export const formatTimeRemaining = (timeRemaining) => {
  if (timeRemaining <= 0) return 'Expired';
  
  const hours = Math.floor(timeRemaining / (1000 * 60 * 60));
  const minutes = Math.floor((timeRemaining % (1000 * 60 * 60)) / (1000 * 60));
  
  if (hours > 0) {
    return `${hours}h ${minutes}m remaining`;
  } else {
    return `${minutes}m remaining`;
  }
};
