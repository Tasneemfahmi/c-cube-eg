import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import AuthModal from '../components/auth/AuthModal';

const AuthTestPage = () => {
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const { currentUser, logout } = useAuth();

  const handleOpenAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleCloseAuthModal = () => {
    setAuthModalOpen(false);
  };

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-pastel-bg py-12">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-2xl mx-auto text-center"
        >
          <h1 className="text-4xl font-heading font-bold text-pastel-accent mb-8">
            Authentication Test Page
          </h1>

          {currentUser ? (
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-pastel-accent mb-4">
                Welcome, {currentUser.displayName || currentUser.email}!
              </h2>
              <div className="space-y-4">
                <div className="text-left bg-pastel-light/50 rounded-lg p-4">
                  <h3 className="font-semibold text-pastel-accent mb-2">User Information:</h3>
                  <p><strong>Email:</strong> {currentUser.email}</p>
                  <p><strong>Display Name:</strong> {currentUser.displayName || 'Not set'}</p>
                  <p><strong>Email Verified:</strong> {currentUser.emailVerified ? 'Yes' : 'No'}</p>
                  <p><strong>User ID:</strong> {currentUser.uid}</p>
                  <p><strong>Provider:</strong> {currentUser.providerData?.[0]?.providerId || 'Unknown'}</p>
                  <p><strong>Photo URL:</strong> {currentUser.photoURL ? 'Yes' : 'No'}</p>
                  <p><strong>Created:</strong> {new Date(currentUser.metadata.creationTime).toLocaleDateString()}</p>
                  <p><strong>Last Sign In:</strong> {new Date(currentUser.metadata.lastSignInTime).toLocaleDateString()}</p>
                </div>
                <Button
                  onClick={handleLogout}
                  variant="destructive"
                  className="w-full"
                >
                  Sign Out
                </Button>
              </div>
            </div>
          ) : (
            <div className="bg-white/50 backdrop-blur-sm rounded-lg p-8 shadow-lg">
              <h2 className="text-2xl font-semibold text-pastel-accent mb-6">
                You are not signed in
              </h2>
              <div className="space-y-4">
                <Button
                  onClick={() => handleOpenAuthModal('login')}
                  className="w-full bg-pastel-accent hover:bg-pastel-dark text-white"
                >
                  Test Login Modal
                </Button>
                <Button
                  onClick={() => handleOpenAuthModal('signup')}
                  variant="outline"
                  className="w-full border-pastel-accent text-pastel-accent hover:bg-pastel-accent hover:text-white"
                >
                  Test Sign Up Modal
                </Button>
              </div>
              <div className="mt-4 p-4 bg-pastel-light/50 rounded-lg">
                <p className="text-sm text-pastel-dark/80 mb-2">
                  <strong>Testing Instructions:</strong>
                </p>
                <ul className="text-sm text-pastel-dark/70 space-y-1">
                  <li>• "Test Login Modal" should show "Welcome Back!" header</li>
                  <li>• "Test Sign Up Modal" should show "Join C Cube" header</li>
                  <li>• Both should have Google and Facebook login options</li>
                  <li>• You can also test via the navbar buttons</li>
                </ul>
              </div>
            </div>
          )}

          <div className="mt-8 text-sm text-pastel-dark/70">
            <p>This page is for testing the authentication system.</p>
            <p>You can also use the authentication buttons in the navbar.</p>
            <p className="mt-2 font-medium">✨ Now supports Google and Facebook login!</p>
          </div>
        </motion.div>
      </div>

      {/* Authentication Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={handleCloseAuthModal}
        initialMode={authMode}
      />
    </div>
  );
};

export default AuthTestPage;
