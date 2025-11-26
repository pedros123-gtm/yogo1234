'use client';

import React, { useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter } from 'next/navigation';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';
import { useCart } from '../tarifas-moviles/CartContext';

export default function SuccessPage() {
  const router = useRouter();
  const { cart, clearCart } = useCart();

  useEffect(() => {
    // Очищаем сессию оплаты
    if (typeof window !== 'undefined') {
      localStorage.removeItem('paymentSession');
    }
    
    // Очищаем корзину после успешной оплаты
    setTimeout(() => {
      clearCart();
    }, 5000);
  }, [clearCart]);

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans min-h-screen">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-lg mx-auto">
            <div className="tariff-card p-8 text-center">
              <div className="text-6xl mb-6 text-green-500">
                <i className="fas fa-check-circle"></i>
              </div>
              
              <h1 className="text-3xl font-bold mb-4 text-gray-800">
                ¡Pago completado!
              </h1>
              
              <p className="text-gray-600 mb-6">
                Tu tarifa ha sido activada correctamente. En breves recibirás un email con todos los detalles.
              </p>

              {cart && (
                <div className="bg-green-50 rounded-lg p-6 mb-6">
                  <h2 className="text-xl font-bold mb-3 text-green-800">
                    Resumen de tu pedido
                  </h2>
                  <div className="text-left space-y-2">
                    <div className="flex justify-between">
                      <span className="font-medium">Tarifa:</span>
                      <span>{cart.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Precio:</span>
                      <span className="font-bold">{cart.price} €/mes</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Descripción:</span>
                      <span className="text-sm">{cart.description}</span>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <i className="fas fa-envelope text-blue-600"></i>
                  <span className="text-sm">Te enviaremos un email de confirmación</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <i className="fas fa-sim-card text-blue-600"></i>
                  <span className="text-sm">La SIM llegará en 24-48 horas</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                  <i className="fas fa-phone text-blue-600"></i>
                  <span className="text-sm">Te llamaremos para confirmar la portabilidad</span>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => router.push('/tarifas-moviles')}
                  className="btn-green w-full flex items-center justify-center gap-2"
                >
                  <i className="fas fa-home"></i>
                  VOLVER AL INICIO
                </button>
                <button
                  onClick={() => {
                    if (typeof window !== 'undefined') {
                      window.print();
                    }
                  }}
                  className="w-full py-3 px-6 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
                >
                  <i className="fas fa-print"></i>
                  IMPRIMIR CONFIRMACIÓN
                </button>
              </div>

              <div className="mt-6 text-sm text-gray-500">
                <p>Número de pedido: #{Date.now()}</p>
                <p>Fecha: {new Date().toLocaleDateString('es-ES')}</p>
              </div>
            </div>

            {/* Información adicional */}
            <div className="tariff-card p-6 mt-6">
              <h3 className="text-lg font-bold mb-4 text-center">¿Necesitas ayuda?</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <i className="fas fa-phone text-[#E52E8A]"></i>
                  <span>Teléfono: 900 622 220</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-envelope text-[#E52E8A]"></i>
                  <span>Email: ayuda@yoigo.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <i className="fas fa-clock text-[#E52E8A]"></i>
                  <span>Horario: L-V 8:00-22:00, S-D 9:00-21:00</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 