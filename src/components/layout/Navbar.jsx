import React, { useState } from 'react';
    import { Link, NavLink } from 'react-router-dom';
    import { motion } from 'framer-motion';
    import { Menu, X, ShoppingBag, LogIn, UserPlus } from 'lucide-react';
    import { Button } from '@/components/ui/button';
    import C_Cube_Logo from '@/assets/C-Cube-Logo.png';
    import { useCart } from '../../contexts/CartContext';
    import { useAuth } from '../../contexts/AuthContext';
    import AuthModal from '../auth/AuthModal';
    import UserMenu from '../auth/UserMenu';
    import { Heart } from 'lucide-react';
    import { useWishlist } from '../../contexts/WishlistContext';

    

    const Navbar = () => {
      const [isOpen, setIsOpen] = useState(false);
      const [authModalOpen, setAuthModalOpen] = useState(false);
      const [authMode, setAuthMode] = useState('login');
      const { itemCount, isLoading } = useCart();
      const { currentUser } = useAuth();
      const { wishlist } = useWishlist();

      const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Shop', path: '/shop' },
        { name: 'About', path: '/about' },
        { name: 'Custom Orders', path: '/custom-orders' },
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

      const handleOpenAuthModal = (mode) => {
        setAuthMode(mode);
        setAuthModalOpen(true);
      };

      const handleCloseAuthModal = () => {
        setAuthModalOpen(false);
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

              <div className="hidden md:flex items-center space-x-3">
                {/* Cart Button */}
                <Button asChild variant="ghost" size="icon" className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 relative">
                  <Link to="/cart">
                    <ShoppingBag size={24} />
                    {isLoading ? (
                      <span className="absolute -top-1 -right-1 bg-pastel-accent text-pastel-bg text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border border-pastel-bg border-t-transparent"></div>
                      </span>
                    ) : itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pastel-accent text-pastel-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
                {/* Wishlist Button */}
<Button asChild variant="ghost" size="icon" className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 relative">
  <Link to="/wishlist">
    <Heart size={24} />
    {wishlist.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-pastel-accent text-pastel-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
        {wishlist.length > 99 ? '99+' : wishlist.length}
      </span>
    )}
  </Link>
</Button>

                {/* Authentication Section */}
                {currentUser ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="ghost"
                      onClick={() => handleOpenAuthModal('login')}
                      className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 px-3 py-2"
                    >
                      <LogIn size={18} className="mr-2" />
                      Sign In
                    </Button>
                    <Button
                      onClick={() => handleOpenAuthModal('signup')}
                      className="bg-pastel-accent hover:bg-pastel-dark text-white px-4 py-2"
                    >
                      <UserPlus size={18} className="mr-2" />
                      Sign Up
                    </Button>
                  </div>
                )}
              </div>

              <div className="md:hidden flex items-center space-x-2">
                {/* Cart Button */}
                <Button asChild variant="ghost" size="icon" className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 relative">
                  <Link to="/cart">
                    <ShoppingBag size={24} />
                    {isLoading ? (
                      <span className="absolute -top-1 -right-1 bg-pastel-accent text-pastel-bg text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        <div className="animate-spin rounded-full h-3 w-3 border border-pastel-bg border-t-transparent"></div>
                      </span>
                    ) : itemCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-pastel-accent text-pastel-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                        {itemCount > 99 ? '99+' : itemCount}
                      </span>
                    )}
                  </Link>
                </Button>
                {/* Wishlist Button (Mobile) */}
<Button asChild variant="ghost" size="icon" className="text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 relative">
  <Link to="/wishlist">
    <Heart size={24} />
    {wishlist.length > 0 && (
      <span className="absolute -top-1 -right-1 bg-pastel-accent text-pastel-bg text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
      {wishlist.length > 99 ? '99+' : wishlist.length}
      </span>
    )}
  </Link>
</Button>


                {/* User Menu for Mobile (if authenticated) */}
                {currentUser && <UserMenu />}

                {/* Menu Toggle Button */}
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

              {/* Authentication buttons for mobile (only show if not authenticated) */}
              {!currentUser && (
                <motion.div variants={mobileLinkVariants} className="pt-4 border-t border-pastel-medium/20">
                  <div className="space-y-2">
                    <Button
                      variant="ghost"
                      onClick={() => {
                        setIsOpen(false);
                        handleOpenAuthModal('login');
                      }}
                      className="w-full justify-start text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/30 px-3 py-2"
                    >
                      <LogIn size={18} className="mr-3" />
                      Sign In
                    </Button>
                    <Button
                      onClick={() => {
                        setIsOpen(false);
                        handleOpenAuthModal('signup');
                      }}
                      className="w-full bg-pastel-accent hover:bg-pastel-dark text-white px-3 py-2"
                    >
                      <UserPlus size={18} className="mr-3" />
                      Sign Up
                    </Button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          {/* Authentication Modal */}
          <AuthModal
            isOpen={authModalOpen}
            onClose={handleCloseAuthModal}
            initialMode={authMode}
          />
        </motion.nav>
      );
    };

    export default Navbar;