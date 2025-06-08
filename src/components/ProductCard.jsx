import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Heart, ShoppingCart } from 'lucide-react';
    import { useToast } from "@/components/ui/use-toast";

    const ProductCard = ({ product }) => {
      const { toast } = useToast();

      if (!product) {
        return <div className="p-4 bg-red-100 text-red-600">Error: No product data</div>;
      }

      // Helper function to get display price for the card
      const getDisplayPrice = (product) => {
        if (!product) return '0.00';

        // Handle string price (single price)
        if (typeof product.price === 'string') {
          const price = parseFloat(product.price);
          return isNaN(price) ? '0.00' : price.toFixed(2);
        }

        // Handle number price
        if (typeof product.price === 'number') {
          return product.price.toFixed(2);
        }

        // Handle price object (size-based pricing)
        if (typeof product.price === 'object' && product.price !== null) {
          const prices = Object.values(product.price).map(p => parseFloat(p)).filter(p => !isNaN(p));
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) {
              return minPrice.toFixed(2);
            } else {
              return `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
            }
          }
        }

        // Handle legacy pricing object
        if (product.pricing && typeof product.pricing === 'object' && product.pricing !== null) {
          const prices = Object.values(product.pricing).map(p => parseFloat(p)).filter(p => !isNaN(p));
          if (prices.length > 0) {
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            if (minPrice === maxPrice) {
              return minPrice.toFixed(2);
            } else {
              return `${minPrice.toFixed(2)} - ${maxPrice.toFixed(2)}`;
            }
          }
        }

        return '0.00';
      };

      const handleAddToCart = (e) => {
        e.preventDefault(); 
        e.stopPropagation();
        toast({
          title: "💖 Added to Cart!",
          description: `${product.name} is now in your cart.`,
          duration: 3000,
        });
      };

      const cardVariants = {
        rest: { scale: 1, boxShadow: "0px 5px 10px rgba(0,0,0,0.1)" },
        hover: { 
          scale: 1.03, 
          boxShadow: "0px 10px 20px rgba(46, 71, 74, 0.15)",
          transition: { duration: 0.3, ease: "easeOut" }
        }
      };

      const imageVariants = {
        rest: { scale: 1 },
        hover: { scale: 1.1, transition: { duration: 0.3, ease: "easeOut" } }
      };

      return (
        <motion.div 
          variants={cardVariants}
          initial="rest"
          whileHover="hover"
          animate="rest"
          className="bg-white rounded-xl overflow-hidden shadow-lg group cursor-pointer flex flex-col h-full"
        >
          <Link to={`/shop/${product.id}`} className="flex flex-col h-full">
            <div className="relative overflow-hidden aspect-[4/3]">
              <motion.div variants={imageVariants} className="w-full h-full">
                <img
                  className="w-full h-full object-cover"
                  alt={product.name}
                  src={
                    product.images && product.images.length > 0
                      ? product.images[0]
                      : product.imageUrl || "https://images.unsplash.com/photo-1671376354106-d8d21e55dddd"
                  }
                  onError={(e) => {
                    e.target.src = "https://images.unsplash.com/photo-1671376354106-d8d21e55dddd";
                  }}
                />
              </motion.div>
              {/* Show color indicator if colors are available */}
              {product.colors && product.colors.length > 0 && (
                <div className="absolute bottom-2 left-2">
                  <div className="bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                    <span className="text-xs text-pastel-accent font-medium">
                      {product.colors.length} color{product.colors.length > 1 ? 's' : ''}
                    </span>
                  </div>
                </div>
              )}
              <div className="absolute top-2 right-2">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="bg-white/70 hover:bg-pastel-medium text-pastel-accent rounded-full backdrop-blur-sm"
                  onClick={(e) => {
                    e.preventDefault(); 
                    e.stopPropagation(); 
                    toast({ title: "❤️ Added to Wishlist!", description: `${product.name} has been added to your wishlist.`, duration: 2000 });
                  }}
                  aria-label="Add to wishlist"
                >
                  <Heart size={20} />
                </Button>
              </div>
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
        </motion.div>
      );
    };

    export default ProductCard;