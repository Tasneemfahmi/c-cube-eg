import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";
import { useCart } from '../contexts/CartContext';
import { DiscountBadge } from './DiscountBanner';
import { useWishlist } from '../contexts/WishlistContext';
import { FaHeart, FaRegHeart } from 'react-icons/fa';

const ProductCard = ({ product }) => {
  const { toast } = useToast();
  const { addItem } = useCart();
  const { wishlist, addToWishlist, removeFromWishlist } = useWishlist();

  const isInWishlist = wishlist.includes(product.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product);
    }

    toast({
      title: isInWishlist ? "💔 Removed from Wishlist" : "❤️ Added to Wishlist!",
      description: `${product.name} has been ${isInWishlist ? "removed from" : "added to"} your wishlist.`,
      duration: 2000,
    });
  };

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    const hasMultipleOptions = (product.colors?.length > 1) ||
      (Array.isArray(product.sizes) && product.sizes.length > 1) ||
      (Array.isArray(product.sizeOptions) && product.sizeOptions.length > 1) ||
      (product.scent?.length > 1);

    if (hasMultipleOptions) {
      toast({
        title: "🔍 Multiple Options Available",
        description: "Click on the product to select your preferred options.",
        duration: 3000,
      });
      return;
    }

    addItem(product, 1);
    toast({
      title: "💖 Added to Cart!",
      description: `${product.name} is now in your cart.`,
      duration: 3000,
    });
  };

  const getDisplayPrice = (product) => {
    if (!product) return '0.00';

    if (typeof product.price === 'string' || typeof product.price === 'number') {
      const price = parseFloat(product.price);
      return isNaN(price) ? '0.00' : price.toFixed(2);
    }

    if (typeof product.price === 'object' && product.price !== null) {
      const prices = Object.values(product.price).map(p => parseFloat(p)).filter(p => !isNaN(p));
      if (prices.length) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? min.toFixed(2) : `${min.toFixed(2)} - ${max.toFixed(2)}`;
      }
    }

    if (product.pricing && typeof product.pricing === 'object') {
      const prices = Object.values(product.pricing).map(p => parseFloat(p)).filter(p => !isNaN(p));
      if (prices.length) {
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        return min === max ? min.toFixed(2) : `${min.toFixed(2)} - ${max.toFixed(2)}`;
      }
    }

    return '0.00';
  };

  const cardVariants = {
    rest: { scale: 1, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" },
    hover: {
      scale: 1.03,
      boxShadow: "0px 10px 20px rgba(46, 71, 74, 0.15)",
      transition: { duration: 0.3, ease: "easeOut" },
    },
  };

  const imageVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.1, transition: { duration: 0.3, ease: "easeOut" } },
  };

  if (!product) {
    return <div className="p-4 bg-red-100 text-red-600">Error: No product data</div>;
  }

  return (
    <motion.div
      variants={cardVariants}
      initial="rest"
      whileHover="hover"
      animate="rest"
      className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer flex flex-col h-full"
    >
      <div className="relative flex flex-col h-full">
        <div className="absolute left-2 top-2 z-10">
          <Button
            variant="ghost"
            size="icon"
            className="bg-white/70 hover:bg-pastel-medium text-pastel-accent rounded-full backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              handleWishlistToggle();
            }}
            aria-label="Toggle wishlist"
          >
            {isInWishlist ? <FaHeart color="pastel-dark" size={20} /> : <FaRegHeart size={20} />}
          </Button>
        </div>

        <Link to={`/shop/${product.id}`} className="flex flex-col h-full">
          <div className="relative overflow-hidden aspect-[4/3]">
            <DiscountBadge productId={product.id} />
            <motion.div variants={imageVariants} className="w-full h-full">
              <img
                className="w-full h-full object-cover"
                alt={product.name}
                src={product.images?.[0] || product.imageUrl || "https://images.unsplash.com/photo-1671376354106-d8d21e55dddd"}
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1671376354106-d8d21e55dddd";
                }}
              />
            </motion.div>
          </div>

          <div className="p-5 flex flex-col flex-grow">
            <span className="text-xs text-pastel-dark font-medium uppercase tracking-wider mb-1">{product.category}</span>
            <h3 className="text-lg font-semibold text-pastel-accent mb-2 group-hover:text-pastel-dark transition-colors duration-300 truncate">{product.name}</h3>
            <p className="text-sm text-pastel-accent/70 mb-3 flex-grow line-clamp-2">{product.description}</p>

            <div className="mt-auto">
              <p className="text-xl font-bold text-pastel-accent mb-4">£E{getDisplayPrice(product)}</p>
              <Button
                onClick={handleAddToCart}
                className="w-full bg-pastel-dark text-white hover:bg-pastel-accent transition-colors duration-300 group-hover:scale-105 transform"
                aria-label={`Add ${product.name} to cart`}
              >
                Add to Cart <ShoppingCart size={18} className="ml-2" />
              </Button>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default ProductCard;
