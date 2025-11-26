'use client';

import React, { useState } from 'react';
import { useCart, type CartTariff } from '../CartContext';
import { useCart as useFibraCart } from '../../fibra-optica/CartContext';
import { useTVCart } from '../../tv/CartContext';
import { useRouter } from 'next/navigation';
import { applyGlobalDiscount, DiscountBadge } from '../../../utils/discount';

const tariffs = [
  {
    label: '500 MB',
    value: '500MB',
    price: '6,00',
    originalPrice: null,
    after12: null,
    description: 'Móvil con 500 MB y llamadas infinitas',
    after: null,
  },
  {
    label: '10 GB',
    value: '10GB',
    price: '8,00',
    originalPrice: '10,00',
    after12: '12 meses, luego 10,00€/mes',
    description: 'Móvil con 10 GB y llamadas infinitas',
    after: null,
  },
  {
    label: '25 GB',
    value: '25GB',
    price: '12,80',
    originalPrice: '16,00',
    after12: '12 meses, luego 16,00€/mes',
    description: 'Móvil con 25 GB y llamadas infinitas',
    after: null,
  },
  {
    label: '55 GB',
    value: '55GB',
    price: '20,80',
    originalPrice: '26,00',
    after12: '12 meses, luego 26,00€/mes',
    description: 'Móvil con 55 GB y llamadas infinitas',
    after: null,
  },
  {
    label: 'GB infinitos',
    value: 'INFINITOS',
    price: '28,00',
    originalPrice: '35,00',
    after12: '12 meses, luego 35,00€/mes',
    description: 'Móvil con GB infinitos y llamadas infinitas',
    after: null,
  },
];

export default function ConfiguraTarifa() {
  const [selected, setSelected] = useState('500MB');
  const [showLines, setShowLines] = useState(false);
  // Счетчики для каждой доп. линии
  const [lines, setLines] = useState<{ [key: string]: number }>({});
  const { setCart } = useCart();
  const { clearCart: clearFibraCart } = useFibraCart();
  const { clearCart: clearTVCart } = useTVCart();
  const router = useRouter();

  const current = tariffs.find(t => t.value === selected)!;

  // Получить цену как число
  const getPrice = (price: string) => parseFloat(price.replace(',', '.'));

  // Итоговая цена: основная линия + все доп. линии
  const totalOriginal = getPrice(current.price) + tariffs.reduce((sum, t) => sum + (lines[t.value] || 0) * getPrice(t.price), 0);
  const totalPriceData = applyGlobalDiscount(totalOriginal);

  const handleContinue = () => {
    const configuredPlan: CartTariff = {
      type: 'custom',
      name: `${current.label}`,
      price: totalPriceData.formattedDiscounted,
      after12: current.after12,
      description: current.description,
      lines: tariffs.map(t => ({ label: t.label, count: lines[t.value] || 0, price: t.price })).filter(l => l.count > 0),
    };

    setCart(configuredPlan);
    clearFibraCart();
    clearTVCart();
    router.push('/cart');
  };

  const renderPrice = (price: string) => {
    const priceData = applyGlobalDiscount(getPrice(price));
    return (
      <div className="text-center">
        <span className="text-4xl md:text-5xl font-bold text-gray-800">
          {priceData.formattedDiscounted.split(',')[0]}
          <span className="text-xl md:text-2xl">,{priceData.formattedDiscounted.split(',')[1]}</span>
        </span>
        <span className="text-gray-600 ml-2">€/mes</span>
        {priceData.hasDiscount && (
          <div className="text-sm text-gray-400 line-through">
            {priceData.formattedOriginal}€/mes
          </div>
        )}
        <div className="text-sm text-gray-500 mb-2">IVA incl.</div>
        {current.after12 && <div className="text-sm text-gray-700 mb-2">{current.after12}</div>}
      </div>
    );
  };

  return (
    <div className="tariff-card p-6 md:p-8 mb-8 md:mb-12 relative">
      {/* Global Discount Badge */}
      <DiscountBadge discount={totalPriceData.discountPercent} />
      
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-4 md:mb-6">CONFIGURA TU TARIFA</h2>
      <p className="text-center text-gray-600 mb-6 md:mb-8">Incluye teléfono fijo с llamadas, llamadas infinitas en móvil, cobertura 5G, instalación y router GRATIS.</p>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Línea móvil principal</h3>
          <div className="flex flex-wrap gap-2 mb-4">
            {tariffs.map(t => (
              <button
                key={t.value}
                className={`px-3 md:px-4 py-2 rounded-full text-sm border ${selected === t.value ? 'bg-green-600 text-white border-green-600' : 'border-gray-300 hover:bg-gray-100'}`}
                onClick={() => setSelected(t.value)}
              >
                {t.label}
              </button>
            ))}
          </div>
          <div className="text-center my-4">
            {renderPrice(current.price)}
          </div>
          <p className="text-sm text-gray-600 flex items-center justify-center mb-2">
            <i className="fas fa-check text-green-600 mr-2"></i>
            {current.description}
          </p>
          <p className="text-sm text-gray-600 flex items-center justify-center">
            <i className="fas fa-check text-green-600 mr-2"></i>
            Envío y tarjeta SIM gratuitos.
          </p>
        </div>
        <div>
          <h3 className="text-lg md:text-xl font-bold mb-4">Añade más líneas móviles</h3>
          <div className="border border-gray-300 rounded-lg p-4 mb-4 cursor-pointer flex items-center justify-between" onClick={() => setShowLines(v => !v)}>
            <span><i className="fas fa-plus text-gray-400 mr-2"></i> Selecciona las líneas</span>
            <span>{showLines ? <i className="fas fa-chevron-up"></i> : <i className="fas fa-chevron-down"></i>}</span>
          </div>
          {showLines && (
            <div className="bg-white border border-gray-200 rounded-lg shadow-lg p-4 mt-2">
              <div className="font-bold mb-2 flex items-center"><i className="fas fa-mobile-alt mr-2"></i> Selecciona las líneas</div>
              {tariffs.map(t => (
                <div key={t.value} className="flex items-center justify-between py-2 border-b last:border-b-0">
                  <div>
                    <div className="font-semibold">La Sinfín {t.label}</div>
                    <div className="text-xs text-gray-500">{t.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-500 hover:bg-gray-100"
                      onClick={() => setLines(l => ({ ...l, [t.value]: Math.max(0, (l[t.value] || 0) - 1) }))}
                    >-</button>
                    <span className="w-6 text-center">{lines[t.value] || 0}</span>
                    <button
                      className="w-6 h-6 rounded-full border border-gray-300 flex items-center justify-center text-lg text-gray-500 hover:bg-gray-100"
                      onClick={() => setLines(l => ({ ...l, [t.value]: (l[t.value] || 0) + 1 }))}
                    >+</button>
                  </div>
                </div>
              ))}
            </div>
          )}
          <div className="text-right mt-4">
            <div className="text-2xl md:text-3xl font-bold text-gray-800">
              {totalPriceData.formattedDiscounted.split(',')[0]}
              <span className="text-base md:text-lg">,{totalPriceData.formattedDiscounted.split(',')[1]}</span>
            </div>
            {totalPriceData.hasDiscount && (
              <div className="text-sm text-gray-400 line-through">
                {totalPriceData.formattedOriginal}€/mes
              </div>
            )}
            <div className="text-sm text-gray-600">€/mes</div>
            <div className="text-sm text-gray-500">Precio final</div>
          </div>
        </div>
      </div>
      <div className="text-center mt-6 md:mt-8">
        <button className="btn-green px-6 md:px-8 py-3" onClick={handleContinue}>VER TARIFA</button>
      </div>
    </div>
  );
} 