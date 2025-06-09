import { auth } from '../firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
} from 'firebase/auth';

export const firebaseSignUp = (email, password) =>
  createUserWithEmailAndPassword(auth, email, password);

export const firebaseLogin = (email, password) =>
  signInWithEmailAndPassword(auth, email, password);

export const firebaseLogout = () => signOut(auth);

export const firebaseResetPassword = (email) =>
  sendPasswordResetEmail(auth, email);
// Auth utility functions




export const isAdmin = (user) => {
  // Assuming you store roles in user custom claims or Firestore
  return user?.role === 'admin'; // or however you handle roles
};


// Validate password confirmation
export const validatePasswordConfirmation = (password, confirmPassword) => {
  if (password !== confirmPassword) {
    return {
      isValid: false,
      error: 'Passwords do not match'
    };
  }
  return {
    isValid: true,
    error: null
  };
};

// Validate email format
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

// Validate password strength
export const validatePassword = (password) => {
  const errors = [];
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }
  
  if (!/(?=.*[a-z])/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  
  if (!/(?=.*[A-Z])/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  
  if (!/(?=.*\d)/.test(password)) {
    errors.push('Password must contain at least one number');
  }
  
  return {
    isValid: errors.length === 0,
    errors
  };
};

// Validate display name
export const validateDisplayName = (name) => {
  if (!name || name.trim().length < 2) {
    return {
      isValid: false,
      error: 'Name must be at least 2 characters long'
    };
  }
  
  if (name.trim().length > 50) {
    return {
      isValid: false,
      error: 'Name must be less than 50 characters'
    };
  }
  
  return {
    isValid: true,
    error: null
  };
};

// Format Firebase auth errors for user display
export const formatAuthError = (error) => {
  switch (error.code) {
    case 'auth/user-not-found':
      return 'No account found with this email address.';
    case 'auth/wrong-password':
      return 'Incorrect password. Please try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email already exists.';
    case 'auth/weak-password':
      return 'Password is too weak. Please choose a stronger password.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/too-many-requests':
      return 'Too many failed attempts. Please try again later.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your connection and try again.';
    case 'auth/user-disabled':
      return 'This account has been disabled. Please contact support.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/popup-blocked':
      return 'Pop-up was blocked by your browser. Please allow pop-ups and try again.';
    case 'auth/cancelled-popup-request':
      return 'Sign-in was cancelled. Please try again.';
    case 'auth/account-exists-with-different-credential':
      return 'An account already exists with the same email but different sign-in credentials.';
    case 'auth/auth-domain-config-required':
      return 'Authentication configuration error. Please contact support.';
    case 'auth/credential-already-in-use':
      return 'This credential is already associated with a different user account.';
    case 'auth/operation-not-supported-in-this-environment':
      return 'This operation is not supported in this environment.';
    case 'auth/timeout':
      return 'The operation timed out. Please try again.';
    default:
      return error.message || 'An unexpected error occurred. Please try again.';
  }
};

// Get user email or fallback
export const getUserEmail = (user) => {
  return user?.email || 'No email available';
};


// Capitalize user's display name
export const capitalizeName = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(part => part.charAt(0).toUpperCase() + part.slice(1).toLowerCase())
    .join(' ');
};


// Check if user is authenticated
export const isAuthenticated = (user) => {
  return user !== null && user !== undefined;
};

// Get user display name or fallback
export const getUserDisplayName = (user) => {
  if (!user) return 'Guest';
  return user.displayName || user.email?.split('@')[0] || 'User';
};

// Get user initials for avatar
export const getUserInitials = (user) => {
  if (!user) return 'G';
  
  const displayName = getUserDisplayName(user);
  const names = displayName.split(' ');
  
  if (names.length >= 2) {
    return `${names[0][0]}${names[1][0]}`.toUpperCase();
  }
  
  return displayName.substring(0, 2).toUpperCase();
};
