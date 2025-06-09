import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Login from './Login';
import SignUp from './SignUp';

const AuthModal = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState(initialMode);

  // Update mode when initialMode changes
  useEffect(() => {
    setMode(initialMode);
  }, [initialMode]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : 'unset';
    return () => (document.body.style.overflow = 'unset');
  }, [isOpen]);

  useEffect(() => {
    const handleEscape = (e) => e.key === 'Escape' && handleClose();
    if (isOpen) window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen]);

  const handleSwitchToSignup = () => setMode('signup');
  const handleSwitchToLogin = () => setMode('login');
  const handleClose = () => {
    setMode('login');
    onClose();
  };

  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
        onClick={handleClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 30 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-[#F2BED1]/40 backdrop-blur-lg overflow-hidden"
        >
          {/* Top Accent Gradient */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FDCEDF] via-[#F2BED1] to-[#FDCEDF]" />

          {/* Close Button */}
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClose}
            className="absolute top-4 right-4 text-[#2e474a]/60 hover:text-[#2e474a] hover:bg-[#FDCEDF]/30 rounded-full transition"
          >
            <X size={20} />
          </Button>

          {/* Modal Header */}
          <div className="text-center pt-8 px-8 pb-4">
            <h2 className="text-2xl font-heading font-bold text-pastel-accent mb-2">
              {mode === 'login' ? 'Welcome Back!' : 'Join C Cube'}
            </h2>
          </div>

          {/* Inner Content */}
          <div className="px-8 pb-8">
            <AnimatePresence mode="wait">
              {mode === 'login' ? (
                <Login
                  key="login"
                  onSwitchToSignup={handleSwitchToSignup}
                  onClose={handleClose}
                  hideHeader={true}
                />
              ) : (
                <SignUp
                  key="signup"
                  onSwitchToLogin={handleSwitchToLogin}
                  onClose={handleClose}
                  hideHeader={true}
                />
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
};

export default AuthModal;
