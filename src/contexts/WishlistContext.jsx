// contexts/WishlistContext.js
import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebase'; // adjust path accordingly
import { doc, setDoc, getDoc, updateDoc, arrayUnion, arrayRemove } from 'firebase/firestore';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [wishlist, setWishlist] = useState([]);

  const fetchWishlist = async () => {
    if (!currentUser) return;

    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    const docSnap = await getDoc(wishlistRef);
    if (docSnap.exists()) {
      setWishlist(docSnap.data().items || []);
    } else {
      await setDoc(wishlistRef, { items: [] });
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchWishlist();
    } else {
      setWishlist([]);
    }
  }, [currentUser]);

  const addToWishlist = async (item) => {
    if (!currentUser) return;

    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    await updateDoc(wishlistRef, {
      items: arrayUnion(item),
    });
    setWishlist((prev) => [...prev, item]);
  };

  const removeFromWishlist = async (item) => {
    if (!currentUser) return;

    const wishlistRef = doc(db, 'wishlists', currentUser.uid);
    await updateDoc(wishlistRef, {
      items: arrayRemove(item),
    });
    setWishlist((prev) => prev.filter((i) => i.id !== item.id));
  };

  return (
    <WishlistContext.Provider value={{ wishlist, addToWishlist, removeFromWishlist }}>
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
