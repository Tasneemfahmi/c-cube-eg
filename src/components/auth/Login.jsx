import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, formatAuthError } from '../../utils/auth';
import { useToast } from '@/components/ui/use-toast';
import SocialLoginButtons from './SocialLoginButtons';

const Login = ({ onSwitchToSignup, onClose }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { login, resetPassword } = useAuth();
  const { toast } = useToast();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await login(formData.email, formData.password);
      toast({
        title: "Welcome back! 👋",
        description: "You've successfully logged in.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Login Failed",
        description: formatAuthError(error),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!formData.email) {
      setErrors({ email: 'Please enter your email address first' });
      return;
    }

    if (!validateEmail(formData.email)) {
      setErrors({ email: 'Please enter a valid email address' });
      return;
    }

    try {
      await resetPassword(formData.email);
      toast({
        title: "Password Reset Email Sent 📧",
        description: "Check your email for password reset instructions.",
        duration: 5000,
      });
    } catch (error) {
      toast({
        title: "Reset Failed",
        description: formatAuthError(error),
        variant: "destructive",
        duration: 5000,
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto"
    >
      {/* Another Divider */}
 <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t border-pastel-medium/30" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="px-2 text-pastel-accent/60">
            Continue with email
          </span>
        </div>
      </div>
      

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email Field */}
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-pastel-accent mb-1">
            Email Address
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-dark/50" size={18} />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pastel-accent focus:border-transparent transition-colors ${
                errors.email ? 'border-red-500' : 'border-pastel-medium'
              } bg-white/50 backdrop-blur-sm`}
              placeholder="Enter your email"
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-red-500 text-sm mt-1">{errors.email}</p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-pastel-accent mb-1">
            Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-dark/50" size={18} />
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pastel-accent focus:border-transparent transition-colors ${
                errors.password ? 'border-red-500' : 'border-pastel-medium'
              } bg-white/50 backdrop-blur-sm`}
              placeholder="Enter your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-dark/50 hover:text-pastel-accent transition-colors"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.password && (
            <p className="text-red-500 text-sm mt-1">{errors.password}</p>
          )}
        </div>

        {/* Forgot Password */}
        <div className="text-right">
          <button
            type="button"
            onClick={handleForgotPassword}
            className="text-sm text-pastel-accent hover:text-pastel-dark transition-colors"
            disabled={isLoading}
          >
            Forgot your password?
          </button>
        </div>
{/* Social Login Buttons */}
<SocialLoginButtons
        onClose={onClose}
        isLoading={isLoading}
        mode="login"
      />
        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full bg-pastel-accent hover:bg-pastel-dark text-white py-3 rounded-lg transition-colors"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="animate-spin mr-2" size={18} />
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </Button>

        {/* Switch to Signup */}
        <div className="text-center pt-4">
          <p className="text-pastel-dark/70">
            Don't have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToSignup}
              className="text-pastel-accent hover:text-pastel-dark font-medium transition-colors"
              disabled={isLoading}
            >
              Sign up here
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default Login;
