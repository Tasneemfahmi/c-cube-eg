import React, { createContext, useContext, useReducer, useEffect, useState } from 'react';
import { db } from '../firebase.js';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { isCartExpired, getCartExpirationInfo, formatTimeRemaining } from '../utils/cartCleanup.js';

const CartContext = createContext();

// Utility function to generate or get device ID
const getDeviceId = () => {
  let deviceId = localStorage.getItem('ccube-device-id');
  if (!deviceId) {
    deviceId = 'device_' + Math.random().toString(36).substring(2, 11) + '_' + Date.now();
    localStorage.setItem('ccube-device-id', deviceId);
  }
  return deviceId;
};

// Cart expiration time (2 hours in milliseconds)
const CART_EXPIRATION_TIME = 2 * 60 * 60 * 1000; // 2 hours

// Firestore cart operations
const saveCartToFirestore = async (deviceId, cartData) => {
  try {
    const cartRef = doc(db, 'carts', deviceId);
    await setDoc(cartRef, {
      items: cartData.items,
      lastUpdated: serverTimestamp(),
      createdAt: cartData.createdAt || new Date().toISOString(),
      deviceId: deviceId,
      itemCount: cartData.items.reduce((total, item) => total + item.quantity, 0),
      expiresAt: new Date(Date.now() + CART_EXPIRATION_TIME).toISOString()
    });
    console.log('Cart saved to Firestore successfully');
  } catch (error) {
    console.error('Error saving cart to Firestore:', error);
  }
};

const loadCartFromFirestore = async (deviceId) => {
  try {
    const cartRef = doc(db, 'carts', deviceId);
    const cartSnap = await getDoc(cartRef);

    if (cartSnap.exists()) {
      const cartData = cartSnap.data();

      // Check if cart is expired
      if (isCartExpired(cartData)) {
        console.log('Cart expired, clearing from Firestore');
        // Delete expired cart from Firestore
        await setDoc(cartRef, { items: [], lastUpdated: serverTimestamp(), deviceId });
        return { items: [] };
      }

      console.log('Cart loaded from Firestore successfully');
      return {
        items: cartData.items || [],
        createdAt: cartData.createdAt
      };
    } else {
      console.log('No cart found in Firestore');
      return { items: [] };
    }
  } catch (error) {
    console.error('Error loading cart from Firestore:', error);
    return { items: [] };
  }
};

// Cart actions
const CART_ACTIONS = {
  ADD_ITEM: 'ADD_ITEM',
  REMOVE_ITEM: 'REMOVE_ITEM',
  UPDATE_QUANTITY: 'UPDATE_QUANTITY',
  CLEAR_CART: 'CLEAR_CART',
  LOAD_CART: 'LOAD_CART'
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.ADD_ITEM: {
      const { product, quantity = 1, selectedSize, selectedColor } = action.payload;

      // Ensure all options have values (no null/undefined)
      const finalSize = selectedSize || (Array.isArray(product.sizes) ? product.sizes[0] : product.sizes) || 'Standard';
      const finalColor = selectedColor || (product.colors && product.colors.length > 0 ? product.colors[0] : 'Default');

      // Create unique item key based on product id, size, and color
      const itemKey = `${product.id}-${finalSize}-${finalColor}`;

      // Check if item already exists in cart
      const existingItemIndex = state.items.findIndex(item => item.key === itemKey);

      if (existingItemIndex >= 0) {
        // Update quantity of existing item
        const updatedItems = [...state.items];
        updatedItems[existingItemIndex].quantity += quantity;
        return {
          ...state,
          items: updatedItems
        };
      } else {
        // Add new item to cart
        const newItem = {
          key: itemKey,
          product,
          quantity,
          selectedSize: finalSize,
          selectedColor: finalColor,
          addedAt: new Date().toISOString()
        };

        const newState = {
          ...state,
          items: [...state.items, newItem],
          createdAt: state.createdAt || new Date().toISOString() // Set createdAt only for first item
        };

        return newState;
      }
    }
    
    case CART_ACTIONS.REMOVE_ITEM: {
      return {
        ...state,
        items: state.items.filter(item => item.key !== action.payload.itemKey)
      };
    }
    
    case CART_ACTIONS.UPDATE_QUANTITY: {
      const { itemKey, quantity } = action.payload;
      
      if (quantity <= 0) {
        // Remove item if quantity is 0 or less
        return {
          ...state,
          items: state.items.filter(item => item.key !== itemKey)
        };
      }
      
      return {
        ...state,
        items: state.items.map(item =>
          item.key === itemKey ? { ...item, quantity } : item
        )
      };
    }
    
    case CART_ACTIONS.CLEAR_CART: {
      return {
        ...state,
        items: [],
        createdAt: null
      };
    }
    
    case CART_ACTIONS.LOAD_CART: {
      return {
        ...state,
        items: action.payload.items || [],
        createdAt: action.payload.createdAt || state.createdAt
      };
    }
    
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  createdAt: null
};

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const [deviceId, setDeviceId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize device ID and load cart on mount
  useEffect(() => {
    const initializeCart = async () => {
      try {
        // Get or create device ID
        const id = getDeviceId();
        setDeviceId(id);

        // Try to load cart from Firestore first
        const firestoreCart = await loadCartFromFirestore(id);

        if (firestoreCart.items.length > 0) {
          // Use Firestore cart if it exists and has items
          dispatch({ type: CART_ACTIONS.LOAD_CART, payload: firestoreCart });
          // Also save to localStorage as cache
          localStorage.setItem('ccube-cart', JSON.stringify(firestoreCart));
        } else {
          // Fallback to localStorage if Firestore is empty
          const savedCart = localStorage.getItem('ccube-cart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);

            // Check if localStorage cart is expired
            if (isCartExpired(parsedCart)) {
              console.log('LocalStorage cart expired, clearing');
              localStorage.removeItem('ccube-cart');
            } else {
              dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
              // Sync localStorage cart to Firestore
              if (parsedCart.items.length > 0) {
                await saveCartToFirestore(id, parsedCart);
              }
            }
          }
        }
      } catch (error) {
        console.error('Error initializing cart:', error);
        // Fallback to localStorage only
        try {
          const savedCart = localStorage.getItem('ccube-cart');
          if (savedCart) {
            const parsedCart = JSON.parse(savedCart);
            dispatch({ type: CART_ACTIONS.LOAD_CART, payload: parsedCart });
          }
        } catch (localError) {
          console.error('Error loading cart from localStorage:', localError);
        }
      } finally {
        setIsLoading(false);
      }
    };

    initializeCart();
  }, []);

  // Save cart to both localStorage and Firestore whenever it changes
  useEffect(() => {
    if (!deviceId || isLoading) return;

    const saveCart = async () => {
      try {
        // Save to localStorage (synchronous)
        localStorage.setItem('ccube-cart', JSON.stringify(state));

        // Save to Firestore (asynchronous)
        await saveCartToFirestore(deviceId, state);
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    };

    saveCart();
  }, [state, deviceId, isLoading]);

  // Helper function to get item price based on size
  const getItemPrice = (product, selectedSize) => {
    // Handle size-based pricing (price as map object)
    if (product.price && typeof product.price === 'object') {
      if (selectedSize && product.price[selectedSize.toLowerCase()]) {
        return parseFloat(product.price[selectedSize.toLowerCase()]);
      }
      // If no size selected or size not found, return first available price
      const prices = Object.values(product.price).map(p => parseFloat(p)).filter(p => !isNaN(p));
      return prices.length > 0 ? prices[0] : 0;
    }
    
    // Handle legacy pricing object
    if (product.pricing && typeof product.pricing === 'object') {
      const prices = Object.values(product.pricing).map(p => parseFloat(p)).filter(p => !isNaN(p));
      return prices.length > 0 ? prices[0] : 0;
    }
    
    // Handle simple price string
    if (typeof product.price === 'string') {
      return parseFloat(product.price) || 0;
    }
    
    return 0;
  };

  // Cart actions
  const addItem = (product, quantity = 1, selectedSize = null, selectedColor = null) => {
    dispatch({
      type: CART_ACTIONS.ADD_ITEM,
      payload: { product, quantity, selectedSize, selectedColor }
    });
  };

  const removeItem = (itemKey) => {
    dispatch({
      type: CART_ACTIONS.REMOVE_ITEM,
      payload: { itemKey }
    });
  };

  const updateQuantity = (itemKey, quantity) => {
    dispatch({
      type: CART_ACTIONS.UPDATE_QUANTITY,
      payload: { itemKey, quantity }
    });
  };

  const clearCart = () => {
    dispatch({ type: CART_ACTIONS.CLEAR_CART });
  };

  // Manual sync function for troubleshooting
  const syncCartToFirestore = async () => {
    if (!deviceId) return;
    try {
      await saveCartToFirestore(deviceId, state);
      return { success: true, message: 'Cart synced successfully' };
    } catch (error) {
      console.error('Error syncing cart:', error);
      return { success: false, message: 'Failed to sync cart' };
    }
  };

  // Computed values
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = state.items.reduce((total, item) => {
    const itemPrice = getItemPrice(item.product, item.selectedSize);
    return total + (itemPrice * item.quantity);
  }, 0);

  // Cart expiration info
  const expirationInfo = getCartExpirationInfo(state);

  const value = {
    items: state.items,
    itemCount,
    subtotal,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemPrice,
    isLoading,
    deviceId,
    syncCartToFirestore,
    expirationInfo,
    formatTimeRemaining
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
