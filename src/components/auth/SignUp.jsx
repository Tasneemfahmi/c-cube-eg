import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, User, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';
import { validateEmail, validatePassword, validateDisplayName, formatAuthError } from '../../utils/auth';
import { useToast } from '@/components/ui/use-toast';
import SocialLoginButtons from './SocialLoginButtons';

const SignUp = ({ onSwitchToLogin, onClose }) => {
  const [formData, setFormData] = useState({
    displayName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const { signup } = useAuth();
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

    // Validate display name
    const nameValidation = validateDisplayName(formData.displayName);
    if (!nameValidation.isValid) {
      newErrors.displayName = nameValidation.error;
    }

    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    // Validate password
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else {
      const passwordValidation = validatePassword(formData.password);
      if (!passwordValidation.isValid) {
        newErrors.password = passwordValidation.errors[0]; // Show first error
      }
    }

    // Validate confirm password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    try {
      await signup(formData.email, formData.password, formData.displayName);
      toast({
        title: "Welcome to C Cube! 🎉",
        description: "Your account has been created successfully.",
        duration: 3000,
      });
      onClose();
    } catch (error) {
      toast({
        title: "Sign Up Failed",
        description: formatAuthError(error),
        variant: "destructive",
        duration: 5000,
      });
    } finally {
      setIsLoading(false);
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
        {/* Display Name Field */}
        <div>
          <label htmlFor="displayName" className="block text-sm font-medium text-pastel-accent mb-1">
            Full Name
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-dark/50" size={18} />
            <input
              type="text"
              id="displayName"
              name="displayName"
              value={formData.displayName}
              onChange={handleChange}
              className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-pastel-accent focus:border-transparent transition-colors ${
                errors.displayName ? 'border-red-500' : 'border-pastel-medium'
              } bg-white/50 backdrop-blur-sm`}
              placeholder="Enter your full name"
              disabled={isLoading}
            />
          </div>
          {errors.displayName && (
            <p className="text-red-500 text-sm mt-1">{errors.displayName}</p>
          )}
        </div>

       


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
              placeholder="Create a password"
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

        {/* Confirm Password Field */}
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-pastel-accent mb-1">
            Confirm Password
          </label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-pastel-dark/50" size={18} />
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-pastel-accent focus:border-transparent transition-colors ${
                errors.confirmPassword ? 'border-red-500' : 'border-pastel-medium'
              } bg-white/50 backdrop-blur-sm`}
              placeholder="Confirm your password"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-pastel-dark/50 hover:text-pastel-accent transition-colors"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
          )}
        </div>


{/* Social Login Buttons */}
<SocialLoginButtons
        onClose={onClose}
        isLoading={isLoading}
        mode="signup"
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
              Creating Account...
            </>
          ) : (
            'Create Account'
          )}
        </Button>


        {/* Switch to Login */}
        <div className="text-center pt-4">
          <p className="text-pastel-dark/70">
            Already have an account?{' '}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="text-pastel-accent hover:text-pastel-dark font-medium transition-colors"
              disabled={isLoading}
            >
              Sign in here
            </button>
          </p>
        </div>
      </form>
    </motion.div>
  );
};

export default SignUp;
