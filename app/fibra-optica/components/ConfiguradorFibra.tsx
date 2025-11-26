'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '../CartContext';
import { useCart as useTarifasCart } from '../../tarifas-moviles/CartContext';
import { useTVCart } from '../../tv/CartContext';
import { applyGlobalDiscount, DiscountBadge } from '../../../utils/discount';

const ConfiguradorFibra: React.FC = () => {
  const router = useRouter();
  const { addToCart } = useCart();
  const { clearCart } = useTarifasCart();
  const { clearCart: clearTVCart } = useTVCart();
  
  const [selectedTab, setSelectedTab] = useState('solo'); // 'netflix' or 'solo'
  const [selectedSpeed, setSelectedSpeed] = useState('600MB');
  const [selectedMobile, setSelectedMobile] = useState('35GB');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [additionalLines, setAdditionalLines] = useState({
    duo: 0,
    sinfin500: 0,
    sinfin35: 0
  });
  const [tvServices, setTvServices] = useState({
    yoigo: false,
    netflix: true, // Always selected by default for Netflix tab
    max: false,
    prime: false,
    disney: false
  });
  const [price, setPrice] = useState(47);

  const calculatePrice = () => {
    let basePrice = 35;
    
    // Speed pricing
    if (selectedSpeed === '600MB') basePrice += 5;
    if (selectedSpeed === '1GB') basePrice += 10;
    
    // Mobile pricing
    if (selectedMobile === '35GB') basePrice += 7;
    if (selectedMobile === '55GB') basePrice += 12;
    if (selectedMobile === 'INFINITO') basePrice += 20;
    
    // Netflix tab adds base cost
    if (selectedTab === 'netflix') {
      basePrice += 8; // Netflix base cost
      
      // Additional TV services pricing (only for Netflix tab)
      if (tvServices.yoigo) basePrice += 5;
      if (tvServices.max) basePrice += 6;
      if (tvServices.prime) basePrice += 4;
      if (tvServices.disney) basePrice += 7;
    }
    
    // Additional lines pricing
    basePrice += additionalLines.duo * 15;
    basePrice += additionalLines.sinfin500 * 25;
    basePrice += additionalLines.sinfin35 * 20;
    
    setPrice(basePrice);
  };

  // Применяем глобальную скидку к цене
  const priceData = applyGlobalDiscount(price);

  const updateAdditionalLine = (type: string, change: number) => {
    setAdditionalLines(prev => ({
      ...prev,
      [type]: Math.max(0, prev[type as keyof typeof prev] + change)
    }));
  };

  const updateTvService = (service: string) => {
    if (service === 'netflix') return; // Netflix can't be unchecked
    
    setTvServices(prev => ({
      ...prev,
      [service]: !prev[service as keyof typeof prev]
    }));
  };

  const getTotalAdditionalLines = () => {
    return additionalLines.duo + additionalLines.sinfin500 + additionalLines.sinfin35;
  };

  const handleContinue = () => {
    // Create services array based on selected TV services
    const services = [];
    if (selectedTab === 'netflix' || tvServices.netflix) services.push('Netflix');
    if (tvServices.prime) services.push('Prime');
    if (tvServices.disney) services.push('Disney+');
    if (tvServices.yoigo) services.push('Yoigo TV');
    if (tvServices.max) services.push('Max');

    // Create configured plan
    const configuredPlan = {
      id: `configured-${Date.now()}`,
      name: `Fibra ${selectedSpeed} + Móvil ${selectedMobile}`,
      description: services.length > 0 ? `Incluye: ${services.join(', ')}` : 'Plan personalizado',
      speed: selectedSpeed,
      mobile: selectedMobile,
      price: priceData.discountedPrice,
      originalPrice: priceData.hasDiscount ? price : price + 5,
      promoMonths: 3,
      badge: selectedMobile === 'INFINITO' ? '∞' : selectedMobile.replace(' GB', ''),
      badgeColor: selectedMobile === 'INFINITO' ? 'green' : 'orange',
      services: services,
      features: [
        `Fibra ${selectedSpeed}`,
        `Móvil ${selectedMobile}`,
        'Llamadas infinitas',
        'Instalación y router GRATIS'
      ],
      addLine: 'Añadir línea adicional desde 10€/mes',
      specialOffer: `3 meses, luego ${priceData.hasDiscount ? priceData.formattedOriginal : price + 5},00€/mes`,
      bestSeller: false
    };

    addToCart(configuredPlan);
    clearCart();
    clearTVCart();
    router.push('/cart');
  };

  // Reset TV services when switching tabs
  React.useEffect(() => {
    if (selectedTab === 'netflix') {
      setTvServices(prev => ({ ...prev, netflix: true }));
    }
  }, [selectedTab]);

  React.useEffect(() => {
    calculatePrice();
  }, [selectedTab, selectedSpeed, selectedMobile, additionalLines, tvServices]);

  return (
    <section className="bg-white p-6 mb-8 relative">
      {/* Global Discount Badge */}
      <DiscountBadge discount={priceData.discountPercent} />
      
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">CONFIGURA TU TARIFA FIBRA Y MÓVIL</h2>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {/* Service Type Toggle */}
          <div className="flex justify-center mb-6">
            <div className="bg-gray-200 rounded-full p-1 flex">
              <button 
                onClick={() => setSelectedTab('netflix')}
                className={`px-6 py-3 rounded-full font-semibold flex items-center ${
                  selectedTab === 'netflix' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                  selectedTab === 'netflix' ? 'bg-blue-600' : 'border-2 border-gray-400'
                }`}>
                  {selectedTab === 'netflix' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                </span>
                Con <span className="text-red-600 font-black ml-1">NETFLIX</span>
              </button>
              <button 
                onClick={() => setSelectedTab('solo')}
                className={`px-6 py-3 rounded-full font-semibold flex items-center ${
                  selectedTab === 'solo' 
                    ? 'bg-blue-500 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <span className={`w-4 h-4 rounded-full mr-2 flex items-center justify-center ${
                  selectedTab === 'solo' ? 'bg-blue-600' : 'border-2 border-gray-400'
                }`}>
                  {selectedTab === 'solo' && <span className="w-2 h-2 bg-white rounded-full"></span>}
                </span>
                Solo fibra y móvil
              </button>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            {/* Fiber Speed */}
            <div>
              <h3 className="font-bold mb-4 text-gray-800">Velocidad de fibra</h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="speed"
                    value="600MB"
                    checked={selectedSpeed === '600MB'}
                    onChange={(e) => setSelectedSpeed(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedSpeed === '600MB' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    600 Mb
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="speed"
                    value="1GB"
                    checked={selectedSpeed === '1GB'}
                    onChange={(e) => setSelectedSpeed(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedSpeed === '1GB' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    1 Gb
                  </span>
                </label>
              </div>
            </div>
            
            {/* Mobile Plan */}
            <div>
              <h3 className="font-bold mb-4 text-gray-800">Línea móvil principal</h3>
              <div className="space-y-3">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="mobile"
                    value="35GB"
                    checked={selectedMobile === '35GB'}
                    onChange={(e) => setSelectedMobile(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMobile === '35GB' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    35 GB
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="mobile"
                    value="55GB"
                    checked={selectedMobile === '55GB'}
                    onChange={(e) => setSelectedMobile(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMobile === '55GB' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    55 GB
                  </span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input
                    type="radio"
                    name="mobile"
                    value="INFINITO"
                    checked={selectedMobile === 'INFINITO'}
                    onChange={(e) => setSelectedMobile(e.target.value)}
                    className="sr-only"
                  />
                  <span className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                    selectedMobile === 'INFINITO' 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-blue-100 text-blue-800'
                  }`}>
                    ∞ GB
                  </span>
                </label>
              </div>
            </div>
            
            {/* Additional Lines */}
            <div className="relative">
              <h3 className="font-bold mb-4 text-gray-800">Añade más líneas móviles</h3>
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none text-left flex items-center justify-between"
                >
                  <div className="flex items-center">
                    <i className="fas fa-mobile-alt mr-2 text-gray-600"></i>
                    <span>
                      {getTotalAdditionalLines() > 0 
                        ? `${getTotalAdditionalLines()} línea${getTotalAdditionalLines() > 1 ? 's' : ''} seleccionada${getTotalAdditionalLines() > 1 ? 's' : ''}`
                        : 'Selecciona las líneas'
                      }
                    </span>
                  </div>
                  <i className={`fas fa-chevron-${isDropdownOpen ? 'up' : 'down'} text-gray-400 transition-transform`}></i>
                </button>
                
                {isDropdownOpen && (
                  <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                    <div className="p-4 space-y-4">
                      {/* Línea DÚO */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <div className="font-semibold text-gray-800">Línea DÚO</div>
                          <div className="text-sm text-gray-600">GB compartidos y llamadas infinitas</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateAdditionalLine('duo', -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            disabled={additionalLines.duo === 0}
                          >
                            <i className="fas fa-minus text-gray-600 text-sm"></i>
                          </button>
                          <span className="w-8 text-center font-semibold">{additionalLines.duo}</span>
                          <button
                            onClick={() => updateAdditionalLine('duo', 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-plus text-gray-600 text-sm"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* La Sinfín 500MB */}
                      <div className="flex items-center justify-between py-3 border-b border-gray-100">
                        <div>
                          <div className="font-semibold text-gray-800">La Sinfín 500MB</div>
                          <div className="text-sm text-gray-600">500 MB y llamadas infinitas</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateAdditionalLine('sinfin500', -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            disabled={additionalLines.sinfin500 === 0}
                          >
                            <i className="fas fa-minus text-gray-600 text-sm"></i>
                          </button>
                          <span className="w-8 text-center font-semibold">{additionalLines.sinfin500}</span>
                          <button
                            onClick={() => updateAdditionalLine('sinfin500', 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-plus text-gray-600 text-sm"></i>
                          </button>
                        </div>
                      </div>
                      
                      {/* La Sinfín 35GB */}
                      <div className="flex items-center justify-between py-3">
                        <div>
                          <div className="font-semibold text-gray-800">La Sinfín 35GB</div>
                          <div className="text-sm text-gray-600">35 GB y llamadas infinitas</div>
                        </div>
                        <div className="flex items-center space-x-3">
                          <button
                            onClick={() => updateAdditionalLine('sinfin35', -1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                            disabled={additionalLines.sinfin35 === 0}
                          >
                            <i className="fas fa-minus text-gray-600 text-sm"></i>
                          </button>
                          <span className="w-8 text-center font-semibold">{additionalLines.sinfin35}</span>
                          <button
                            onClick={() => updateAdditionalLine('sinfin35', 1)}
                            className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:bg-gray-100 transition-colors"
                          >
                            <i className="fas fa-plus text-gray-600 text-sm"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* TV Services - Only show when Netflix tab is selected */}
          {selectedTab === 'netflix' && (
            <div className="mb-6">
              <h3 className="font-bold mb-4 text-gray-800">Televisión</h3>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                {/* YOIGO TV */}
                <div className="text-center">
                  <div 
                    onClick={() => updateTvService('yoigo')}
                    className={`border-2 p-3 rounded-lg cursor-pointer transition-colors h-16 flex items-center justify-center ${
                      tvServices.yoigo 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tvServices.yoigo}
                      onChange={() => updateTvService('yoigo')}
                      className="mr-2 flex-shrink-0"
                    />
                    <div className="flex items-center space-x-1">
                      <span className="text-black text-sm font-bold">YOIGO</span>
                      <span className="bg-blue-600 text-white px-2 py-1 rounded text-sm font-bold">TV</span>
                    </div>
                  </div>
                </div>
                
                {/* NETFLIX - Always checked */}
                <div className="text-center">
                  <div className="border-4 border-red-500 bg-red-50 p-4 rounded-lg h-16 flex items-center justify-center">
                    <input
                      type="checkbox"
                      checked={true}
                      disabled={true}
                      className="mr-2"
                    />
                    <img 
                      src="/images/netflix-svgrepo-com.svg" 
                      alt="Netflix" 
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
                
                {/* MAX */}
                <div className="text-center">
                  <div 
                    onClick={() => updateTvService('max')}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-colors h-16 flex items-center justify-center ${
                      tvServices.max 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tvServices.max}
                      onChange={() => updateTvService('max')}
                      className="mr-2"
                    />
                    <span className="text-black font-black text-lg">max</span>
                  </div>
                </div>
                
                {/* PRIME */}
                <div className="text-center">
                  <div 
                    onClick={() => updateTvService('prime')}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-colors h-16 flex items-center justify-center ${
                      tvServices.prime 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tvServices.prime}
                      onChange={() => updateTvService('prime')}
                      className="mr-2"
                    />
                    <img 
                      src="/images/prime-svgrepo-com.svg" 
                      alt="Prime" 
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
                
                {/* DISNEY+ */}
                <div className="text-center">
                  <div 
                    onClick={() => updateTvService('disney')}
                    className={`border-2 p-4 rounded-lg cursor-pointer transition-colors h-16 flex items-center justify-center ${
                      tvServices.disney 
                        ? 'border-blue-500 bg-blue-50' 
                        : 'border-gray-300 bg-white hover:border-blue-300'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={tvServices.disney}
                      onChange={() => updateTvService('disney')}
                      className="mr-2"
                    />
                    <img 
                      src="/images/brand-disney-svgrepo-com.svg" 
                      alt="Disney+" 
                      className="h-8 w-auto"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {/* Included Features */}
          <div className="text-sm text-gray-600 bg-green-50 p-4 rounded-lg">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-green-500 mr-3"></i>
              <span className="font-semibold">Incluye teléfono fijo con llamadas, llamadas infinitas en móvil, cobertura 5G, instalación y router GRATIS.</span>
            </div>
          </div>
        </div>
        
        {/* Price Summary */}
        <div className="bg-gray-50 p-6 rounded-lg border-2 border-gray-200">
          <div className="text-center">
            <div className="text-4xl font-bold text-gray-800 mb-1">
              {priceData.formattedDiscounted.split(',')[0]}<span className="text-xl">,{priceData.formattedDiscounted.split(',')[1]}</span>
            </div>
            {priceData.hasDiscount && (
              <div className="text-sm text-gray-400 line-through mb-1">
                {priceData.formattedOriginal}€/mes
              </div>
            )}
            <div className="text-gray-600 font-semibold mb-1">€/mes</div>
            <div className="text-sm text-gray-500 mb-1">IVA incl.</div>
            <div className="text-sm font-semibold text-gray-700 mb-1">Precio final</div>
            <div className="text-sm text-gray-500 mb-6">3 meses, luego {priceData.hasDiscount ? priceData.formattedOriginal : price + 5},00€/mes</div>
            
            <button 
              className="bg-green-600 hover:bg-green-700 text-white w-full py-3 rounded-lg font-bold transition-colors" 
              style={{ backgroundColor: '#7CB342' }}
              onClick={handleContinue}
            >
              CONTINUAR
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ConfiguradorFibra; 