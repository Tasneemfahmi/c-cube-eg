import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Heart, Gift } from 'lucide-react';
import { useToast } from "@/components/ui/use-toast";

// Fallback placeholder products (no Firestore dependency)
const placeholderProducts = [
  { id: 1, name: "Pastel Crochet Bag", category: "Crochet", price: "25.00", imageSrc: "crochet_bag_pastel", description: "A charming handmade crochet bag in soft pastel hues." },
  { id: 2, name: "Scented Soy Candle", category: "Candles", price: "15.00", imageSrc: "scented_candle_pastel", description: "Relaxing scented soy candle, perfect for cozy evenings." },
  { id: 3, name: "Clay Trinket Dish", category: "Clay", price: "12.00", imageSrc: "clay_trinket_dish", description: "Cute clay dish for your tiny treasures." },
  { id: 4, name: "Mini Canvas Art", category: "Canvas", price: "30.00", imageSrc: "mini_canvas_art_abstract", description: "Unique abstract mini canvas art to brighten your space." },
];

const ComingSoonPage = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false); // No Firestore = no loading needed
  const [products, setProducts] = useState(placeholderProducts); // Use placeholders directly

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

          <motion.div
            variants={containerVariants}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {products.map((product, index) => (
              <motion.div 
                key={product.id} 
                variants={itemVariants} 
                custom={index} 
                className="animate-slide-in-up" 
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <img 
                    src={`/images/${product.imageSrc}.jpg`} 
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="p-4">
                    <h3 className="font-bold text-pastel-accent">{product.name}</h3>
                    <p className="text-pastel-dark">${product.price}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="text-center mt-12">
            <Button 
              asChild 
              variant="outline" 
              size="lg" 
              className="border-pastel-dark text-pastel-accent hover:bg-pastel-dark hover:text-pastel-bg shadow-md"
            >
              <Link to="/shop">
                Explore All Products <Heart size={18} className="ml-2 fill-current text-pastel-dark group-hover:text-pastel-bg" />
              </Link>
            </Button>
          </motion.div>
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
                style={{ animationDelay: `${index * 0.08}s` }}
              >
                <Link to={`/shop?category=${category.toLowerCase()}`} className="block">
                  <div className="w-20 h-20 mx-auto bg-pastel-medium rounded-full flex items-center justify-center mb-4 group-hover:bg-pastel-dark transition-colors duration-300">
                    <Gift size={36} className="text-pastel-accent group-hover:text-white transition-colors duration-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-pastel-accent group-hover:text-pastel-dark transition-colors duration-300">
                    {category}
                  </h3>
                </Link>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default ComingSoonPage;