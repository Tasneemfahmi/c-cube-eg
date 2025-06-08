// Updated DiscountBanner.js with prettier styles matching C Cube vibes ✨

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Tag, Gift, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react';
import { useDiscounts } from '../contexts/DiscountContext';
import { formatDiscountDescription } from '../utils/discountUtils';

const DiscountBanner = ({ productId = null, className = "" }) => {
  const { discounts, isLoading } = useDiscounts();

  if (isLoading) return null;

  const relevantDiscounts = productId 
    ? discounts.filter(discount => 
        discount.active && 
        discount.applicableProducts?.includes(productId)
      )
    : discounts.filter(discount => discount.active);

  if (relevantDiscounts.length === 0) return null;

  return (
    <div className={`space-y-2 ${className}`}>
      {relevantDiscounts.map((discount, index) => (
        <motion.div
          key={discount.id}
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
          className="bg-gradient-to-r from-[#FDCEDF] to-[#F8E8EE] text-[#2e474a] px-4 py-2 rounded-xl shadow-md shadow-[#FDCEDF]/50 border border-[#F8E8EE]"
        >
          <div className="flex items-center justify-center space-x-2">
            <Gift size={18} className="animate-pulse text-[#2e474a]" />
            <span className="font-medium text-sm sm:text-base">
              🎉 {formatDiscountDescription(discount)}
            </span>
            <Sparkles size={18} className="animate-pulse text-[#2e474a]" />
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export const DiscountBadge = ({ productId, className = "" }) => {
  const { discounts } = useDiscounts();

  const productDiscounts = discounts.filter(discount =>
    discount.active && discount.applicableProducts?.includes(productId)
  );

  if (productDiscounts.length === 0) return null;

  return (
    <div className={`absolute top-2 right-2 z-10 ${className}`}>
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="bg-[#FDCEDF] text-[#2e474a] px-2 py-1 rounded-full text-xs font-semibold shadow-md border border-[#F8E8EE]"
      >
        <div className="flex items-center space-x-1">
          <Tag size={12} />
          <span>OFFER</span>
        </div>
      </motion.div>
    </div>
  );
};

export const CartDiscountBanner = ({ cartItems, getItemPrice }) => {
  const { discounts } = useDiscounts();

  if (!cartItems?.length) return null;

  const potentialDiscounts = [];

  for (const discount of discounts) {
    if (!discount.active) continue;

    const applicableItems = cartItems.filter(item =>
      discount.applicableProducts.includes(item.product.id)
    );

    if (!applicableItems.length) continue;

    const totalQuantity = applicableItems.reduce((sum, item) => sum + item.quantity, 0);

    if (discount.type === 'buyXgetY') {
      const needed = discount.buyQuantity - totalQuantity;
      if (needed > 0) {
        potentialDiscounts.push({
          discount,
          itemsNeeded: needed,
          description: formatDiscountDescription(discount)
        });
      }
    }
  }

  if (potentialDiscounts.length === 0) return null;

  return (
    <div className="bg-[#F9F5F6] border border-[#F8E8EE] rounded-xl p-4 mb-4 shadow-sm">
      <div className="flex items-start space-x-3">
        <Gift className="text-[#2e474a] mt-1" size={20} />
        <div>
          <h3 className="font-semibold text-[#2e474a] mb-2">
            🎁 You're close to a great deal!
          </h3>
          {potentialDiscounts.map((item, index) => (
            <p key={index} className="text-[#2e474a]/80 text-sm">
              Add {item.itemsNeeded} more eligible item{item.itemsNeeded > 1 ? 's' : ''} to get: <strong>{item.description}</strong>
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};

export const DiscountCarousel = ({ className = "" }) => {
  const { discounts, isLoading } = useDiscounts();
  const [currentSlide, setCurrentSlide] = useState(0);

  const banners = [
    ...discounts.filter(d => d.active).map(d => ({
      id: `discount-${d.id}`,
      type: 'discount',
      title: '🎉 Special Offer!',
      description: formatDiscountDescription(d),
      gradient: 'from-[#FDCEDF] to-[#F8E8EE]',
      icon: Gift
    })),
    {
      id: 'handmade',
      type: 'promo',
      title: '✨ Handmade with Love',
      description: 'Each piece is crafted with care and intention.',
      gradient: 'from-[#F8E8EE] to-[#F9F5F6]',
      icon: Sparkles
    },
    {
      id: 'free-shipping',
      type: 'promo',
      title: '🚚 Free Shipping',
      description: 'On orders over E£1000 – Delivered with love 💌',
      gradient: 'from-[#F2BED1] to-[#F8E8EE]',
      icon: Tag
    },
    {
      id: 'custom-orders',
      type: 'promo',
      title: '🎨 Custom Orders Welcome',
      description: 'Let us bring your pastel dreams to life!',
      gradient: 'from-[#FDCEDF] to-[#F2BED1]',
      icon: Sparkles
    }
  ];

  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % banners.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [banners.length]);

  if (isLoading || banners.length === 0) return null;

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % banners.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);

  return (
    <div className={`relative w-full h-24 sm:h-28 overflow-hidden rounded-2xl shadow-md shadow-[#FDCEDF]/50 border border-[#F8E8EE] ${className}`}>
      <AnimatePresence mode="wait">
        <motion.div
          key={banners[currentSlide].id}
          initial={{ opacity: 0, x: 100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          className={`absolute inset-0 bg-gradient-to-r ${banners[currentSlide].gradient} flex items-center justify-center px-6`}
        >
          <div className="flex items-center space-x-3 sm:space-x-4 text-center w-full">
            {React.createElement(banners[currentSlide].icon, {
              size: 26,
              className: "text-[#2e474a] animate-pulse flex-shrink-0"
            })}
            <div className="flex-1">
              <h3 className="font-semibold text-[#2e474a] text-sm sm:text-base tracking-wide">
                {banners[currentSlide].title}
              </h3>
              <p className="text-[#2e474a]/70 text-xs sm:text-sm leading-snug">
                {banners[currentSlide].description}
              </p>
            </div>
            {React.createElement(banners[currentSlide].icon, {
              size: 26,
              className: "text-[#2e474a] animate-pulse flex-shrink-0"
            })}
          </div>
        </motion.div>
      </AnimatePresence>

      {banners.length > 1 && (
        <>
          <button
            onClick={prevSlide}
            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/60 rounded-full p-1.5 transition-all duration-200 shadow"
            aria-label="Previous banner"
          >
            <ChevronLeft size={16} className="text-[#2e474a]" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/40 hover:bg-white/60 rounded-full p-1.5 transition-all duration-200 shadow"
            aria-label="Next banner"
          >
            <ChevronRight size={16} className="text-[#2e474a]" />
          </button>
        </>
      )}

      {banners.length > 1 && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2.5 h-2.5 rounded-full transition-colors duration-200 ${
                index === currentSlide
                  ? 'bg-[#2e474a]'
                  : 'bg-[#2e474a]/30 hover:bg-[#2e474a]/50'
              }`}
              aria-label={`Go to banner ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default DiscountBanner;
