import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { formatAuthError } from '../../utils/auth';
import { useToast } from '@/components/ui/use-toast';

// Google and Facebook icons as SVG components
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
    <path
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      fill="#4285F4"
    />
    <path
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      fill="#34A853"
    />
    <path
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      fill="#FBBC05"
    />
    <path
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      fill="#EA4335"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const SocialLoginButtons = ({ onClose, isLoading: parentLoading, mode = 'login' }) => {
  const [googleLoading, setGoogleLoading] = useState(false);
  const [facebookLoading, setFacebookLoading] = useState(false);
  const { signInWithGoogle, signInWithFacebook } = useAuth();
  const { toast } = useToast();

  const isAnyLoading = parentLoading || googleLoading || facebookLoading;

  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    try {
      await signInWithGoogle();
      toast({
        title: "Welcome! 🎉",
        description: `You've successfully ${mode === 'signup' ? 'signed up' : 'signed in'} with Google.`,
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Google Sign In Failed",
        description: formatAuthError(error),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setGoogleLoading(false);
    }
  };

  const handleFacebookSignIn = async () => {
    setFacebookLoading(true);
    try {
      await signInWithFacebook();
      toast({
        title: "Welcome! 🎉",
        description: `You've successfully ${mode === 'signup' ? 'signed up' : 'signed in'} with Facebook.`,
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Facebook Sign In Failed",
        description: formatAuthError(error),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setFacebookLoading(false);
    }
  };

  return (
    <div className="space-y-3">
      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-pastel-medium/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-pastel-accent/60">
            Or continue with
          </span>
        </div>
      </div>

      {/* Social Login Buttons */}
      <div className="grid grid-cols-1 gap-3">
        {/* Google Sign In */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleGoogleSignIn}
            disabled={isAnyLoading}
            className="w-full border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {googleLoading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <GoogleIcon />
            )}
            <span className="ml-3">
              {mode === 'signup' ? 'Sign up' : 'Sign in'} with Google
            </span>
          </Button>
        </motion.div>

        {/* Facebook Sign In */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Button
            type="button"
            variant="outline"
            onClick={handleFacebookSignIn}
            disabled={isAnyLoading}
            className="w-full border-blue-300 bg-white hover:bg-blue-50 text-gray-700 font-medium py-3 px-4 rounded-lg transition-colors"
          >
            {facebookLoading ? (
              <Loader2 className="animate-spin mr-2" size={18} />
            ) : (
              <FacebookIcon />
            )}
            <span className="ml-3">
              {mode === 'signup' ? 'Sign up' : 'Sign in'} with Facebook
            </span>
          </Button>
        </motion.div>
      </div>

      
    </div>
  );
};

export default SocialLoginButtons;
