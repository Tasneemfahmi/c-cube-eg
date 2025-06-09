// pages/Wishlist.jsx
import { useWishlist } from '../contexts/WishlistContext';
import ProductCard from '../components/ProductCard'; // or your custom card for wishlist

const Wishlist = () => {
  const { wishlist } = useWishlist();

  return (
    <div className="wishlist-page p-6">
      <h2 className="text-2xl font-semibold mb-4">My Wishlist</h2>
      {wishlist.length === 0 ? (
        <p>Your wishlist is empty.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {wishlist.map(item => (
            <ProductCard key={item.id} product={item} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
