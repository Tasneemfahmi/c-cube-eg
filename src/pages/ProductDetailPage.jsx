import React, { useState, useEffect, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Heart, ShoppingCart, ChevronLeft, ChevronRight, CheckCircle, Star } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { db } from '../firebase.js';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { fetchAllProducts } from '../utils/fetchProducts.js';
import { useCart } from '../contexts/CartContext';
import DiscountBanner from '../components/DiscountBanner';

const ProductDetailPage = () => {
  const { productId } = useParams();
  const { toast } = useToast();
  const { addItem } = useCart();
  const [product, setProduct] = useState(null);
  const [allProducts, setAllProducts] = useState([]);
  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [currentPrice, setCurrentPrice] = useState(0);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Try flexible fetching first
        const result = await fetchAllProducts();
        let products = [];

        if (result.success) {
          products = result.products;
        } else {
          // Fallback to simple approach
          const querySnapshot = await getDocs(collection(db, "products"));
          products = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        }

        setAllProducts(products);

        // Find the specific product
        const foundProduct = products.find(p =>
          p.id === productId ||
          p.id.toString() === productId ||
          p.id === productId.toString()
        );

        setProduct(foundProduct);

      } catch (error) {
        // Error handling - could set an error state here if needed
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [productId]);


  const handleQuantityChange = (amount) => {
    setQuantity(prev => Math.max(1, Math.min(prev + amount, product?.inStock ? 10 : 1)));
  };
  
  const handleAddToCart = () => {
    // Validate that all required options are selected
    const hasColors = product.colors && product.colors.length > 0;
    const hasSizes = (Array.isArray(product.sizes) && product.sizes.length > 0) ||
                    (Array.isArray(product.sizeOptions) && product.sizeOptions.length > 0);

    // Check if color is required but not selected
    if (hasColors && !selectedColor) {
      toast({
        title: "⚠️ Color Required",
        description: "Please select a color before adding to cart.",
        duration: 3000,
      });
      return;
    }

    // Check if size is required but not selected
    if (hasSizes && !selectedSize) {
      toast({
        title: "⚠️ Size Required",
        description: "Please select a size before adding to cart.",
        duration: 3000,
      });
      return;
    }

    const options = [];
    if (selectedColor) options.push(selectedColor);
    if (selectedSize) options.push(selectedSize);

    // Add item to cart with selected options
    addItem(product, quantity, selectedSize, selectedColor);

    toast({
      title: "💖 Added to Cart!",
      description: `${product.name}${options.length > 0 ? ` (${options.join(', ')})` : ''} x${quantity} is now in your cart.`,
      duration: 3000,
      action: <CheckCircle className="text-green-500" />,
    });
  };

  const handleWishlist = () => {
     toast({
      title: "❤️ Added to Wishlist!",
      description: `${product.name} has been added to your wishlist.`,
      duration: 2000,
    });
  }

  const nextImage = () => {
    const imageCount = product?.images?.length || 1;
    setCurrentImageIndex(prev => (prev + 1) % imageCount);
  };

  const prevImage = () => {
    const imageCount = product?.images?.length || 1;
    setCurrentImageIndex(prev => (prev - 1 + imageCount) % imageCount);
  };

  // Calculate price based on size and your price structure
  const calculatePrice = (product, size) => {
    if (!product) return 0;

    // Handle your structure: price is a map/object with size keys
    if (typeof product.price === 'object' && product.price !== null) {
      if (size && product.price[size.toLowerCase()]) {
        return parseFloat(product.price[size.toLowerCase()]) || 0;
      }
      // If no size specified but price is an object, return the first available price
      if (!size) {
        const firstPrice = Object.values(product.price)[0];
        return parseFloat(firstPrice) || 0;
      }
    }

    // Handle legacy structure: pricing object
    if (product.pricing && typeof product.pricing === 'object' && product.pricing !== null) {
      if (size && product.pricing[size]) {
        return parseFloat(product.pricing[size]) || 0;
      }
      // If no size specified but pricing exists, return the first available price
      if (!size) {
        const firstPrice = Object.values(product.pricing)[0];
        return parseFloat(firstPrice) || 0;
      }
    }

    // Handle string price (single price for all sizes)
    if (typeof product.price === 'string') {
      return parseFloat(product.price) || 0;
    }

    // Handle number price
    if (typeof product.price === 'number') {
      return product.price;
    }

    return 0;
  };

  // Get price range for multi-size products
  const getPriceRange = (product) => {
    if (!product) return null;

    let prices = [];

    // Handle your structure: price is a map/object with size keys
    if (typeof product.price === 'object' && product.price !== null) {
      prices = Object.values(product.price).map(p => parseFloat(p)).filter(p => !isNaN(p));
    }
    // Handle legacy structure: pricing object
    else if (product.pricing && typeof product.pricing === 'object' && product.pricing !== null) {
      prices = Object.values(product.pricing).map(p => parseFloat(p)).filter(p => !isNaN(p));
    }

    if (prices.length > 1) {
      const minPrice = Math.min(...prices);
      const maxPrice = Math.max(...prices);
      return { min: minPrice, max: maxPrice };
    }

    return null;
  };

  // Initialize selected options when product loads
  useEffect(() => {
    if (product) {
      // Initialize color
      if (product.colors && product.colors.length > 0) {
        setSelectedColor(product.colors[0]);
      }

      // Initialize size - handle your structure (sizes as array) and legacy formats
      let initialSize = null;
      if (product.sizes && Array.isArray(product.sizes) && product.sizes.length > 0) {
        initialSize = product.sizes[0];
        setSelectedSize(initialSize);
      } else if (typeof product.sizes === 'string') {
        initialSize = product.sizes;
        setSelectedSize(initialSize);
      } else if (product.sizeOptions && Array.isArray(product.sizeOptions) && product.sizeOptions.length > 0) {
        initialSize = product.sizeOptions[0];
        setSelectedSize(initialSize);
      }

      // Initialize price using your structure
      // For multi-size products without a selected size, show the first available price
      const price = calculatePrice(product, initialSize);
      setCurrentPrice(price);
    }
  }, [product]);

  // Update price when size changes
  useEffect(() => {
    if (product) {
      const price = calculatePrice(product, selectedSize);
      setCurrentPrice(price);
    }
  }, [selectedSize, product]);
  
  const pageTransition = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.3, ease: "easeIn" } }
  };
  
  const imageTransition = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.95 }
  };

  if (loading) {
    return (
      <div className="container mx-auto text-center py-20">
        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-accent mb-4"></div>
        <p className="text-xl text-pastel-accent">Loading product details...</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto text-center py-20">
        <h1 className="text-2xl font-bold text-pastel-accent mb-4">Product Not Found</h1>
        <p className="text-lg text-pastel-accent/70 mb-6">
          The product you're looking for could not be found.
        </p>
        <Link to="/shop" className="inline-block mt-6">
          <Button className="bg-pastel-dark text-white hover:bg-pastel-accent">
            Back to Shop
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <motion.div 
      variants={pageTransition}
      initial="initial"
      animate="animate"
      exit="exit"
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 animate-fade-in"
    >
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-start">
        {/* Image Gallery */}
        <motion.div 
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative"
        >
          <AnimatePresence mode="wait">
            <motion.div 
              key={currentImageIndex}
              variants={imageTransition}
              initial="initial"
              animate="animate"
              exit="exit"
              className="aspect-square w-full rounded-xl shadow-2xl overflow-hidden bg-pastel-light"
            >
              <img
                className="w-full h-full object-cover"
                alt={`${product.name} - view ${currentImageIndex + 1}`}
                src={
                  product.images && product.images.length > 0
                    ? product.images[currentImageIndex]
                    : "https://images.unsplash.com/photo-1580928087639-6bfb993701a0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=600&fit=crop&ixid=M3w2Mzg4NTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTcxNzE0Njd8"
                }
                onError={(e) => {
                  e.target.src = "https://images.unsplash.com/photo-1580928087639-6bfb993701a0?ixlib=rb-4.0.3&q=85&fm=jpg&crop=entropy&cs=srgb&w=600&h=600&fit=crop&ixid=M3w2Mzg4NTR8MHwxfHJhbmRvbXx8fHx8fHx8fDE3MTcxNzE0Njd8";
                }}
              />
            </motion.div>
          </AnimatePresence>
          {product.images && product.images.length > 1 && (
            <>
              <Button variant="ghost" size="icon" onClick={prevImage} className="absolute top-1/2 left-2 -translate-y-1/2 bg-white/70 hover:bg-pastel-medium text-pastel-accent rounded-full backdrop-blur-sm z-10">
                <ChevronLeft size={28} />
              </Button>
              <Button variant="ghost" size="icon" onClick={nextImage} className="absolute top-1/2 right-2 -translate-y-1/2 bg-white/70 hover:bg-pastel-medium text-pastel-accent rounded-full backdrop-blur-sm z-10">
                <ChevronRight size={28} />
              </Button>
              <div className="mt-4 flex space-x-2 justify-center">
                {product.images && product.images.map((imageUrl, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden border-2 ${index === currentImageIndex ? 'border-pastel-dark ring-2 ring-pastel-dark' : 'border-transparent hover:border-pastel-medium'} transition-all`}
                  >
                    <img className="w-full h-full object-cover" alt={`Thumbnail ${index + 1}`} src={imageUrl} />
                  </button>
                ))}
              </div>
            </>
          )}
        </motion.div>

        {/* Product Details */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="space-y-6"
        >
          <span className="text-sm text-pastel-dark font-medium uppercase tracking-wider">
            {product.category || 'Uncategorized'}
          </span>
          <h1 className="text-3xl md:text-4xl font-bold text-pastel-accent">
            {product.name || 'Unnamed Product'}
          </h1>
          {(product.rating || product.reviews) && (
            <div className="flex items-center space-x-2">
              <div className="flex text-yellow-400">
                {[...Array(Math.floor(product.rating || 0))].map((_, i) => <Star key={i} size={20} className="fill-current" />)}
                {(product.rating || 0) % 1 !== 0 && <Star size={20} className="fill-current opacity-50" />}
                {[...Array(5 - Math.ceil(product.rating || 0))].map((_, i) => <Star key={`empty-${i}`} size={20} className="text-gray-300" />)}
              </div>
              <span className="text-sm text-pastel-accent/70">({product.reviews || 0} reviews)</span>
            </div>
          )}
          <div className="space-y-1">
            <p className="text-2xl font-semibold text-pastel-dark">
              £E{currentPrice.toFixed(2)}
              {selectedSize && (typeof product.price === 'object' || product.pricing) && (
                <span className="text-sm text-pastel-accent/70 ml-2">
                  (Size: {selectedSize})
                </span>
              )}
            </p>
            {(() => {
              const priceRange = getPriceRange(product);
              if (priceRange && !selectedSize) {
                return (
                  <p className="text-sm text-pastel-accent/70">
                    Price range: £E{priceRange.min.toFixed(2)} - £E{priceRange.max.toFixed(2)}
                  </p>
                );
              }
              return null;
            })()}
          </div>
          <p className="text-pastel-accent/80 leading-relaxed">
            {product.description || 'No description available.'}
          </p>

          {/* Discount Banner for this product */}
          <DiscountBanner productId={product.id} />

          {/* Color Selection */}
          {product.colors && product.colors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-pastel-accent">
                Color: <span className="font-normal text-pastel-accent/90">{selectedColor}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <Button
                    key={color}
                    variant={selectedColor === color ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedColor(color)}
                    className={`
                      ${selectedColor === color
                        ? 'bg-pastel-dark text-white border-pastel-dark ring-2 ring-pastel-dark/30'
                        : 'border-pastel-medium text-pastel-accent hover:bg-pastel-light hover:border-pastel-dark'
                      }
                    `}
                  >
                    {color}
                  </Button>
                ))}
              </div>
            </div>
          )}

{/* Size Selection */}
          {(product.sizes || product.sizeOptions) && (
            <div className="space-y-3">
              <h3 className="text-md font-semibold text-pastel-accent">
                Size: <span className="font-normal text-pastel-accent/90">{selectedSize}</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {/* Handle your structure: sizes as array */}
                {Array.isArray(product.sizes) && product.sizes.map((size) => {
                  const sizePrice = calculatePrice(product, size);
                  const hasValidPrice = sizePrice > 0;
                  return (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={`
                        ${selectedSize === size
                          ? 'bg-pastel-dark text-white border-pastel-dark ring-2 ring-pastel-dark/30'
                          : 'border-pastel-medium text-pastel-accent hover:bg-pastel-light hover:border-pastel-dark'
                        }
                      `}
                    >
                      {size}
                      {hasValidPrice ? (
                        <span className="ml-1 text-xs">
                          (£E{sizePrice.toFixed(2)})
                        </span>
                      ) : (typeof product.price === 'object' || product.pricing) && (
                        <span className="ml-1 text-xs text-red-500">
                          (No price)
                        </span>
                      )}
                    </Button>
                  );
                })}

                {/* Handle string size (like "Original") */}
                {typeof product.sizes === 'string' && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-pastel-medium text-pastel-accent cursor-default"
                    disabled
                  >
                    {product.sizes}
                  </Button>
                )}

                {/* Handle legacy sizeOptions array */}
                {product.sizeOptions && Array.isArray(product.sizeOptions) && product.sizeOptions.map((size) => {
                  const sizePrice = calculatePrice(product, size);
                  const hasValidPrice = sizePrice > 0;
                  return (
                    <Button
                      key={size}
                      variant={selectedSize === size ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedSize(size)}
                      className={`
                        ${selectedSize === size
                          ? 'bg-pastel-dark text-white border-pastel-dark ring-2 ring-pastel-dark/30'
                          : 'border-pastel-medium text-pastel-accent hover:bg-pastel-light hover:border-pastel-dark'
                        }
                      `}
                    >
                      {size}
                      {hasValidPrice ? (
                        <span className="ml-1 text-xs">
                          (£E{sizePrice.toFixed(2)})
                        </span>
                      ) : (typeof product.price === 'object' || product.pricing) && (
                        <span className="ml-1 text-xs text-red-500">
                          (No price)
                        </span>
                      )}
                    </Button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Quantity Selector */}
          <div className="flex items-center space-x-4">
            <h3 className="text-md font-semibold text-pastel-accent">Quantity:</h3>
            <div className="flex items-center border border-pastel-medium rounded-md">
              <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(-1)} className="px-3 text-pastel-accent hover:bg-pastel-light rounded-r-none">-</Button>
              <span className="px-4 text-pastel-accent">{quantity}</span>
              <Button variant="ghost" size="sm" onClick={() => handleQuantityChange(1)} className="px-3 text-pastel-accent hover:bg-pastel-light rounded-l-none">+</Button>
            </div>
            <span className="text-sm text-pastel-accent/70">
              {product.inStock ? 'In Stock' : 'Out of Stock'}
            </span>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            <Button
              size="lg"
              onClick={handleAddToCart}
              disabled={!product.inStock}
              className="flex-1 bg-pastel-accent text-pastel-bg hover:bg-pastel-accent/90 shadow-lg disabled:opacity-50"
            >
              <ShoppingCart size={20} className="mr-2" />
              {product.inStock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlist} className="flex-1 border-pastel-dark text-pastel-accent hover:bg-pastel-dark hover:text-pastel-bg shadow-md">
              <Heart size={20} className="mr-2" /> Add to Wishlist
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Long Description / Tabs */}
      {(product.longDescription || product.description) && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16 pt-8 border-t border-pastel-medium/50"
        >
          <h2 className="text-2xl font-semibold text-pastel-accent mb-4">Product Details</h2>
          <div className="prose prose-lg max-w-none text-pastel-accent/80 leading-relaxed">
            <p>{product.longDescription || product.description}</p>
          </div>
        </motion.div>
      )}
      
      {/* Related Products */}
      <motion.section 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="mt-16 pt-8 border-t border-pastel-medium/50"
      >
        <h2 className="text-2xl md:text-3xl font-bold text-pastel-accent text-center mb-12">
          You Might Also Like
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {allProducts
            .filter(p => p.id !== product.id)
            .slice(0, 3)
            .map((relatedProduct, index) => (
              <motion.div
                key={relatedProduct.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <ProductCard product={relatedProduct} />
              </motion.div>
            ))}
        </div>
        {allProducts.filter(p => p.id !== product.id).length === 0 && (
          <p className="text-center text-pastel-accent/70">No related products available.</p>
        )}
      </motion.section>
    </motion.div>
  );
};

export default ProductDetailPage;

