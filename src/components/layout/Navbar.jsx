import React, { useState } from 'react';
    import { Link, NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Menu, X, ShoppingBag } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import CCubeLogo from '@/assets/CCubeLogo';
    import C_Cube_Logo from '@/assets/C-Cube-Logo.png'

    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);

      const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Contact', path: '/contact' },
      ];

      const linkVariants = {
        hover: {
          scale: 1.1,
          color: '#F2BED1',
          transition: { duration: 0.2 }
        },
        tap: { scale: 0.95 }
      };
      
      const mobileLinkVariants = {
        open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } },
        closed: { opacity: 0, y: 20, transition: { duration: 0.2 } }
      };

      return (
        <motion.nav
          initial={{ y: -100 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className="bg-pastel-light/80 backdrop-blur-md shadow-md sticky top-0 z-50"
        >
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link to="/" className="flex items-center space-x-2">
                  <img src={C_Cube_Logo} alt="C Cube Logo" className="h-20 w-20 text-pastel-accent" />
                  <span className="font-heading text-2xl font-bold text-pastel-accent">C Cube</span>
              </Link>

              <div className="hidden md:flex items-center space-x-6">
                {navLinks.map((link) => (
                  <motion.div key={link.name} variants={linkVariants} whileHover="hover" whileTap="tap">
                    <NavLink
                      to={link.path}
                      className={({ isActive }) =>
                        `text-pastel-accent hover:text-pastel-dark transition-colors duration-300 pb-1 ${
                          isActive ? 'font-semibold border-b-2 border-pastel-dark' : ''
                        }`
                      }
                    >
                      {link.name}
                    </NavLink>
                  </motion.div>
                ))}
              </div>

              <div className="hidden md:flex items-center">
                <Button variant="ghost" size="icon" className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50">
                  <ShoppingBag size={24} />
                </Button>
              </div>

              <div className="md:hidden flex items-center">
                 <Button variant="ghost" size="icon" className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 mr-2">
                  <ShoppingBag size={24} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setIsOpen(!isOpen)}
                  className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50"
                  aria-label="Toggle menu"
                >
                  {isOpen ? <X size={28} /> : <Menu size={28} />}
                </Button>
              </div>
            </div>
          </div>

          {/* Mobile Menu */}
          <motion.div
            initial={false}
            animate={isOpen ? "open" : "closed"}
            variants={{
              open: { opacity: 1, height: "auto", transition: { staggerChildren: 0.05, delayChildren: 0.2 }},
              closed: { opacity: 0, height: 0, transition: { staggerChildren: 0.05, staggerDirection: -1 }}
            }}
            className="md:hidden bg-pastel-light/95 backdrop-blur-sm"
          >
            <div className="px-4 pt-2 pb-4 space-y-1 sm:px-6">
              {navLinks.map((link) => (
                <motion.div key={link.name} variants={mobileLinkVariants}>
                  <NavLink
                    to={link.path}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) =>
                      `block px-3 py-2 rounded-md text-base font-medium transition-colors duration-300 ${
                        isActive ? 'bg-pastel-medium text-pastel-accent font-semibold' : 'text-pastel-accent hover:bg-pastel-dark/30 hover:text-pastel-accent'
                      }`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.nav>
      );
    };

    export default Navbar;