'use client';

import React from 'react';
import { useCart } from './CartContext';
import { useRouter } from 'next/navigation';
import Header from './components/Header';
import Footer from './components/Footer';
import FeaturesSection from './components/FeaturesSection';

export default function CartPage() {
  const { cart, clearCart } = useCart();
  const router = useRouter();

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
                <button 
                  className="btn-green w-full" 
                  onClick={() => router.push('/tarifas-moviles')}
                >
                  VER TARIFAS
                </button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans">
        <div className="container mx-auto px-4 py-6 md:py-8">
          {/* Page Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center">TU PEDIDO</h1>
          
          {/* Карточка заказа */}
          <div className="max-w-md mx-auto mb-8 md:mb-12">
            <div className="tariff-card p-6 text-center">
              <div className="text-5xl md:text-6xl font-bold text-gray-800 mb-2">
                {cart.price.split(',')[0]}<span className="text-xl md:text-2xl">,{cart.price.split(',')[1] || '00'}</span>
              </div>
              <div className="text-gray-600 mb-2">€/mes</div>
              <div className="text-sm text-gray-500 mb-4 md:mb-6">IVA incl.</div>
              
              <h2 className="text-xl font-bold mb-4">{cart.name}</h2>
              
              {cart.after12 && (
                <div className="text-sm text-gray-700 mb-4">{cart.after12}</div>
              )}
              
              <div className="text-left mb-6">
                <div className="flex items-center mb-2">
                  <i className="fas fa-mobile-alt text-pink-600 mr-2"></i> 
                  <span>{cart.description}</span>
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

              {cart.lines && cart.lines.length > 0 && (
                <div className="border-t pt-4 mb-4 text-left">
                  <h3 className="font-semibold mb-2">Líneas adicionales:</h3>
                  {cart.lines.map((l, i) => (
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
                  <span>{cart.price} €/mes</span>
                </div>
              </div>

              <button 
                className="btn-green w-full mb-3" 
                onClick={() => router.push('/payment')}
              >
                CONFIRMAR PEDIDO
              </button>
              
              <button 
                className="text-gray-500 underline w-full text-sm hover:text-red-500 transition-colors" 
                onClick={() => { 
                  clearCart(); 
                  router.push('/tarifas-moviles'); 
                }}
              >
                Vaciar carrito
              </button>
            </div>
          </div>

          {/* Sección de preguntas frecuentes */}
          <div className="bg-pink-100 rounded-custom p-6 md:p-8 mb-8 md:mb-12 text-center">
            <h2 className="text-xl md:text-2xl font-bold yoigo-pink-text mb-2">¿Tienes dudas?</h2>
            <p className="text-gray-700">Consulta nuestras preguntas frecuentes o contacta con nuestro equipo de atención al cliente.</p>
          </div>

          {/* Features Section */}
          <FeaturesSection 
            title="¿POR QUÉ ELEGIR YOIGO?" 
            features={cartFeatures} 
          />
        </div>
      </main>
      <Footer />
    </>
  );
} 