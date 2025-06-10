import React from 'react';
    import { Link } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
    import C_Cube_Logo from '@/assets/C-Cube-Logo.png'
    import { Heart } from 'lucide-react';

    const ComingSoonFooter = () => {
      const socialLinks = [
        { icon: <Instagram size={24} />, href: "https://www.instagram.com/c_cube_eg/", label: "Instagram" },
        { icon: <Facebook size={24} />, href: "https://facebook.com", label: "Facebook" },
      ];

      const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
      };

      return (
        <motion.footer 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          transition={{ staggerChildren: 0.2 }}
          className="bg-pastel-medium text-pastel-accent py-12"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
              <motion.div variants={itemVariants} className="flex flex-col items-center md:items-start">
                <Link to="/" className="flex items-center space-x-2 mb-4">
                  <img src={C_Cube_Logo} alt="C Cube Logo" className="h-20 w-20 text-pastel-accent" />
                  <span className="font-heading text-2xl font-bold">C³ – C Cube</span>
                </Link>
                <p className="text-sm text-center md:text-left">Handmade with heart – across six sides.</p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col items-center">
                <span className="font-semibold mb-4 text-6xl"><a href="./" className="hover:text-pastel-bg transition-colors"></a></span>
                
              </motion.div>

              <motion.div variants={itemVariants} className="flex flex-col items-center md:items-end">
                <span className="font-semibold mb-4 text-lg">Connect With Us</span>
                <div className="flex space-x-4 mb-4">
                  {socialLinks.map((link, index) => (
                    <motion.a
                      key={index}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={link.label}
                      whileHover={{ scale: 1.2, color: '#F9F5F6' }}
                      whileTap={{ scale: 0.9 }}
                      className="text-pastel-accent hover:text-pastel-bg transition-colors"
                    >
                      {link.icon}
                    </motion.a>
                  ))}
                </div>
                {/* <a href="mailto:hello@ccube.com" className="flex items-center space-x-2 hover:text-pastel-bg transition-colors">
                  <Mail size={20} />
                  <span>hello@ccube.com</span>
                </a> */}
              </motion.div>
            </div>
            <motion.div 
              variants={itemVariants}
              className="mt-10 pt-8 border-t border-pastel-dark/50 text-center text-sm"
            >
              <p>&copy; {new Date().getFullYear()} C³ – C Cube. All rights reserved. Crafted with care.</p>
            </motion.div>
          </div>
        </motion.footer>
      );
    };

    export default ComingSoonFooter;