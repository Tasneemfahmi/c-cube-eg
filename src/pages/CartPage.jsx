import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { ShoppingBag, ArrowLeft, Trash2, Plus, Minus, Database } from 'lucide-react';
import { useCartWithDiscounts } from '../contexts/CartWithDiscountsProvider';
import { testCartFirestore, checkFirestoreConnection } from '../utils/testCartFirestore';
import { cleanupExpiredCarts } from '../utils/cartCleanup';
import DiscountSummary, { FreeItemsDisplay } from '../components/DiscountSummary';
import { CartDiscountBanner } from '../components/DiscountBanner';

const CartPage = () => {
  const {
    items,
    itemCount,
    subtotalWithoutDiscounts,
    subtotalWithDiscounts,
    discountSavings,
    tax,
    total,
    updateQuantity,
    removeItem,
    clearCart,
    getItemPrice,
    isLoading,
    expirationInfo,
    formatTimeRemaining,
    discountData,
    discountEligibility,
    hasDiscounts
  } = useCartWithDiscounts();
  const { toast } = useToast();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  const handleQuantityChange = (itemKey, currentQuantity, change) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity > 0) {
      updateQuantity(itemKey, newQuantity);
    }
  };

  const handleRemoveItem = (itemKey, productName) => {
    removeItem(itemKey);
    toast({
      title: "🗑️ Item Removed",
      description: `${productName} has been removed from your cart.`,
      duration: 3000,
    });
  };

  const handleClearCart = () => {
    clearCart();
    toast({
      title: "🧹 Cart Cleared",
      description: "All items have been removed from your cart.",
      duration: 3000,
    });
  };

  const handleCheckout = () => {
    toast({
      title: "🚀 Checkout Coming Soon!",
      description: "Checkout functionality will be available soon. Thank you for your patience!",
      duration: 5000,
    });
  };

  const handleTestFirestore = async () => {
    const result = await testCartFirestore();
    toast({
      title: result.success ? "✅ Firestore Test Passed" : "❌ Firestore Test Failed",
      description: result.message,
      duration: 5000,
    });
  };

  const handleCheckConnection = async () => {
    const result = await checkFirestoreConnection();
    toast({
      title: result.success ? "✅ Connection Successful" : "❌ Connection Failed",
      description: result.message,
      duration: 5000,
    });
  };

  const handleCleanupCarts = async () => {
    const result = await cleanupExpiredCarts();
    toast({
      title: result.success ? "✅ Cleanup Successful" : "❌ Cleanup Failed",
      description: result.message,
      duration: 5000,
    });
  };

  // Tax and total are now calculated in the CartWithDiscountsProvider

  // Show loading state while cart is being loaded from Firestore
  if (isLoading) {
    return (
      <div className="min-h-screen bg-pastel-bg py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pastel-accent mx-auto mb-4"></div>
            <h1 className="text-2xl font-bold text-pastel-accent mb-2">Loading your cart...</h1>
            <p className="text-pastel-accent/70">Please wait while we sync your cart from the cloud.</p>
          </div>
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-pastel-bg py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <ShoppingBag size={80} className="mx-auto text-pastel-medium mb-6" />
            <h1 className="text-3xl font-bold text-pastel-accent mb-4">Your Cart is Empty</h1>
            <p className="text-pastel-accent/70 mb-8 max-w-md mx-auto">
              Looks like you haven't added any handmade treasures to your cart yet. 
              Let's find something beautiful for you!
            </p>
            <Button asChild size="lg" className="bg-pastel-accent text-pastel-bg hover:bg-pastel-accent/90">
              <Link to="/shop">
                <ShoppingBag size={20} className="mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-pastel-bg py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="max-w-6xl mx-auto"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-pastel-accent mb-2">Shopping Cart</h1>
              <p className="text-pastel-accent/70">
                {itemCount} {itemCount === 1 ? 'item' : 'items'} in your cart
              </p>
              {/* Cart Expiration Warning */}
              {expirationInfo && !expirationInfo.isExpired && expirationInfo.hoursRemaining < 1 && (
                <div className="mt-2 px-3 py-1 bg-yellow-100 border border-yellow-300 rounded-md">
                  <p className="text-sm text-yellow-800">
                    ⏰ Cart expires in {formatTimeRemaining(expirationInfo.timeRemaining)}
                  </p>
                </div>
              )}
            </div>
            <Button asChild variant="outline" className="border-pastel-medium text-pastel-accent hover:bg-pastel-light">
              <Link to="/shop">
                <ArrowLeft size={20} className="mr-2" />
                Continue Shopping
              </Link>
            </Button>
          </motion.div>

          {/* Discount Banner for potential savings */}
          <CartDiscountBanner cartItems={items} getItemPrice={getItemPrice} />

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <motion.div variants={itemVariants} className="lg:col-span-2 space-y-6">
              {/* Discount Summary */}
              <DiscountSummary discountData={discountData} />

              {/* Free Items Display */}
              <FreeItemsDisplay freeItems={discountData.freeItems} />

              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-semibold text-pastel-accent">Cart Items</h2>
                    {items.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={handleClearCart}
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 size={16} className="mr-2" />
                        Clear Cart
                      </Button>
                    )}
                  </div>

                  <div className="space-y-6">
                    {items.map((item, index) => {
                      const itemPrice = getItemPrice(item.product, item.selectedSize);
                      const itemTotal = itemPrice * item.quantity;

                      return (
                        <motion.div
                          key={item.key}
                          variants={itemVariants}
                          custom={index}
                          className="flex flex-col sm:flex-row gap-4 p-4 border border-pastel-light rounded-lg hover:shadow-md transition-shadow"
                        >
                          {/* Product Image */}
                          <div className="flex-shrink-0">
                            <img
                              src={item.product.images?.[0] || '/placeholder-image.jpg'}
                              alt={item.product.name}
                              className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded-md"
                            />
                          </div>

                          {/* Product Details */}
                          <div className="flex-grow">
                            <h3 className="font-semibold text-pastel-accent mb-1">
                              {item.product.name}
                            </h3>
                            <p className="text-sm text-pastel-accent/70 mb-2">
                              {item.product.category}
                            </p>
                            
                            {/* Options */}
                            <div className="flex flex-wrap gap-2 mb-3">
                              {item.selectedSize && (
                                <span className="px-2 py-1 bg-pastel-light text-pastel-accent text-xs rounded">
                                  Size: {item.selectedSize}
                                </span>
                              )}
                              {item.selectedColor && (
                                <span className="px-2 py-1 bg-pastel-light text-pastel-accent text-xs rounded">
                                  Color: {item.selectedColor}
                                </span>
                              )}
                              {item.selectedScent && item.selectedScent !== 'Default' && (
                                <span className="px-2 py-1 bg-pastel-light text-pastel-accent text-xs rounded">
                                  Scent: {item.selectedScent}
                                </span>
                              )}
                            </div>

                            {/* Price and Quantity Controls */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.key, item.quantity, -1)}
                                  className="h-8 w-8 p-0 border-pastel-medium"
                                >
                                  <Minus size={14} />
                                </Button>
                                <span className="font-medium text-pastel-accent min-w-[2rem] text-center">
                                  {item.quantity}
                                </span>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleQuantityChange(item.key, item.quantity, 1)}
                                  className="h-8 w-8 p-0 border-pastel-medium"
                                >
                                  <Plus size={14} />
                                </Button>
                              </div>
                              
                              <div className="text-right">
                                <p className="font-bold text-pastel-accent">
                                  £E{itemTotal.toFixed(2)}
                                </p>
                                <p className="text-sm text-pastel-accent/70">
                                  £E{itemPrice.toFixed(2)} each
                                </p>
                              </div>
                            </div>
                          </div>

                          {/* Remove Button */}
                          <div className="flex-shrink-0">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleRemoveItem(item.key, item.product.name)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Order Summary */}
            <motion.div variants={itemVariants} className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl font-semibold text-pastel-accent mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-pastel-accent">
                    <span>Subtotal ({itemCount} items)</span>
                    <span>£E{subtotalWithoutDiscounts.toFixed(2)}</span>
                  </div>

                  {/* Show discount savings if any */}
                  {hasDiscounts && (
                    <div className="flex justify-between text-green-600">
                      <span>Discount Savings</span>
                      <span>-£E{discountSavings.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Show subtotal after discounts if different */}
                  {hasDiscounts && (
                    <div className="flex justify-between text-pastel-accent font-medium">
                      <span>Subtotal after discounts</span>
                      <span>£E{subtotalWithDiscounts.toFixed(2)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-pastel-accent">
                    <span>Tax (14%)</span>
                    <span>£E{tax.toFixed(2)}</span>
                  </div>
                  <hr className="border-pastel-light" />
                  <div className="flex justify-between text-lg font-bold text-pastel-accent">
                    <span>Total</span>
                    <span>£E{total.toFixed(2)}</span>
                  </div>

                  {/* Show total savings summary */}
                  {hasDiscounts && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 mt-4">
                      <div className="text-center">
                        <p className="text-sm text-green-700">🎉 You saved</p>
                        <p className="text-lg font-bold text-green-600">£E{discountSavings.toFixed(2)}</p>
                        <p className="text-xs text-green-600">with active discounts!</p>
                      </div>
                    </div>
                  )}
                </div>

                <Button
                  onClick={handleCheckout}
                  className="w-full bg-pastel-accent text-pastel-bg hover:bg-pastel-accent/90 shadow-lg"
                  size="lg"
                >
                  Proceed to Checkout
                </Button>

                {/* Debug Section - Remove in production */}
                <div className="mt-4 pt-4 border-t border-pastel-light">
                  <p className="text-xs text-pastel-accent/60 mb-2">Debug Tools:</p>
                  <div className="space-y-2">
                    <Button
                      onClick={handleCheckConnection}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Database size={14} className="mr-1" />
                      Test Connection
                    </Button>
                    <Button
                      onClick={handleTestFirestore}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Database size={14} className="mr-1" />
                      Test Firestore
                    </Button>
                    <Button
                      onClick={handleCleanupCarts}
                      variant="outline"
                      size="sm"
                      className="w-full text-xs"
                    >
                      <Database size={14} className="mr-1" />
                      Cleanup Expired
                    </Button>
                  </div>
                </div>

                <p className="text-xs text-pastel-accent/60 text-center mt-4">
                  Secure checkout powered by C³ Cube
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CartPage;
