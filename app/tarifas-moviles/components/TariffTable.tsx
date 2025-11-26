'use client';

import React from 'react';
import { useCart } from '../CartContext';
import { useRouter } from 'next/navigation';
import { applyGlobalDiscount } from '../../../utils/discount';

interface TariffRow {
  data: string;
  minutes: string;
  price: string;
  originalPrice?: string;
}

interface TariffTableProps {
  tariffs: TariffRow[];
}

export default function TariffTable({ tariffs }: TariffTableProps) {
  const { setCart } = useCart();
  const router = useRouter();

  const handleBuy = (tariff: TariffRow) => {
    // Применяем глобальную скидку к цене
    const originalPrice = parseFloat(tariff.price.replace(',', '.'));
    const priceData = applyGlobalDiscount(originalPrice);
    
    setCart({
      type: 'ready',
      name: `${tariff.data} - ${tariff.minutes}`,
      price: priceData.formattedDiscounted,
      after12: tariff.originalPrice ? `12 meses, luego ${priceData.hasDiscount ? priceData.formattedOriginal : tariff.originalPrice}€/mes` : null,
      description: `${tariff.data} de datos, ${tariff.minutes} de minutos`,
    });
    router.push('/cart');
  };

  const renderPrice = (price: string, originalPrice?: string) => {
    const priceValue = parseFloat(price.replace(',', '.'));
    const priceData = applyGlobalDiscount(priceValue);
    
    return (
      <div>
        <div className="font-bold">{priceData.formattedDiscounted}</div>
        {priceData.hasDiscount && (
          <div className="text-sm text-gray-400 line-through">{priceData.formattedOriginal}</div>
        )}
        {originalPrice && (
          <small className="text-gray-500">
            12 meses, luego {priceData.hasDiscount ? priceData.formattedOriginal : originalPrice}
          </small>
        )}
      </div>
    );
  };

  return (
    <div className="tariff-table mb-8 md:mb-12 overflow-x-auto">
      <table className="w-full min-w-full">
        <thead>
          <tr>
            <th className="p-3 md:p-4 text-left">DATOS</th>
            <th className="p-3 md:p-4 text-left">MINUTOS</th>
            <th className="p-3 md:p-4 text-left">€/mes</th>
            <th className="p-3 md:p-4"></th>
          </tr>
        </thead>
        <tbody>
          {tariffs.map((tariff, index) => (
            <tr key={index} className={`border-b ${index % 2 === 1 ? 'bg-gray-50' : ''}`}>
              <td className="p-3 md:p-4"><strong>{tariff.data}</strong></td>
              <td className="p-3 md:p-4">{tariff.minutes}</td>
              <td className="p-3 md:p-4">
                {renderPrice(tariff.price, tariff.originalPrice)}
              </td>
              <td className="p-3 md:p-4">
                <button 
                  className="btn-green text-xs md:text-sm w-full" 
                  onClick={() => handleBuy(tariff)}
                >
                  VER TARIFA
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
} 