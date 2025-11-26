'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';
import FeaturesSection from '../tarifas-moviles/components/FeaturesSection';
import { CartProvider as TarifasCartProvider, useCart as useTarifasCart } from '../tarifas-moviles/CartContext';
import { CartProvider as FibraCartProvider, useCart as useFibraCart } from '../fibra-optica/CartContext';
import { TVCartProvider, useTVCart } from '../tv/CartContext';

function CartPageContent() {
  const router = useRouter();
  const tarifasCart = useTarifasCart();
  const fibraCart = useFibraCart();
  const tvCart = useTVCart();

  // Определяем, какая корзина активна
  const cart = tarifasCart.cart || fibraCart.cart || tvCart.cart;
  const cartType = tarifasCart.cart ? 'tarifas' : fibraCart.cart ? 'fibra' : tvCart.cart ? 'tv' : null;
  const isHydrated = tarifasCart.isHydrated && fibraCart.isHydrated && tvCart.isHydrated;

  const clearCart = () => {
    if (cartType === 'tarifas') {
      tarifasCart.clearCart();
    } else if (cartType === 'fibra') {
      fibraCart.clearCart();
    } else if (cartType === 'tv') {
      tvCart.clearCart();
    }
  };

  // Показываем загрузку во время гидратации
  if (!isHydrated) {
    return (
      <>
        <Header />
        <main className="bg-gray-50 font-sans">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">CARGANDO...</h1>
              <div className="tariff-card p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mx-auto mb-4"></div>
                  <div className="h-4 bg-gray-300 rounded w-1/2 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Преимущества для страницы корзины
  const cartFeatures = [
    {
      icon: "/images/icon-5g.svg",
      title: "Red 5G",
      description: "Disfruta de la máxima velocidad en tu móvil con nuestra red 5G.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%234CAF50'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M24 20h16v4H24zm0 8h12v4H24zm0 8h8v4h-8z'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon-free.svg",
      title: "Envío gratis",
      description: "Te enviamos la SIM a casa de manera gratuita en 24-48 horas.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%234CAF50'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M20 24l4-4 4 4 4-4 4 4'/%3E%3C/svg%3E"
    },
    {
      icon: "/images/icon.svg",
      title: "Sin permanencia",
      description: "Contrata sin compromiso. Puedes cambiar o cancelar cuando quieras.",
      fallbackIcon: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64' fill='%23FF9800'%3E%3Cpath d='M32 4C16.536 4 4 16.536 4 32s12.536 28 28 28 28-12.536 28-28S47.464 4 32 4zm0 48c-11.046 0-20-8.954-20-20S20.954 12 32 12s20 8.954 20 20-8.954 20-20 20z'/%3E%3Cpath d='M20 24l4-4 4 4 4-4 4 4'/%3E%3C/svg%3E"
    }
  ];

  if (!cart) {
    return (
      <>
        <Header />
        <main className="bg-gray-50 font-sans">
          <div className="container mx-auto px-4 py-6 md:py-8">
            <div className="max-w-md mx-auto text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">CARRITO VACÍO</h1>
              <div className="tariff-card p-6">
                <p className="text-gray-600 mb-6">No hay productos en tu carrito</p>
                <div className="space-y-3">
                  <button 
                    className="btn-green w-full" 
                    onClick={() => {
                      router.push('/tarifas-moviles');
                    }}
                  >
                    VER TARIFAS MÓVIL
                  </button>
                  <button 
                    className="btn-green w-full" 
                    onClick={() => {
                      router.push('/fibra-optica');
                    }}
                  >
                    VER FIBRA Y MÓVIL
                  </button>
                  <button 
                    className="btn-green w-full" 
                    onClick={() => {
                      router.push('/tv');
                    }}
                  >
                    VER TV + MÓVIL
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  // Функция для renderizar contenido específico del tipo de plan
  const renderCartContent = () => {
    if (cartType === 'tv') {
      // Renderizado para planes TV + Móvil
      const tvCartData = cart as any; // TVPlan type
      const priceStr = String(tvCartData.price);
      return (
        <>
          <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
            {priceStr.split(',')[0]}<span className="text-xl md:text-2xl">,{priceStr.split(',')[1] || '00'}</span>
          </div>
          <div className="text-gray-600 mb-2">€/mes</div>
          <div className="text-sm text-gray-500 mb-4 md:mb-6">IVA incl.</div>
          
          <h2 className="text-xl font-bold mb-4">{tvCartData.name}</h2>
          
          {tvCartData.after12 && (
            <div className="text-sm text-gray-700 mb-4">{tvCartData.after12}</div>
          )}
          
          <div className="text-left mb-6">
            <div className="flex items-center mb-2">
              <i className="fas fa-tv text-pink-600 mr-2"></i> 
              <span>TV Yoigo incluida</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-mobile-alt text-pink-600 mr-2"></i> 
              <span>Móvil {tvCartData.mobileData}</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-phone text-pink-600 mr-2"></i> 
              <span>Llamadas infinitas</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-shipping-fast text-pink-600 mr-2"></i> 
              <span>Envío y SIM gratis</span>
            </div>
          </div>

          {tvCartData.additionalLines && tvCartData.additionalLines.length > 0 && (
            <div className="border-t pt-4 mb-4 text-left">
              <h3 className="font-semibold mb-2">Líneas adicionales:</h3>
              {tvCartData.additionalLines.map((line: any, i: number) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>{line.name} × {line.count}</span>
                  <span>{line.price} €/mes</span>
                </div>
              ))}
            </div>
          )}

          {tvCartData.tvServices && tvCartData.tvServices.length > 1 && (
            <div className="border-t pt-4 mb-4 text-left">
              <h3 className="font-semibold mb-2">Servicios TV adicionales:</h3>
              {tvCartData.tvServices.filter((service: string) => service !== 'yoigo-tv').map((service: string, i: number) => (
                <div key={i} className="flex items-center mb-1">
                  <i className="fas fa-play-circle text-pink-600 mr-2"></i>
                  <span>{service.toUpperCase()}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{tvCartData.price} €/mes</span>
            </div>
          </div>
        </>
      );
    } else if (cartType === 'tarifas') {
      // Renderizado para planes móviles
      const mobileCart = cart as any; // CartTariff type
      const priceStr = String(mobileCart.price);
      return (
        <>
          <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
            {priceStr.split(',')[0]}<span className="text-xl md:text-2xl">,{priceStr.split(',')[1] || '00'}</span>
          </div>
          <div className="text-gray-600 mb-2">€/mes</div>
          <div className="text-sm text-gray-500 mb-4 md:mb-6">IVA incl.</div>
          
          <h2 className="text-xl font-bold mb-4">{mobileCart.name}</h2>
          
          {mobileCart.after12 && (
            <div className="text-sm text-gray-700 mb-4">{mobileCart.after12}</div>
          )}
          
          <div className="text-left mb-6">
            <div className="flex items-center mb-2">
              <i className="fas fa-mobile-alt text-pink-600 mr-2"></i> 
              <span>{mobileCart.description}</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-phone text-pink-600 mr-2"></i> 
              <span>Llamadas infinitas</span>
            </div>
            <div className="flex items-center mb-2">
              <i className="fas fa-shipping-fast text-pink-600 mr-2"></i> 
              <span>Envío y SIM gratis</span>
            </div>
          </div>

          {mobileCart.lines && mobileCart.lines.length > 0 && (
            <div className="border-t pt-4 mb-4 text-left">
              <h3 className="font-semibold mb-2">Líneas adicionales:</h3>
              {mobileCart.lines.map((l: any, i: number) => (
                <div key={i} className="flex justify-between text-sm mb-1">
                  <span>{l.label} × {l.count}</span>
                  <span>{l.price} €/mes</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{mobileCart.price} €/mes</span>
            </div>
          </div>
        </>
      );
    } else if (cartType === 'fibra') {
      // Renderizado para planes fibra
      const fibraCartData = cart as any; // FibraPlan type
      return (
        <>
          <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
            {fibraCartData.price}<span className="text-xl md:text-2xl">,00</span>
          </div>
          <div className="text-gray-600 mb-2">€/mes</div>
          <div className="text-sm text-gray-500 mb-4 md:mb-6">IVA incl.</div>
          
          <h2 className="text-xl font-bold mb-4">{fibraCartData.name}</h2>
          
          <div className="text-sm text-gray-700 mb-4">
            {fibraCartData.promoMonths} meses, luego {fibraCartData.originalPrice},00€/mes
          </div>
          
          <div className="text-left mb-6">
            {fibraCartData.features && fibraCartData.features.map((feature: string, index: number) => (
              <div key={index} className="flex items-center mb-2">
                <i className="fas fa-wifi text-pink-600 mr-2"></i> 
                <span>{feature}</span>
              </div>
            ))}
          </div>

          {fibraCartData.services && fibraCartData.services.length > 0 && (
            <div className="border-t pt-4 mb-4 text-left">
              <h3 className="font-semibold mb-2">Servicios incluidos:</h3>
              {fibraCartData.services.map((service: string, index: number) => (
                <div key={index} className="flex items-center mb-1">
                  <i className="fas fa-tv text-pink-600 mr-2"></i>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          )}

          <div className="border-t pt-4 mb-6">
            <div className="flex justify-between items-center text-lg font-bold">
              <span>Total:</span>
              <span>{fibraCartData.price},00 €/mes</span>
            </div>
          </div>
        </>
      );
    }
  };

  const handleSubmit = async () => {
    // Navigate to payment page instead of calling API directly
    router.push('/payment');
  };

  const getBackUrl = () => {
    if (cartType === 'tarifas') return '/tarifas-moviles';
    if (cartType === 'fibra') return '/fibra-optica';
    if (cartType === 'tv') return '/tv';
    return '/';
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-md mx-auto text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8">TU PEDIDO</h1>
            
            <div className="tariff-card p-6">
              {renderCartContent()}
              
              <div className="space-y-3">
                <button 
                  className="btn-green w-full" 
                  onClick={handleSubmit}
                >
                  CONTRATAR AHORA
                </button>
                <button 
                  className="btn-outline w-full" 
                  onClick={() => router.push(getBackUrl())}
                >
                  VOLVER
                </button>
                <button 
                  className="text-red-600 hover:text-red-800 text-sm underline" 
                  onClick={clearCart}
                >
                  Vaciar carrito
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <FeaturesSection title="¿POR QUÉ ELEGIR YOIGO?" features={cartFeatures} />
      </main>
      <Footer />
    </>
  );
}

export default function CartPage() {
  return <CartPageContent />;
} 