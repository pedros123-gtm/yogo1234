'use client';

import { useState, useEffect } from 'react';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';
import FibraCard from './components/FibraCard';
import ConfiguradorFibra from './components/ConfiguradorFibra';
import BenefitsSection from './components/BenefitsSection';
import YoigoTVSection from './components/YoigoTVSection';
import WhyYoigoSection from './components/WhyYoigoSection';
import TariffTable from './components/TariffTable';
import { CartProvider } from './CartContext';

const fibraPlans = [
  {
    id: 'fibra-600-35gb',
    name: 'Fibra 600 Mb + 35 GB',
    description: 'Fibra 600 Mb + fijo + Móvil con 35 GB y llamadas infinitas',
    speed: '600 Mb',
    mobile: '35 GB',
    price: 47,
    originalPrice: 52,
    promoMonths: 3,
    badge: '35 GB',
    badgeColor: 'green-badge',
    services: ['Netflix'],
    features: [
      'Fibra 600 Mb + fijo',
      'Móvil con 35 GB',
      'y llamadas infinitas'
    ],
    addLine: 'Añade 2ª línea GRATIS >'
  },
  {
    id: 'fibra-600-infinito',
    name: 'Fibra 600 Mb + ∞ GB',
    description: 'Fibra 600 Mb + fijo + Móvil con GB infinitos y llamadas infinitas',
    speed: '600 Mb',
    mobile: 'GB infinitos',
    price: 64,
    originalPrice: 69,
    promoMonths: 3,
    badge: '∞ GB',
    badgeColor: 'blue-badge',
    services: ['Netflix', 'Disney+'],
    features: [
      'Fibra 600 Mb + fijo',
      'Móvil con GB infinitos',
      'y llamadas infinitas'
    ],
    addLine: 'Añade 2ª línea GRATIS >'
  },
  {
    id: 'fibra-1gb-infinito',
    name: 'Fibra 1 Gb + ∞ GB',
    description: 'Fibra 1 Gb + fijo + Móvil con GB infinitos y llamadas infinitas',
    speed: '1 Gb',
    mobile: 'GB infinitos',
    price: 64,
    originalPrice: 84,
    promoMonths: 3,
    badge: '∞ GB',
    badgeColor: 'blue-badge',
    services: ['Netflix', 'Prime', 'Disney+'],
    features: [
      'Fibra 1 Gb + fijo',
      'Móvil con GB infinitos',
      'y llamadas infinitas'
    ],
    specialOffer: 'Prime Incluido 0€!',
    addLine: 'Añade 2ª línea GRATIS >',
    bestSeller: true
  },
  {
    id: 'fibra-1gb-tv',
    name: 'Fibra 1 Gb + TV',
    description: 'Fibra 1 Gb + fijo + Móvil con GB infinitos + Yoigo TV',
    speed: '1 Gb',
    mobile: 'GB infinitos',
    price: 68,
    originalPrice: 88,
    promoMonths: 3,
    badge: '∞ GB',
    badgeColor: 'blue-badge',
    services: ['Yoigo TV + Deporte', 'Netflix', 'Prime', 'Disney+'],
    features: [
      'Fibra 1 Gb + fijo',
      'Móvil con GB infinitos',
      'y llamadas infinitas'
    ],
    addLine: 'Ver todas las ofertas'
  }
];

export default function FibraOpticaPage() {
  // Сохраняем текущую страницу для редиректа из payment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastTariffPage', '/fibra-optica');
    }
  }, []);

  return (
    <CartProvider>
      <>
        <Header />
        
        <main className="bg-gray-50 font-sans min-h-screen">
          <div className="container mx-auto px-4 py-6 md:py-8">
            {/* Title */}
            <div className="text-center mb-8">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 text-shadow">
                TARIFAS DE FIBRA Y MÓVIL 5G
              </h1>
              <div className="text-right">
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white focus:ring-2 focus:ring-pink-500 focus:border-transparent">
                  <option>IVA incl.</option>
                </select>
              </div>
            </div>

            {/* Tariff Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {fibraPlans.map((plan) => (
                <FibraCard key={plan.id} plan={plan} />
              ))}
            </div>

            {/* Configurator Section */}
            <ConfiguradorFibra />

            {/* Yoigo TV Section */}
            <YoigoTVSection />

            {/* Benefits Section */}
            <BenefitsSection />

            {/* Why Choose Yoigo Section */}
            <WhyYoigoSection />

            {/* Tariff Table */}
            <TariffTable />
          </div>
        </main>
        
        <Footer />
      </>
    </CartProvider>
  );
} 