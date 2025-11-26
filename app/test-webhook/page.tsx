'use client';

import React, { useState } from 'react';

export default function TestWebhookPage() {
  const [sessionId] = useState('1751056382196');
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testWebhook = async (action: string) => {
    try {
      addLog(`Тестируем webhook с действием: ${action}`);
      
      const webhookBody = {
        callback_query: {
          id: 'test-callback-' + Date.now(),
          data: `${action}_${sessionId}`,
          message: {
            chat: { id: 123456 },
            message_id: 1
          }
        }
      };

      const response = await fetch('/api/telegram-webhook', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(webhookBody)
      });

      const data = await response.json();
      addLog(`Webhook ответ: ${JSON.stringify(data)}`);
      
      setTimeout(async () => {
        try {
          const statusResponse = await fetch(`/api/payment-status?sessionId=${sessionId}&t=${Date.now()}`);
          const statusData = await statusResponse.json();
          addLog(`Статус после webhook: ${JSON.stringify(statusData)}`);
        } catch (error) {
          addLog(`Ошибка проверки статуса: ${error}`);
        }
      }, 500);

    } catch (error) {
      addLog(`Ошибка webhook: ${error}`);
    }
  };

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Test Telegram Webhook</h1>
      
      <div className="bg-gray-100 p-4 rounded mb-4">
        <p><strong>Session ID:</strong> {sessionId}</p>
      </div>

      <div className="space-y-4 mb-6">
        <button 
          onClick={() => testWebhook('reject')}
          className="bg-red-500 text-white px-4 py-2 rounded mr-2"
        >
          Тест: Отклонить
        </button>
        
        <button 
          onClick={() => testWebhook('otp')}
          className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
        >
          Тест: OTP
        </button>
      </div>

      <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
        <h3 className="text-white mb-2">Логи:</h3>
        {logs.map((log, index) => (
          <div key={index}>{log}</div>
        ))}
      </div>
    </div>
  );
} 