import React, { useState, useEffect } from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Button } from '@/components/ui/button';
    import { Heart, ShoppingBag, Gift } from 'lucide-react';
    import ProductCard from '@/components/ProductCard';
    import { useToast } from "@/components/ui/use-toast";

    // Fallback placeholder products if no Firestore products are found
    const placeholderProducts = [
      { id: 1, name: "Pastel Crochet Bag", category: "Crochet", price: "25.00", imageSrc: "crochet_bag_pastel", description: "A charming handmade crochet bag in soft pastel hues." },
      { id: 2, name: "Scented Soy Candle", category: "Candles", price: "15.00", imageSrc: "scented_candle_pastel", description: "Relaxing scented soy candle, perfect for cozy evenings." },
      { id: 3, name: "Clay Trinket Dish", category: "Clay", price: "12.00", imageSrc: "clay_trinket_dish", description: "Cute clay dish for your tiny treasures." },
      { id: 4, name: "Mini Canvas Art", category: "Canvas", price: "30.00", imageSrc: "mini_canvas_art_abstract", description: "Unique abstract mini canvas art to brighten your space." },
    ];

    const ComingSoonPage  = () => {
      const { toast } = useToast();
      const [loading, setLoading] = useState(true);
      const [error, setError] = useState(null);
      const [addingProducts, setAddingProducts] = useState(false);

      // Fetch products from Firestore on component mount
      useEffect(() => {
        const fetchProducts = async () => {
          try {
            setLoading(true);
            setError(null);
            console.log('🏠 HomePage: Fetching products from Firestore...');

            // Try the flexible fetching first
            const result = await fetchAllProducts();

            if (result.success && result.products.length > 0) {
              // Filter for featured products, or take first 4 if no featured products
              const featuredProducts = result.products.filter(product => product.featured === true);
              const displayProducts = featuredProducts.length > 0
                ? featuredProducts.slice(0, 4)
                : result.products.slice(0, 4);

              setProducts(displayProducts);
              console.log(`🏠 HomePage: Loaded ${displayProducts.length} featured products`);
            } else {
              // Fallback to simple approach
              console.log('🏠 HomePage: Trying fallback approach...');
              const querySnapshot = await getDocs(collection(db, "products"));
              const allProducts = querySnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
              }));

              if (allProducts.length > 0) {
                const featuredProducts = allProducts.filter(product => product.featured === true);
                const displayProducts = featuredProducts.length > 0
                  ? featuredProducts.slice(0, 4)
                  : allProducts.slice(0, 4);

                setProducts(displayProducts);
                console.log(`🏠 HomePage: Loaded ${displayProducts.length} products (fallback)`);
              } else {
                // Use placeholder products if no Firestore products found
                setProducts(placeholderProducts);
                console.log('🏠 HomePage: No Firestore products found, using placeholders');
              }
            }
          } catch (err) {
            console.error('🏠 HomePage: Error fetching products:', err);
            setError('Failed to load products');
            // Use placeholder products on error
            setProducts(placeholderProducts);
          } finally {
            setLoading(false);
          }
        };

        fetchProducts();
      }, []);

      // Function to add sample products
      const handleAddSampleProducts = async () => {
        try {
          setAddingProducts(true);
          const result = await addSampleProducts();

          if (result.success) {
            toast({
              title: "✅ Success!",
              description: result.message,
              duration: 3000,
            });

            // Refresh products after adding
            const refreshResult = await fetchAllProducts();
            if (refreshResult.success && refreshResult.products.length > 0) {
              const featuredProducts = refreshResult.products.filter(product => product.featured === true);
              const displayProducts = featuredProducts.length > 0
                ? featuredProducts.slice(0, 4)
                : refreshResult.products.slice(0, 4);

              setProducts(displayProducts);
            }
          } else {
            toast({
              title: "❌ Error",
              description: result.message,
              duration: 5000,
            });
          }
        } catch (err) {
          toast({
            title: "❌ Error",
            description: "Failed to add sample products. Please try again.",
            duration: 5000,
          });
        } finally {
          setAddingProducts(false);
        }
      };

      const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: { staggerChildren: 0.2, delayChildren: 0.3 }
        }
      };

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
      };
      
      const heroSectionVariants = {
        initial: { opacity: 0, scale: 0.9 },
        animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut" } }
      };

      const handleShopNow = () => {
        toast({
          title: "🛍️ Off to Shopping!",
          description: "Get ready to find your new favorite handmade treasures!",
          duration: 3000,
        });
      };

      return (
        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="animate-fade-in"
        >
          {/* Hero Section */}
          <motion.section 
            variants={heroSectionVariants}
            initial="initial"
            animate="animate"
            className="bg-gradient-to-br from-pastel-light via-pastel-medium to-pastel-dark py-20 md:py-32 text-center relative overflow-hidden"
          >
            <div className="absolute inset-0 opacity-30">
              <img  class="w-full h-full object-cover" alt="Pastel Concrete Shells" src={PastelConcreteShells} />
            </div>
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.h1 variants={itemVariants} className="text-4xl sm:text-5xl md:text-6xl font-bold text-pastel-accent mb-6">
                C³ – <span className="text-white">C Cube</span>
              </motion.h1>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-pastel-accent/80 mb-10">
                Handmade with heart – across six sides.
              </motion.p>
              <motion.p variants={itemVariants} className="text-xl md:text-2xl text-pastel-accent/80 mb-10">
                Coming Soon
              </motion.p>
            </div>
          </motion.section>

          {/* Featured Products Section */}
          <section className="py-16 md:py-24 bg-pastel-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-pastel-accent text-center mb-4">
                Featured Treasures
              </motion.h2>

            
              {loading ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-accent mb-4"></div>
                  <p className="text-lg text-pastel-accent/70">Loading featured products...</p>
                </motion.div>
              ) : error ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-lg text-pastel-accent/70 mb-4">Unable to load products</p>
                  <p className="text-sm text-pastel-accent/50">Showing sample products instead</p>
                </motion.div>
              ) : null}

              <motion.div
                variants={containerVariants}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
              >
                {products.map((product, index) => (
                   <motion.div key={product.id} variants={itemVariants} custom={index} className="animate-slide-in-up" style={{animationDelay: `${index * 0.1}s`}}>
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </motion.div>

              {products.length === 0 && !loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-12"
                >
                  <p className="text-lg text-pastel-accent/70 mb-4">No featured products available</p>
                  <p className="text-sm text-pastel-accent/50 mb-6">Add some products to your Firestore database to see them here!</p>
                  <div className="flex justify-center gap-4 flex-wrap">
                    <Button
                      onClick={handleAddSampleProducts}
                      disabled={addingProducts}
                      className="bg-pastel-dark text-white hover:bg-pastel-accent disabled:opacity-50"
                    >
                      {addingProducts ? (
                        <>
                          <div className="inline-block animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Adding Products...
                        </>
                      ) : (
                        'Add Sample Products'
                      )}
                    </Button>
                    <Button asChild variant="outline" className="border-pastel-dark text-pastel-accent hover:bg-pastel-dark hover:text-pastel-bg">
                      <Link to="/shop">Browse All Products</Link>
                    </Button>
                  </div>
                </motion.div>
              )}

              {products.length > 0 && (
                <motion.div variants={itemVariants} className="text-center mt-12">
                  <Button asChild variant="outline" size="lg" className="border-pastel-dark text-pastel-accent hover:bg-pastel-dark hover:text-pastel-bg shadow-md">
                    <Link to="/shop">
                      Explore All Products <Heart size={18} className="ml-2 fill-current text-pastel-dark group-hover:text-pastel-bg" />
                    </Link>
                  </Button>
                </motion.div>
              )}
            </div>
          </section>

          {/* Categories Section */}
          <section className="py-16 md:py-24 bg-pastel-light">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-pastel-accent text-center mb-12">
                Discover Our Crafts
              </motion.h2>
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 text-center"
              >
                {['Crochet', 'Candles', 'Crafts', 'Clay', 'Concrete', 'Canvas'].map((category, index) => (
                  <motion.div 
                    key={category} 
                    variants={itemVariants}
                    custom={index}
                    className="animate-slide-in-up bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300 transform hover:-translate-y-1 cursor-pointer group"
                    style={{animationDelay: `${index * 0.08}s`}}
                  >
                    <Link to={`/shop?category=${category.toLowerCase()}`} className="block">
                      <div className="w-20 h-20 mx-auto bg-pastel-medium rounded-full flex items-center justify-center mb-4 group-hover:bg-pastel-dark transition-colors duration-300">
                        <Gift size={36} className="text-pastel-accent group-hover:text-white transition-colors duration-300" />
                      </div>
                      <h3 className="text-xl font-semibold text-pastel-accent group-hover:text-pastel-dark transition-colors duration-300">{category}</h3>
                    </Link>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
          
          {/* Instagram Feed Placeholder */}
          <section className="py-16 md:py-24 bg-pastel-bg">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <motion.h2 variants={itemVariants} className="text-3xl md:text-4xl font-bold text-pastel-accent text-center mb-12">
                Follow Our Journey @c_cube_eg
              </motion.h2>
              <motion.div 
                variants={containerVariants}
                className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4"
              >
                {[1, 2, 3, 4].map((i) => (
                  <motion.div 
                    key={i} 
                    variants={itemVariants} 
                    custom={i}
                    className="animate-slide-in-up aspect-square bg-pastel-medium rounded-lg shadow-md overflow-hidden group relative"
                    style={{animationDelay: `${i * 0.1}s`}}
                  >
                    <img  class="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-300" alt={`Instagram post placeholder ${i}`} src="https://images.unsplash.com/photo-1680504195875-2fe0b4ec2fd0" />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <Heart size={32} className="text-white" />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
              <motion.div variants={itemVariants} className="text-center mt-12">
                 <Button variant="outline" size="lg" className="border-pastel-dark text-pastel-accent hover:bg-pastel-dark hover:text-pastel-bg shadow-md" onClick={() => window.open('https://instagram.com/c_cube_eg', '_blank')}>
                   View on Instagram
                 </Button>
              </motion.div>
            </div>
          </section>
                </motion.div>
      );
    };

    export default ComingSoonPage;