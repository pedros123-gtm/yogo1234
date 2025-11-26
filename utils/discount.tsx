import React from 'react';

export interface PriceData {
  originalPrice: number;
  discountedPrice: number;
  discountPercent: number;
  hasDiscount: boolean;
  savings: number;
  formattedOriginal: string;
  formattedDiscounted: string;
}

/**
 * Получает глобальную скидку из переменной окружения
 */
export function getGlobalDiscount(): number {
  const discount = process.env.NEXT_PUBLIC_GLOBAL_DISCOUNT;
  if (!discount) return 0;
  
  const discountValue = parseFloat(discount);
  return isNaN(discountValue) ? 0 : Math.min(Math.max(discountValue, 0), 100);
}

/**
 * Применяет глобальную скидку к цене
 */
export function applyGlobalDiscount(originalPrice: number | string): PriceData {
  const price = typeof originalPrice === 'string' 
    ? parseFloat(originalPrice.replace(',', '.')) 
    : originalPrice;
  
  const discount = getGlobalDiscount();
  
  if (discount === 0) {
    return {
      originalPrice: price,
      discountedPrice: price,
      discountPercent: 0,
      hasDiscount: false,
      savings: 0,
      formattedOriginal: formatPrice(price),
      formattedDiscounted: formatPrice(price)
    };
  }
  
  const discountedPrice = price * (1 - discount / 100);
  const savings = price - discountedPrice;
  
  return {
    originalPrice: price,
    discountedPrice: Math.round(discountedPrice * 100) / 100,
    discountPercent: discount,
    hasDiscount: true,
    savings: Math.round(savings * 100) / 100,
    formattedOriginal: formatPrice(price),
    formattedDiscounted: formatPrice(Math.round(discountedPrice * 100) / 100)
  };
}

/**
 * Форматирует цену в испанском формате
 */
export function formatPrice(price: number): string {
  return price.toFixed(2).replace('.', ',');
}

interface DiscountBadgeProps {
  discount: number;
  className?: string;
}

/**
 * Компонент скидочного бейджа - ВСЕГДА слева
 */
export function DiscountBadge({ discount, className = "" }: DiscountBadgeProps) {
  if (!discount || discount === 0) return null;
  return (
    <div
      className={`
        absolute left-2 top-2
        flex items-center justify-center
        w-[64px] h-[32px]
        bg-gradient-to-r from-red-500 via-red-600 to-red-700
        text-white
        rounded-full
        text-xs font-black
        shadow-md
        z-20
        border border-white
        pointer-events-none
        animate-discount-glow
        transition-all duration-300
        whitespace-nowrap
        ${className}
      `}
      style={{
        background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
        boxShadow: '0 0 0 0 rgba(239,68,68,0.5), 0 2px 8px rgba(239,68,68,0.2)',
        animation: 'discount-glow 2.5s ease-in-out infinite',
        opacity: 1,
        transform: 'scale(1)',
        willChange: 'opacity, transform',
        minWidth: 64,
        maxWidth: 64,
        minHeight: 32,
        maxHeight: 32,
      }}
    >
      <span className="text-xs mr-1">🔥</span>
      <span className="font-extrabold text-xs">-{discount}%</span>
      <style jsx>{`
        @keyframes discount-glow {
          0% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5), 0 2px 8px rgba(239,68,68,0.2); opacity: 0.7; transform: scale(0.95); }
          30% { box-shadow: 0 0 0 4px rgba(239,68,68,0.15), 0 2px 8px rgba(239,68,68,0.2); opacity: 1; transform: scale(1.05); }
          60% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5), 0 2px 8px rgba(239,68,68,0.2); opacity: 1; transform: scale(1); }
          100% { box-shadow: 0 0 0 0 rgba(239,68,68,0.5), 0 2px 8px rgba(239,68,68,0.2); opacity: 0.7; transform: scale(0.95); }
        }
      `}</style>
    </div>
  );
}

export const calculateDiscountedPrice = (originalPrice: number): number => {
  const discount = getGlobalDiscount();
  if (discount === 0) return originalPrice;
  
  return Math.round((originalPrice * (100 - discount)) / 100);
}; 