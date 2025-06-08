import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Users, Package } from 'lucide-react';

const AboutPage = () => {
  const pageVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
    exit: { opacity: 0, y: -20, transition: { duration: 0.5, ease: "easeIn" } }
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
  };

  return (
    <motion.div 
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
      className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16 animate-fade-in"
    >
      <motion.h1 
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
        className="text-4xl md:text-5xl font-bold text-pastel-accent text-center mb-12"
      >
        Our Story: Handmade with Heart
      </motion.h1>

      <motion.section 
        variants={sectionVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }}
        className="mb-16 grid md:grid-cols-2 gap-12 items-center"
      >
        <div className="prose prose-lg max-w-none text-pastel-accent/90">
          <p className="lead text-xl">
            Welcome to C³ – C Cube, a small Egyptian handmade business built on creativity and love. I'm Tasneem, a developer by day and a craftswoman by heart.
            C Cube stands for our six main categories: Crochet, Candles, Crafts, Clay, Concrete, and Canvas.
          </p>
          <p>
            Each item is carefully handcrafted with a dreamy pastel aesthetic, soft hues, and a cozy, feminine touch.
            Whether you're buying a crochet bag, a pastel candle in a handmade concrete jar, or a hand-painted canvas tote, you're getting a piece of me — made with care and purpose.
          </p>
          <p>
            What started as a passion project quickly grew into a mission: to create meaningful, beautiful items that bring comfort, joy, and charm to everyday life — both online and in-person at bazaars across Egypt.
          </p>
        </div>
        <motion.div 
          className="rounded-xl overflow-hidden shadow-2xl"
          initial={{ scale: 0.8, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          viewport={{ once: true, amount: 0.3 }}
        >
          <img className="w-full h-auto object-cover" alt="Founder working on crafts" src="https://images.unsplash.com/photo-1607063696672-9dbc90ef3ebf" />
        </motion.div>
      </motion.section>

      <motion.section 
        variants={sectionVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }}
        className="py-16 bg-pastel-light rounded-xl shadow-lg"
      >
        <h2 className="text-3xl font-bold text-pastel-accent text-center mb-12">Our Values</h2>
        <div className="grid md:grid-cols-3 gap-8 text-center px-8">
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            viewport={{ once: true }}
          >
            <Heart size={48} className="mx-auto mb-4 text-pastel-dark" />
            <h3 className="text-2xl font-semibold text-pastel-accent mb-2">Heartmade with Passion</h3>
            <p className="text-pastel-accent/80">
              Every piece is made with intention and love. I pour my heart into every item, treating each one like a tiny pastel story.
            </p>
          </motion.div>
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Package size={48} className="mx-auto mb-4 text-pastel-dark" />
            <h3 className="text-2xl font-semibold text-pastel-accent mb-2">Quality + Aesthetic</h3>
            <p className="text-pastel-accent/80">
              From the materials to the packaging, everything is chosen with care. I make sure each item feels special and aligns with our soft, cozy aesthetic.
            </p>
          </motion.div>
          <motion.div 
            className="p-6"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            viewport={{ once: true }}
          >
            <Users size={48} className="mx-auto mb-4 text-pastel-dark" />
            <h3 className="text-2xl font-semibold text-pastel-accent mb-2">Community & Joy</h3>
            <p className="text-pastel-accent/80">
              Whether you find me online or at a local bazaar, I want you to feel like part of a little handmade family — where joy, creativity, and connection come first.
            </p>
          </motion.div>
        </div>
      </motion.section>

      <motion.section 
        variants={sectionVariants} 
        initial="hidden" 
        whileInView="visible" 
        viewport={{ once: true, amount: 0.3 }}
        className="mt-16 text-center"
      >
        <h2 className="text-3xl font-bold text-pastel-accent mb-6">Meet the Maker</h2>
        <div className="max-w-3xl mx-auto">
          <motion.div 
            className="w-40 h-40 mx-auto mb-6 rounded-full overflow-hidden shadow-xl border-4 border-pastel-medium"
            initial={{ scale: 0.5, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6, type: "spring", stiffness: 120 }}
            viewport={{ once: true }}
          >
            <img className="w-full h-full object-cover" alt="Portrait of the shop owner" src="https://images.unsplash.com/photo-1633887091219-265c29eac4cd" />
          </motion.div>
          <p className="text-xl text-pastel-accent/90 mb-4">
            Hi! I’m Tasneem, the hands and heart behind C³ – C Cube. As a developer who loves crafting, I started this business to bring beauty into everyday moments. Whether it's crocheting in the evening, pouring concrete molds, or designing a new candle scent, this shop is my creative haven — and now, I hope it's yours too. Thanks for being part of the journey!
          </p>
        </div>
      </motion.section>
    </motion.div>
  );
};

export default AboutPage;
