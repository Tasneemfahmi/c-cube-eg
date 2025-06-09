import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../contexts/WishlistContext';
import { getProductsByIds } from '../utils/productUtils';
import { FaHeart } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const Wishlist = () => {
  const { wishlist, removeFromWishlist } = useWishlist();
  const [products, setProducts] = useState([]);
  const { toast } = useToast();

  useEffect(() => {
    const fetchProducts = async () => {
      if (wishlist.length === 0) {
        setProducts([]);
        return;
      }

      const productData = await getProductsByIds(wishlist);
      setProducts(productData);
    };

    fetchProducts();
  }, [wishlist]);

  const getDisplayPrice = (product) => {
    if (!product) return '0.00';
    if (typeof product.price === 'string' || typeof product.price === 'number') {
      const price = parseFloat(product.price);
      return isNaN(price) ? '0.00' : price.toFixed(2);
    }
    if (typeof product.price === 'object') {
      const prices = Object.values(product.price).map(p => parseFloat(p)).filter(p => !isNaN(p));
      if (prices.length) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? min.toFixed(2) : `${min.toFixed(2)} - ${max.toFixed(2)}`;
      }
    }
    return '0.00';
  };

  const handleRemove = (id, name) => {
    removeFromWishlist(id);
    toast({
      title: "💔 Removed from Wishlist",
      description: `${name} has been removed from your wishlist.`,
      duration: 2000,
    });
  };

   return (
    <div className='grid grid-cols-4 gap-4 my-12 mx-4'>
      <motion.div
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer flex flex-col h-full col-span-3"
    >
      <ul className="divide-y divide-gray-200">
        {products.map((item) => (
          <li
            key={item.id}
            className="flex items-start sm:items-center gap-4 py-6 hover:bg-gray-50 px-4 transition"
          >
            <Link to={`/shop/${item.id}`} className="flex-shrink-0">
              <img
                src={item.image || item.images?.[0]}
                alt={item.name}
                className="w-20 h-20 object-cover rounded shadow-sm"
              />
            </Link>

            <div className="flex-1 min-w-0">
              <Link to={`/shop/${item.id}`}>
                <p className="text-xs uppercase text-pastel-dark font-semibold">
                  {item.category || 'Product'}
                </p>
                <h3 className="text-lg font-bold text-pastel-accent line-clamp-1">
                  {item.name}
                </h3>
                <p className="text-sm text-pastel-accent/70 line-clamp-2">
                  {item.description}
                </p>
                <p className="text-md font-semibold text-pastel-dark mt-2">
                  £E {getDisplayPrice(item)}
                </p>
              </Link>
            </div>

            <div className="flex flex-col items-end gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="text-pastel-medium hover:text-pastel-light"
                onClick={() => handleRemove(item.id, item.name)}
                aria-label="Remove from wishlist"
              >
                <FaHeart size={18} />
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
    </div>
  );
};

export default Wishlist;
