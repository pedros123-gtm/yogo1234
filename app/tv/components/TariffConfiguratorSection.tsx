'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { applyGlobalDiscount, DiscountBadge } from '../../../utils/discount';

interface FiberOption {
  speed: string;
  price: number;
  popular?: boolean;
}

interface MobileOption {
  data: string;
  price: number;
  popular?: boolean;
}

interface TVService {
  id: string;
  name: string;
  price: number;
  logo: string;
}

interface AdditionalLineOption {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
}

const fiberOptions: FiberOption[] = [
  { speed: '300 Mb', price: 25 },
  { speed: '600 Mb', price: 30, popular: true },
  { speed: '1 Gb', price: 35 }
];

const mobileOptions: MobileOption[] = [
  { data: '25 GB', price: 15 },
  { data: '35 GB', price: 20, popular: true },
  { data: '55 GB', price: 25 },
  { data: '∞ GB', price: 30 }
];

const tvServices: TVService[] = [
  { id: 'yoigo-tv', name: 'YOIGO', price: 0, logo: '/images/television-yoigo.webp' },
  { id: 'netflix', name: 'NETFLIX', price: 8, logo: '/images/Card-Netflix.png' },
  { id: 'max', name: 'max', price: 6, logo: '/images/Card-Max__1_.png' },
  { id: 'prime', name: 'prime', price: 4, logo: '/images/yoigo_card_prime.png' },
  { id: 'disney', name: 'Disney+', price: 7, logo: '/images/brand-disney-svgrepo-com.svg' }
];

export default function TariffConfiguratorSection() {
  const [selectedFiber, setSelectedFiber] = useState<FiberOption>(fiberOptions[1]);
  const [selectedMobile, setSelectedMobile] = useState<MobileOption>(mobileOptions[1]);
  const [additionalLines, setAdditionalLines] = useState<AdditionalLineOption[]>([
    { id: 'duo', name: 'Línea DÚO', description: 'GB compartidos y llamadas infinitas', price: 10, quantity: 0 },
    { id: 'sinfin-500mb', name: 'La Sinfín 500MB', description: '500 MB y llamadas infinitas', price: 12, quantity: 0 },
    { id: 'sinfin-35gb', name: 'La Sinfín 35GB', description: '35 GB y llamadas infinitas', price: 15, quantity: 0 }
  ]);
  const [selectedTVServices, setSelectedTVServices] = useState<string[]>(['yoigo-tv']);
  const [showFiberDropdown, setShowFiberDropdown] = useState(false);
  const [showMobileDropdown, setShowMobileDropdown] = useState(false);
  const [showLinesDropdown, setShowLinesDropdown] = useState(false);

  const handleTVServiceToggle = (serviceId: string) => {
    if (serviceId === 'yoigo-tv') return; // Yoigo TV is always included
    
    setSelectedTVServices(prev => 
      prev.includes(serviceId) 
        ? prev.filter(id => id !== serviceId)
        : [...prev, serviceId]
    );
  };

  const updateLineQuantity = (lineId: string, change: number) => {
    setAdditionalLines(prev => 
      prev.map(line => 
        line.id === lineId 
          ? { ...line, quantity: Math.max(0, Math.min(5, line.quantity + change)) }
          : line
      )
    );
  };

  const getTotalAdditionalLines = () => {
    return additionalLines.reduce((total, line) => total + line.quantity, 0);
  };

  const calculateTotalPrice = () => {
    const fiberPrice = selectedFiber.price;
    const mobilePrice = selectedMobile.price;
    const additionalLinesPrice = additionalLines.reduce((total, line) => total + (line.price * line.quantity), 0);
    const tvPrice = selectedTVServices.reduce((total, serviceId) => {
      const service = tvServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    
    const totalOriginalPrice = fiberPrice + mobilePrice + additionalLinesPrice + tvPrice;
    const priceData = applyGlobalDiscount(totalOriginalPrice);
    
    return priceData.discountedPrice;
  };

  const getOriginalTotalPrice = () => {
    const fiberPrice = selectedFiber.price;
    const mobilePrice = selectedMobile.price;
    const additionalLinesPrice = additionalLines.reduce((total, line) => total + (line.price * line.quantity), 0);
    const tvPrice = selectedTVServices.reduce((total, serviceId) => {
      const service = tvServices.find(s => s.id === serviceId);
      return total + (service?.price || 0);
    }, 0);
    
    return fiberPrice + mobilePrice + additionalLinesPrice + tvPrice;
  };

  const priceData = applyGlobalDiscount(getOriginalTotalPrice());

  return (
    <section className="flex flex-col w-full h-auto items-center bg-gray-50 py-16">
      <div className="w-full max-w-5xl mx-auto px-4">
        
        {/* Title */}
        <h2 className="font-roboto-condensed text-2xl font-bold text-center mb-12 text-gray-800 tracking-wide">
          COMBÍNALO COMO QUIERAS
        </h2>

        {/* Configurator Card */}
        <div className="bg-white rounded-xl shadow-lg p-8 mx-auto max-w-4xl relative">
          
          {/* Global Discount Badge */}
          <DiscountBadge discount={priceData.discountPercent} />
          
          {/* Top Row - Fiber, Mobile, Additional Lines */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            
            {/* Fiber Speed Selection */}
            <div className="text-center">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Velocidad de fibra</h3>
              <div className="relative">
                <button
                  onClick={() => setShowFiberDropdown(!showFiberDropdown)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-center font-bold text-sm ${
                    selectedFiber.popular 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {selectedFiber.speed}
                </button>
                
                {showFiberDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 mt-1">
                    {fiberOptions.map((option) => (
                      <button
                        key={option.speed}
                        onClick={() => {
                          setSelectedFiber(option);
                          setShowFiberDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-sm font-bold hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          option.popular ? 'text-blue-500' : 'text-gray-700'
                        }`}
                      >
                        {option.speed}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Mobile Line Selection */}
            <div className="text-center">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Línea móvil principal</h3>
              <div className="relative">
                <button
                  onClick={() => setShowMobileDropdown(!showMobileDropdown)}
                  className={`w-full px-4 py-3 border-2 rounded-lg text-center font-bold text-sm ${
                    selectedMobile.popular 
                      ? 'border-blue-500 bg-blue-500 text-white' 
                      : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
                  }`}
                >
                  {selectedMobile.data}
                </button>
                
                {showMobileDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 mt-1">
                    {mobileOptions.map((option) => (
                      <button
                        key={option.data}
                        onClick={() => {
                          setSelectedMobile(option);
                          setShowMobileDropdown(false);
                        }}
                        className={`w-full px-4 py-3 text-sm font-bold hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg ${
                          option.popular ? 'text-blue-500' : 'text-gray-700'
                        }`}
                      >
                        {option.data}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Additional Lines */}
            <div className="text-center">
              <h3 className="font-semibold text-sm text-gray-700 mb-3">Añade más líneas móviles</h3>
              <div className="relative">
                <button
                  onClick={() => setShowLinesDropdown(!showLinesDropdown)}
                  className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg text-center text-sm text-gray-600 hover:border-gray-400 bg-white"
                >
                  <div className="flex items-center justify-center space-x-2">
                    <Image
                      src="/images/Frame_10.svg"
                      alt="Lines"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    <span>Selecciona las líneas</span>
                    <svg className={`w-4 h-4 transition-transform ${showLinesDropdown ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </button>
                
                {showLinesDropdown && (
                  <div className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-lg shadow-lg z-20 mt-1 p-4 min-w-[300px]">
                    {additionalLines.map((line) => (
                      <div key={line.id} className="mb-4 last:mb-0">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex-1">
                            <h4 className="font-semibold text-sm text-gray-800">{line.name}</h4>
                            <p className="text-xs text-gray-600">{line.description}</p>
                          </div>
                          <div className="flex items-center space-x-3">
                            <button
                              onClick={() => updateLineQuantity(line.id, -1)}
                              disabled={line.quantity === 0}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
                              </svg>
                            </button>
                            <span className="font-bold text-lg min-w-[20px] text-center">{line.quantity}</span>
                            <button
                              onClick={() => updateLineQuantity(line.id, 1)}
                              disabled={line.quantity >= 5}
                              className="w-8 h-8 rounded-full border-2 border-gray-300 flex items-center justify-center text-gray-600 hover:border-gray-400 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                              </svg>
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* TV Services Section */}
          <div className="mb-8">
            <h3 className="font-semibold text-sm text-gray-700 mb-4">Televisión</h3>
            <div className="flex flex-wrap justify-center gap-3">
              {tvServices.map((service) => (
                <label
                  key={service.id}
                  className={`flex items-center justify-center w-20 h-16 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedTVServices.includes(service.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-300 hover:border-gray-400 bg-white'
                  } ${service.id === 'yoigo-tv' ? 'border-blue-500 bg-blue-50' : ''}`}
                >
                  <input
                    type="checkbox"
                    checked={selectedTVServices.includes(service.id)}
                    onChange={() => handleTVServiceToggle(service.id)}
                    disabled={service.id === 'yoigo-tv'}
                    className="sr-only"
                  />
                  <div className="flex flex-col items-center">
                    <Image
                      src={service.logo}
                      alt={service.name}
                      width={32}
                      height={20}
                      className="h-5 w-auto object-contain mb-1"
                    />
                    <span className="text-xs font-medium text-gray-700">{service.name}</span>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Price and Continue Section */}
          <div className="flex flex-col md:flex-row items-center justify-between">
            
            {/* Bottom Notice */}
            <div className="flex items-start space-x-2 text-green-700 mb-4 md:mb-0 md:flex-1 md:mr-8">
              <Image
                src="/images/CheckFilled.svg"
                alt="Check"
                width={16}
                height={16}
                className="w-4 h-4 mt-0.5 flex-shrink-0"
              />
              <span className="text-xs leading-tight">
                Incluye teléfono fijo con llamadas, llamadas infinitas en móvil, cobertura 5G, instalación y router GRATIS.
              </span>
            </div>

            {/* Price and Button */}
            <div className="flex items-center space-x-6">
              <div className="text-right">
                <div className="text-4xl font-black text-gray-800">
                  {priceData.formattedDiscounted.split(',')[0]}
                  <span className="text-lg font-normal align-top">,{priceData.formattedDiscounted.split(',')[1]}€/mes</span>
                </div>
                {priceData.hasDiscount && (
                  <div className="mt-2 p-2 bg-gray-100 rounded-lg border border-gray-200">
                    <div className="text-sm text-gray-500 mb-1">Precio original:</div>
                    <div className="text-lg font-bold text-gray-400 line-through">
                      {priceData.formattedOriginal}€/mes
                    </div>
                    <div className="text-xs text-green-600 font-bold mt-1">
                      ¡Ahorras {priceData.savings.toFixed(2).replace('.', ',')}€/mes!
                    </div>
                  </div>
                )}
                <div className="text-xs text-gray-600 mt-1">
                  3 meses, luego 52,00€/mes
                </div>
                <div className="text-xs text-gray-500">
                  IVA incl.
                </div>
              </div>
              <button className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-8 rounded-lg transition-colors whitespace-nowrap">
                CONTINUAR
              </button>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
} 