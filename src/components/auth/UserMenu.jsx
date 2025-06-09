import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, LogOut, Settings, ShoppingBag, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { getUserDisplayName, getUserInitials } from '../../utils/auth';
import { useToast } from '@/components/ui/use-toast';

const UserMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const { currentUser, logout } = useAuth();
  const { toast } = useToast();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      setIsOpen(false);
      toast({
        title: "Logged out successfully 👋",
        description: "See you next time!",
        duration: 3000,
      });
    } catch (error) {
      toast({
        title: "Logout Failed",
        description: "An error occurred while logging out. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  const menuItems = [
    {
      icon: <User size={16} />,
      label: 'Profile',
      action: () => {
        setIsOpen(false);
        // TODO: Navigate to profile page when implemented
        toast({
          title: "Coming Soon",
          description: "Profile page is under development.",
          duration: 3000,
        });
      }
    },
    {
      icon: <ShoppingBag size={16} />,
      label: 'My Orders',
      action: () => {
        setIsOpen(false);
        // TODO: Navigate to orders page when implemented
        toast({
          title: "Coming Soon",
          description: "Order history is under development.",
          duration: 3000,
        });
      }
    },
    {
      icon: <Settings size={16} />,
      label: 'Settings',
      action: () => {
        setIsOpen(false);
        // TODO: Navigate to settings page when implemented
        toast({
          title: "Coming Soon",
          description: "Settings page is under development.",
          duration: 3000,
        });
      }
    }
  ];

  if (!currentUser) return null;

  return (
    <div className="relative" ref={menuRef}>
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 text-pastel-accent hover:text-pastel-dark hover:bg-pastel-medium/50 px-3 py-2 rounded-lg transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 bg-pastel-accent text-white rounded-full flex items-center justify-center text-sm font-semibold">
          {getUserInitials(currentUser)}
        </div>
        
        {/* User Name (hidden on mobile) */}
        <span className="hidden md:block text-sm font-medium max-w-24 truncate">
          {getUserDisplayName(currentUser)}
        </span>
        
        {/* Dropdown Arrow */}
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={16} />
        </motion.div>
      </Button>

      {/* Dropdown Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-2 w-48 bg-white/95 backdrop-blur-md rounded-lg shadow-lg border border-pastel-medium/20 py-2 z-50"
          >
            {/* User Info Header */}
            <div className="px-4 py-2 border-b border-pastel-medium/20">
              <p className="text-sm font-medium text-pastel-accent truncate">
                {getUserDisplayName(currentUser)}
              </p>
              <p className="text-xs text-pastel-dark/70 truncate">
                {currentUser.email}
              </p>
            </div>

            {/* Menu Items */}
            <div className="py-1">
              {menuItems.map((item, index) => (
                <button
                  key={index}
                  onClick={item.action}
                  className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-pastel-accent hover:bg-pastel-medium/30 transition-colors"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>

            {/* Logout Button */}
            <div className="border-t border-pastel-medium/20 pt-1">
              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default UserMenu;
