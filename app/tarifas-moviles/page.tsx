'use client';

import React, { useEffect } from 'react';
import Header from './components/Header';
import Footer from './components/Footer';
import TariffCard from './components/TariffCard';
import ConfiguraTarifa from './components/ConfiguraTarifa';
import FeaturesSection from './components/FeaturesSection';
import TariffTable from './components/TariffTable';
import { CartProvider } from './CartContext';
import Link from 'next/link';

export default function TarifasMoviles() {
  // Сохраняем текущую страницу для редиректа из payment
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('lastTariffPage', '/tarifas-moviles');
    }
  }, []);

  // Данные для карточек тарифов
  const tariffCards = [
    {
      price: "8,00",
      originalPrice: "10,00",
      discount: "10 GB",
      badgeType: "price" as const,
      data: "10 GB",
      features: [
        "Móvil con 10 GB y llamadas infinitas",
        "Sin permanencia"
      ]
    },
    {
      price: "12,80",
      originalPrice: "16,00",
      discount: "25 GB",
      badgeType: "orange" as const,
      data: "25 GB",
      features: [
        "Móvil con 25 GB y llamadas infinitas",
        "Sin permanencia"
      ]
    },
    {
      price: "28,00",
      originalPrice: "35,00",
      discount: "∞ GB",
      badgeType: "green" as const,
      data: "GB infinitos",
      features: [
        "Móvil con GB infinitos y llamadas infinitas",
        "Sin permanencia"
      ],
      isPopular: true
    }
  ];

  // Данные для таблицы тарифов
  const tariffTableData = [
    { data: "500 MB", minutes: "infinitas", price: "6,00" },
    { data: "10 GB", minutes: "infinitas", price: "8,00", originalPrice: "10,00" },
    { data: "25 GB", minutes: "infinitas", price: "12,80", originalPrice: "16,00" },
    { data: "55 GB", minutes: "infinitas", price: "20,80", originalPrice: "26,00" },
    { data: "GB infinitos", minutes: "infinitas", price: "28,00", originalPrice: "35,00" }
  ];

  // Данные для секции преимуществ
  const whyChooseFeatures = [
    {
      icon: "/images/icon-satisfaction.svg",
      title: "Nuestros clientes nos recomiendan",
      description: "Los clientes Yoigo recomiendan la compañía más que los clientes de otros operadores.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%23E52E8A'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M32 20c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm0 18c-3.314 0-6-2.686-6-6s2.686-6 6-6 6 2.686 6 6-2.686 6-6 6z'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon-5g.svg",
      title: "Velocidad 5G en tu móvil",
      description: "Con nuestra red 5G podrás navegar a máxima velocidad con tu móvil.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%234CAF50'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M24 20h16v4H24zm0 8h12v4H24zm0 8h8v4h-8z'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon.svg",
      title: "Sin Permanencia",
      description: "Queremos que te quedes con nosotros porque quieres. En Yoigo, nuestras tarifas de móvil no tienen permanencia.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%23FF9800'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M20 24l4-4 4 4 4-4 4 4'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon-yourock.svg",
      title: "Venirte será coser y cantar",
      description: "Queremos ponerte las cosas muuuy fáciles así que nosotros nos ocupamos de todo el proceso.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%23E52E8A'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M20 24l4-4 4 4 4-4 4 4'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon-free.svg",
      title: "Envío gratis",
      description: "Venirte a Yoigo no te va a costar ni un euro. Te enviamos la SIM a casa de manera gratuita.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%234CAF50'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M20 24l4-4 4 4 4-4 4 4'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon-ticket.svg",
      title: "Líneas adicionales con descuento",
      description: "Queremos que ahorres al máximo, por eso todas las líneas adicionales que te lleves tienen descuento.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%23FF9800'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M20 24l4-4 4 4 4-4 4 4'/%3E%3C/svg%3E"
    }
  ];

  return (
    <>
      <Header />

      {/* Main Content */}
      <main className="bg-gray-50 font-sans">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center">TARIFAS MÓVIL 5G</h1>
          
          {/* Main Tariff Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {tariffCards.map((tariff, index) => (
              <TariffCard key={index} {...tariff} />
            ))}
          </div>

          {/* Configuration Section */}
          <ConfiguraTarifa />

          {/* Discount Section */}
          <div className="bg-pink-100 rounded-custom p-6 md:p-8 mb-8 md:mb-12 flex flex-col md:flex-row items-center">
            <img 
              src="/images/93-birthday-present.svg" 
              alt="Gift icon" 
              className="w-12 h-12 md:w-16 md:h-16 mb-4 md:mb-0 md:mr-6"
              onError={(e) => {
                e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='%23E52E8A'%3E%3Cpath d='M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z'/%3E%3C/svg%3E";
              }}
            />
            <div className="text-center md:text-left">
              <h2 className="text-xl md:text-2xl font-bold yoigo-pink-text mb-2">20% de descuento durante 1 año</h2>
              <p className="text-gray-700">Ahora al contratar una tarifa móvil te llevas un descuento del 20% durante el primer año (ya incluido).</p>
            </div>
          </div>

          {/* Benefits Section */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-8 md:mb-12">ADEMÁS, POR SER DE YOIGO...</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 mb-8 md:mb-12">
            {/* MultiSIM */}
            <div className="tariff-card overflow-hidden">
              <img 
                src="/images/distri-5-g-img-copy_2x.webp" 
                alt="MultiSIM" 
                className="feature-image"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x200/E52E8A/FFFFFF?text=MultiSIM+Apple";
                }}
              />
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3">MultiSIM, ahora también con Apple</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">Aprovecha todas las ventajas que tiene MultiSIM utilizando datos y llamadas simultáneamente en dos dispositivos.</p>
                <p className="text-gray-600 mb-4 text-sm md:text-base">Además, ahora puedes conectar tu iPhone y Apple Watch o iPad mediante MultiSIM, compartiendo tu número de teléfono Yoigo.</p>
                <a href="#" className="yoigo-pink-text font-bold text-sm md:text-base">Saber más</a>
              </div>
            </div>

            {/* 5G Coverage */}
            <div className="tariff-card overflow-hidden">
              <img 
                src="/images/group-4-copy_2x.webp" 
                alt="5G Coverage" 
                className="feature-image"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x200/4CAF50/FFFFFF?text=5G+Cobertura";
                }}
              />
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3">Cobertura móvil 5G</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">Navega a toda pastilla con la red 5G de Yoigo, descarga archivos en segundos, juega online y haz videollamadas sin cortes.</p>
                <p className="text-gray-600 mb-4 text-sm md:text-base">Disponible para todos los que tengan una tarifa de móvil con Yoigo, sin ningún tipo de límite ¡y sin subir el precio!</p>
                <a href="#" className="yoigo-pink-text font-bold text-sm md:text-base">Consulta la cobertura en tu zona</a>
              </div>
            </div>

            {/* Energy */}
            <div className="tariff-card overflow-hidden md:col-span-2 lg:col-span-1">
              <img 
                src="/images/distri-sonora-img-copy-2_2x.webp" 
                alt="Energy" 
                className="feature-image"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/400x200/FF9800/FFFFFF?text=Energía+Verde";
                }}
              />
              <div className="p-4 md:p-6">
                <h3 className="text-lg md:text-xl font-bold mb-3">Trae la luz y llévate 72€/año</h3>
                <p className="text-gray-600 mb-4 text-sm md:text-base">Contrata la energía verde de Yoigo y te descontamos 6€/mes (IVA incl.) en tu factura de telefonía para siempre.</p>
                <p className="text-gray-600 mb-4 text-sm md:text-base">Y además, por contratar online ahora te puedes llevar 30€ de descuento extra.</p>
                <a href="#" className="yoigo-pink-text font-bold text-sm md:text-base">Descubre nuestras tarifas de luz</a>
              </div>
            </div>
          </div>

          {/* Why Choose Yoigo */}
          <FeaturesSection 
            title="¿POR QUÉ ELEGIR UNA TARIFA YOIGO PARA MI MÓVIL?" 
            features={whyChooseFeatures} 
          />

          {/* Tariff Table */}
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 md:mb-8">Tarifas Solo Móvil</h2>
          <TariffTable tariffs={tariffTableData} />

          {/* Additional Content Sections */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 mb-8 md:mb-12">
            <div>
              <h2 className="text-xl md:text-2xl font-bold mb-4">Nuestras tarifas móvil más baratas para hablar y navegar</h2>
              
              <h3 className="text-lg md:text-xl font-bold mb-3">Elige los gigas que quieres.</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">Con nuestras tarifas móviles, elige los datos que quieres gastar, tienes tarifas para smartphone de 500 MB, 25 GB, 55 GB o infinita y todo a Alta velocidad 5G. Consulta la velocidad de los servicios de Yoigo en tarifas móviles <a href="#" className="yoigo-pink-text font-bold">aquí</a>.</p>
              
              <h3 className="text-lg md:text-xl font-bold mb-3">Llamadas más baratas</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">Si te encanta hablar por teléfono tenemos muchas ofertas de tarifas móviles que incluyen llamadas infinitas. ¡Llama todo lo que quieras con nuestras tarifas móviles!</p>
            </div>
            <div>
              <img 
                src="/images/zigzag-pospago-1_2x.webp" 
                alt="Mobile offers" 
                className="w-full rounded-custom mb-6"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x300/E52E8A/FFFFFF?text=Ofertas+Móviles";
                }}
              />
            </div>
          </div>

          {/* Bottom Section with Image on Left */}
          <div className="flex flex-col lg:flex-row gap-8 md:gap-12 mb-8 md:mb-12 items-center">
            <div className="lg:w-1/2">
              <img 
                src="/images/zig-zag-fmc-2_2x.webp" 
                alt="Unlimited tariff" 
                className="w-full rounded-custom"
                onError={(e) => {
                  e.currentTarget.src = "https://via.placeholder.com/600x300/4CAF50/FFFFFF?text=Tarifa+Ilimitada";
                }}
              />
            </div>
            <div className="lg:w-1/2">
              <h2 className="text-xl md:text-2xl font-bold mb-4">Tarifas con llamadas ilimitadas para hablar y hablar..</h2>
              
              <h3 className="text-lg md:text-xl font-bold mb-3">Sin permanencia</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">Si te vienes con alguna de nuestras ofertas de tarifas móviles solo SIM no tendrás permanencia, pero si te vienes con alguno de nuestro móviles libres puedes tener una permanencia de 24 meses. Cuando selecciones un móvil podrás verlo.</p>
              
              <h3 className="text-lg md:text-xl font-bold mb-3">Mejor Cobertura 5G</h3>
              <p className="text-gray-600 mb-6 text-sm md:text-base">Navegarás a <strong>alta velocidad 5G</strong> y tendrás la mejor cobertura en tu móvil. ¿Por qué? Porque tendrás acceso a las principales redes de <strong>cobertura 5G</strong> de España. Aprovecha nuestras ofertas en tarifas móviles para disfrutar por fin de tu smartphone como siempre has querido: desde cualquier lugar.</p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
} 