'use client';

import React from 'react';
import TariffBadge from './TariffBadge';
import { useCart } from '../CartContext';
import { useRouter } from 'next/navigation';
import { useCart as useFibraCart } from '../../fibra-optica/CartContext';
import { useTVCart } from '../../tv/CartContext';
import { applyGlobalDiscount, DiscountBadge } from '../../../utils/discount';

interface TariffCardProps {
  price: string;
  originalPrice?: string;
  discount?: string;
  badgeType?: 'price' | 'orange' | 'green';
  data: string;
  features: string[];
  isPopular?: boolean;
}

export default function TariffCard({ 
  price, 
  originalPrice, 
  discount, 
  badgeType = 'price', 
  data, 
  features, 
  isPopular = false 
}: TariffCardProps) {
  // Определяем цвет бейджа по типу тарифа
  let badgeColor: 'orange' | 'green' | 'purple' = 'purple';
  if (badgeType === 'orange') badgeColor = 'orange';
  if (badgeType === 'green') badgeColor = 'green';

  // Получаем только число для бейджа (без 'GB')
  let badgeValue = discount ? discount.replace(/\s*GB/i, '').replace(/^∞$/, '∞') : '';

  const { setCart } = useCart();
  const fibraCart = useFibraCart();
  const tvCart = useTVCart();
  const router = useRouter();

  // Применяем глобальную скидку к цене
  const priceData = applyGlobalDiscount(price);

  const handleBuy = () => {
    // Очищаем корзину оптоволокна и TV перед добавлением мобильного тарифа
    if (fibraCart.cart) {
      fibraCart.clearCart();
    }
    if (tvCart.cart) {
      tvCart.clearCart();
    }
    setCart({
      type: 'ready',
      name: data,
      price: priceData.formattedDiscounted,
      after12: originalPrice ? `12 meses, luego ${priceData.hasDiscount ? priceData.formattedOriginal : originalPrice}€/mes` : null,
      description: features.join(', '),
    });
    router.push('/cart');
  };

  return (
    <div className={`tariff-card p-6 hover-scale relative ${isPopular ? 'md:col-span-2 lg:col-span-1' : ''}`}>
      {/* Global Discount Badge */}
      <DiscountBadge discount={priceData.discountPercent} />
      
      {discount && (
        <div className="absolute top-4 right-4 z-10">
          <TariffBadge value={badgeValue} color={badgeColor} />
        </div>
      )}
      <div className="text-center">
        <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
          {priceData.formattedDiscounted.split(',')[0]}<span className="text-xl md:text-2xl">,{priceData.formattedDiscounted.split(',')[1]}</span>
        </div>
        <div className="text-gray-600 mb-2">€/mes</div>
        <div className="text-sm text-gray-500 mb-4 md:mb-6">IVA incl.</div>
        {priceData.hasDiscount && (
          <div className="mb-3 p-2 bg-gray-100 rounded-lg border border-gray-200">
            <div className="text-sm text-gray-500 mb-1">Precio original:</div>
            <div className="text-lg font-bold text-gray-400 line-through">
              {priceData.formattedOriginal}€/mes
            </div>
            <div className="text-xs text-green-600 font-bold mt-1">
              ¡Ahorras {priceData.savings.toFixed(2).replace('.', ',')}€/mes!
            </div>
          </div>
        )}
        {originalPrice && (
          <div className="text-sm text-gray-700 mb-4">12 meses, luego {priceData.hasDiscount ? priceData.formattedOriginal : originalPrice}€/mes</div>
        )}
        <ul className="text-left mb-6 space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center">
              <i className="fas fa-mobile-alt text-pink-600 mr-2"></i> {feature}
            </li>
          ))}
        </ul>
        <button className="btn-green w-full" onClick={handleBuy}>VER TARIFA</button>
      </div>
    </div>
  );
} 