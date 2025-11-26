// app/api/support/history/route.ts
import { NextResponse } from 'next/server';
import { listMessages } from '../../../lib/supportStore'; // путь может отличаться

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = String(url.searchParams.get('sessionId') || '');
    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'missing sessionId' }, { status: 400 });
    }

    const msgs = listMessages(sessionId);
    // lastEventTs — возвращаем в ms (number)
    const lastEventTs = msgs.length ? Math.max(...msgs.map((m) => new Date(m.time).getTime())) : Date.now();
    return NextResponse.json({ ok: true, messages: msgs, lastEventTs });
  } catch (err) {
    console.error('support/history error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
