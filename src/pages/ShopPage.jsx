import React, { useState, useEffect, useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { Button } from '../components/ui/button';
import { Filter, X } from 'lucide-react';
import { Checkbox } from "../components/ui/checkbox";
import { Label } from "../components/ui/label";
import { Slider } from "../components/ui/slider";
import { useToast } from "../components/ui/use-toast";
import { db } from '../firebase.js';
import { collection, getDocs } from 'firebase/firestore';
import { addSampleProducts } from '../utils/sampleProducts.js';
import { fetchAllProducts } from '../utils/fetchProducts.js';

const categories = ['All', 'Crochet', 'Candles', 'Crafts', 'Clay', 'Concrete', 'Canvas'];

const ShopPage = () => {
  const location = useLocation();
  const { toast } = useToast();
  const [allProducts, setAllProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState(['All']);
  const [priceRange, setPriceRange] = useState([0, 1000]);
  const [dynamicPriceRange, setDynamicPriceRange] = useState([0, 1000]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingProducts, setAddingProducts] = useState(false);

  // Helper function to extract all possible prices from a product
  const getProductPrices = (product) => {
    const prices = [];

    if (typeof product.price === 'string') {
      // Single price as string
      const price = parseFloat(product.price);
      if (!isNaN(price)) {
        prices.push(price);
      }
    } else if (typeof product.price === 'number') {
      // Single price as number
      prices.push(product.price);
    } else if (typeof product.price === 'object' && product.price !== null) {
      // Price map for different sizes
      Object.values(product.price).forEach(price => {
        const numPrice = parseFloat(price);
        if (!isNaN(numPrice)) {
          prices.push(numPrice);
        }
      });
    }

    return prices;
  };

  // Calculate dynamic price range from all products
  const calculateDynamicPriceRange = (products) => {
    if (!products || products.length === 0) {
      return [0, 1000];
    }

    let minPrice = Infinity;
    let maxPrice = -Infinity;

    products.forEach(product => {
      const prices = getProductPrices(product);
      prices.forEach(price => {
        minPrice = Math.min(minPrice, price);
        maxPrice = Math.max(maxPrice, price);
      });
    });

    // If no valid prices found, use default range
    if (minPrice === Infinity || maxPrice === -Infinity) {
      return [0, 1000];
    }

    // Add some padding to the range
    const padding = (maxPrice - minPrice) * 0.1;
    const finalMin = Math.max(0, Math.floor(minPrice - padding));
    const finalMax = Math.ceil(maxPrice + padding);

    return [finalMin, finalMax];
  };

  // Check if a product matches the price range
  const productMatchesPriceRange = (product, priceRange) => {
    const prices = getProductPrices(product);

    // If no valid prices, exclude the product
    if (prices.length === 0) {
      return false;
    }

    // Check if any of the product's prices fall within the range
    return prices.some(price => price >= priceRange[0] && price <= priceRange[1]);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('🔍 Fetching products from Firestore with flexible structure detection...');

        // Try the flexible fetching first
        const result = await fetchAllProducts();

        if (result.success) {
          setAllProducts(result.products);

          // Update dynamic price range
          const newPriceRange = calculateDynamicPriceRange(result.products);
          setDynamicPriceRange(newPriceRange);
          setPriceRange(newPriceRange);
        } else {
          // Fallback to simple approach
          const querySnapshot = await getDocs(collection(db, "products"));
          const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));

          setAllProducts(products);

          // Update dynamic price range for fallback case too
          const newPriceRange = calculateDynamicPriceRange(products);
          setDynamicPriceRange(newPriceRange);
          setPriceRange(newPriceRange);
        }
      } catch (err) {
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

        // Refresh the products list using flexible fetching
        const refreshResult = await fetchAllProducts();
        if (refreshResult.success) {
          setAllProducts(refreshResult.products);
          // Update dynamic price range
          const newPriceRange = calculateDynamicPriceRange(refreshResult.products);
          setDynamicPriceRange(newPriceRange);
          setPriceRange(newPriceRange);
        } else {
          // Fallback to simple approach
          const querySnapshot = await getDocs(collection(db, "products"));
          const products = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          }));
          setAllProducts(products);
          // Update dynamic price range for fallback case too
          const newPriceRange = calculateDynamicPriceRange(products);
          setDynamicPriceRange(newPriceRange);
          setPriceRange(newPriceRange);
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

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const categoryFromUrl = params.get('category');
    if (categoryFromUrl && categories.map(c => c.toLowerCase()).includes(categoryFromUrl)) {
      const capitalizedCategory = categoryFromUrl.charAt(0).toUpperCase() + categoryFromUrl.slice(1);
      setSelectedCategories([capitalizedCategory]);
    } else {
      setSelectedCategories(['All']);
    }
  }, [location.search]);

  const handleCategoryChange = (category) => {
    setSelectedCategories(prev => {
      if (category === 'All') return ['All'];
      const newCategories = prev.includes('All') ? [] : [...prev];
      if (newCategories.includes(category)) {
        const filtered = newCategories.filter(c => c !== category);
        return filtered.length === 0 ? ['All'] : filtered;
      } else {
        return [...newCategories, category];
      }
    });
  };

  const filteredProducts = useMemo(() => {
    const filtered = allProducts.filter(product => {
      // Category filtering logic
      let categoryMatch = false;

      if (selectedCategories.includes('All')) {
        categoryMatch = true;
      } else {
        // Check each selected category
        for (const selectedCategory of selectedCategories) {
          const categoryLower = selectedCategory.toLowerCase();
          const productCategory = product.category || '';
          const productId = product.id || '';

          // Check if product category starts with selected category (case insensitive)
          const categoryStartsMatch = productCategory.toLowerCase().startsWith(categoryLower);

          // Check if product ID starts with category prefix (e.g., "cro" for Crochet)
          let idPrefixMatch = false;
          if (categoryLower === 'crochet') {
            idPrefixMatch = productId.toLowerCase().startsWith('cro');
          } else if (categoryLower === 'candles') {
            idPrefixMatch = productId.toLowerCase().startsWith('cand');
          } else if (categoryLower === 'crafts') {
            idPrefixMatch = productId.toLowerCase().startsWith('cra');
          } else if (categoryLower === 'clay') {
            idPrefixMatch = productId.toLowerCase().startsWith('cla');
          } else if (categoryLower === 'concrete') {
            idPrefixMatch = productId.toLowerCase().startsWith('con');
          } else if (categoryLower === 'canvas') {
            idPrefixMatch = productId.toLowerCase().startsWith('canv');
          }

          // Also check exact category match
          const exactCategoryMatch = productCategory.toLowerCase() === categoryLower;

          if (categoryStartsMatch || idPrefixMatch || exactCategoryMatch) {
            categoryMatch = true;
            break;
          }
        }
      }

      // Price filtering - handle both string prices and price maps
      const priceMatch = productMatchesPriceRange(product, priceRange);

      return categoryMatch && priceMatch;
    });

    return filtered;
  }, [selectedCategories, priceRange, allProducts]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 animate-fade-in">
      <motion.h1 
        initial={{ opacity:0, y: -30 }}
        animate={{ opacity:1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold text-pastel-accent text-center mb-12"
      >
        Our Handmade Collection
      </motion.h1>

      <div className="flex flex-col md:flex-row gap-8">
        <motion.aside 
          initial={{ opacity:0, x: -50 }}
          animate={{ opacity:1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className={`md:w-1/4 bg-pastel-light p-6 rounded-xl shadow-lg md:sticky md:top-24 h-fit ${isFilterOpen ? 'block' : 'hidden'} md:block`}
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-pastel-accent">Filters</h2>
            <Button variant="ghost" size="icon" className="md:hidden text-pastel-accent" onClick={() => setIsFilterOpen(false)}>
              <X size={24} />
            </Button>
          </div>
          
          <div className="mb-8">
            <h3 className="text-lg font-medium text-pastel-accent mb-3">Categories</h3>
            <div className="space-y-2">
              {categories.map((category) => (
                <div key={category} className="flex items-center space-x-2">
                  <Checkbox
                    id={category}
                    checked={selectedCategories.includes(category)}
                    onCheckedChange={() => handleCategoryChange(category)}
                    className="data-[state=checked]:bg-pastel-dark data-[state=checked]:text-pastel-bg border-pastel-medium"
                  />
                  <Label htmlFor={category} className="text-pastel-accent/90 cursor-pointer hover:text-pastel-dark">{category}</Label>
                </div>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-medium text-pastel-accent mb-3">Price Range</h3>
            <Slider
              defaultValue={dynamicPriceRange}
              min={dynamicPriceRange[0]}
              max={dynamicPriceRange[1]}
              step={1}
              value={priceRange}
              onValueChange={setPriceRange}
              className="[&>span:first-child]:h-1 [&>span:first-child]:bg-pastel-medium [&_[role=slider]]:bg-pastel-dark [&_[role=slider]]:border-pastel-dark [&_[role=slider]]:shadow-md"
            />
            <div className="flex justify-between text-sm text-pastel-accent/80 mt-2">
              <span>${priceRange[0]}</span>
              <span>${priceRange[1]}</span>
            </div>
            <div className="text-xs text-pastel-accent/60 mt-1 text-center">
              Range: ${dynamicPriceRange[0]} - ${dynamicPriceRange[1]}
            </div>
          </div>
        </motion.aside>

        <main className="md:w-3/4">
          <div className="md:hidden mb-6 flex justify-end">
            <Button variant="outline" className="border-pastel-dark text-pastel-accent" onClick={() => setIsFilterOpen(true)}>
              <Filter size={18} className="mr-2" /> Filters
            </Button>
          </div>



          {loading ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-accent"></div>
              <p className="mt-4 text-lg text-pastel-accent/70">Loading products...</p>
            </motion.div>
          ) : error ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <p className="text-xl text-red-500 mb-4">{error}</p>
              <Button
                onClick={() => window.location.reload()}
                className="bg-pastel-dark text-white hover:bg-pastel-accent"
              >
                Try Again
              </Button>
            </motion.div>
          ) : filteredProducts.length > 0 ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredProducts.map((product, index) => (
                <motion.div key={product.id} variants={itemVariants} custom={index} className="animate-slide-in-up" style={{animationDelay: `${index * 0.05}s`}}>
                  <ProductCard product={product} />
                </motion.div>
              ))}
            </motion.div>
          ) : allProducts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-20"
            >
              <p className="text-xl text-pastel-accent/70 mb-4">No products found in the database.</p>
              <p className="text-sm text-pastel-accent/50 mb-6">Add some products to Firestore to see them here!</p>
              <div className="flex justify-center">
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
              </div>
            </motion.div>
          ) : (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center text-xl text-pastel-accent/70 py-10"
            >
              No products match your current filters. Try adjusting them!
            </motion.p>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopPage;
