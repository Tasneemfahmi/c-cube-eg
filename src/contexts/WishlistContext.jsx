import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase';
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  // Fetch wishlist from Firestore
  const fetchWishlist = async () => {
    if (!currentUser) return;

    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    const docSnap = await getDoc(wishlistRef);

    if (docSnap.exists()) {
      setWishlist(docSnap.data().items || []);
    } else {
      await setDoc(wishlistRef, { uid: currentUser.uid, items: [] });
      setWishlist([]);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  // ✅ Add to wishlist and update state
  const addToWishlist = async (product) => {
    if (!currentUser) return;

    const productId = product.id;
    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    const wishlistSnap = await getDoc(wishlistRef);

    if (wishlistSnap.exists()) {
      await updateDoc(wishlistRef, {
        items: arrayUnion(productId),
        uid: currentUser.uid,
      });
    } else {
      await setDoc(wishlistRef, {
        uid: currentUser.uid,
        items: [productId],
      });
    }

    setWishlist((prev) => (prev.includes(productId) ? prev : [...prev, productId]));
  };

  // ✅ Remove from wishlist and update state
  const removeFromWishlist = async (productId) => {
    if (!currentUser) return;

    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    await updateDoc(wishlistRef, {
      items: arrayRemove(productId),
    });

    setWishlist((prev) => prev.filter((id) => id !== productId));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
