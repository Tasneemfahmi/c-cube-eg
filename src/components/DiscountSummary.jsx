import React from 'react';
import { motion } from 'framer-motion';
import { Gift, Tag, Sparkles } from 'lucide-react';
import { formatDiscountDescription } from '../utils/discountUtils';

const DiscountSummary = ({ discountData, className = "" }) => {
  if (!discountData || discountData.totalSavings === 0) return null;

  const { totalSavings, appliedDiscounts } = discountData;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`bg-green-50 border border-green-200 rounded-lg p-4 ${className}`}
    >
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Gift className="text-green-600" size={20} />
          <h3 className="font-semibold text-green-800">Discounts Applied</h3>
        </div>
        <div className="flex items-center space-x-1">
          <Sparkles className="text-green-600" size={16} />
          <span className="font-bold text-green-700">
            You saved ج.م{totalSavings.toFixed(2)}!
          </span>
        </div>
      </div>

      <div className="space-y-2">
        {appliedDiscounts.map((applied, index) => (
          <div key={index} className="bg-white rounded-md p-3 border border-green-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Tag className="text-green-600" size={16} />
                <span className="text-sm font-medium text-gray-700">
                  {formatDiscountDescription(applied.discount)}
                </span>
              </div>
              <span className="text-sm font-semibold text-green-600">
                -ج.م{applied.savings.toFixed(2)}
              </span>
            </div>
            
            {applied.discountInfo && (
              <div className="mt-2 text-xs text-gray-600">
                {applied.discountInfo.setsEligible} set{applied.discountInfo.setsEligible > 1 ? 's' : ''} eligible • 
                {applied.discountInfo.totalFreeItems} free item{applied.discountInfo.totalFreeItems > 1 ? 's' : ''}
              </div>
            )}
          </div>
        ))}
      </div>
    </motion.div>
  );
};

// Component to show free items in cart
export const FreeItemsDisplay = ({ freeItems, className = "" }) => {
  if (!freeItems || freeItems.length === 0) return null;

  return (
    <div className={`bg-green-50 border border-green-200 rounded-lg p-3 ${className}`}>
      <div className="flex items-center space-x-2 mb-2">
        <Gift className="text-green-600" size={18} />
        <h4 className="font-semibold text-green-800 text-sm">Free Items</h4>
      </div>
      
      <div className="space-y-2">
        {freeItems.map((item, index) => (
          <div key={index} className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-2">
              <img
                src={item.product.images?.[0] || '/placeholder-image.jpg'}
                alt={item.product.name}
                className="w-8 h-8 object-cover rounded"
              />
              <div>
                <span className="text-gray-700">{item.product.name}</span>
                {item.selectedSize && item.selectedSize !== 'Standard' && (
                  <span className="text-gray-500 ml-1">({item.selectedSize})</span>
                )}
              </div>
            </div>
            <div className="text-right">
              <div className="text-green-600 font-semibold">
                {item.freeQuantity}x FREE
              </div>
              <div className="text-xs text-gray-500 line-through">
                ج.م{item.savings.toFixed(2)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Component to show discount eligibility progress
export const DiscountProgress = ({ eligibility, className = "" }) => {
  if (!eligibility || eligibility.length === 0) return null;

  return (
    <div className={`space-y-3 ${className}`}>
      {eligibility.map((item, index) => (
        <div key={index} className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-blue-800">
              {item.description}
            </span>
            <span className="text-xs text-blue-600">
              {item.currentQuantity}/{item.discount.buyQuantity}
            </span>
          </div>
          
          <div className="w-full bg-blue-200 rounded-full h-2">
            <div
              className="bg-blue-500 h-2 rounded-full transition-all duration-300"
              style={{
                width: `${Math.min(100, (item.currentQuantity / item.discount.buyQuantity) * 100)}%`
              }}
            />
          </div>
          
          {!item.isEligible && (
            <p className="text-xs text-blue-600 mt-1">
              Add {item.itemsNeeded} more item{item.itemsNeeded > 1 ? 's' : ''} to qualify!
            </p>
          )}
        </div>
      ))}
    </div>
  );
};

export default DiscountSummary;
