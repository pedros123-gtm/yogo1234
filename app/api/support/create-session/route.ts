// app/api/support/create-session/route.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { pushMessage } from '../../../lib/supportStore'; // <-- проверь путь, должен указывать на app/lib/supportStore.ts

function genSessionId() {
  return `s-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

type Body = {
  sessionId?: string | null;
  userName?: string | null;
  initialMessage?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    const body: Body = (await req.json()) ?? {};
    let { sessionId, userName, initialMessage } = body;

    let created = false;
    if (!sessionId) {
      sessionId = genSessionId();
      created = true;
    }

    // Push initial lead message so support sees session immediately
    const msgText =
      initialMessage ??
      `Session ${sessionId} started${userName ? ` (user: ${userName})` : ''}`;

    try {
      pushMessage(sessionId, {
        id: `lead-${Date.now()}`,
        from: 'lead',
        text: msgText,
        time: new Date().toISOString()
      });
      console.log('pushMessage ok for', sessionId);
    } catch (err) {
      console.warn('pushMessage failed (non-fatal)', err);
    }

    // Try to notify internal payment-status endpoint (idempotent)
    // Use request origin so this works in dev and prod without APP_URL env
    try {
      const origin = new URL(req.url).origin;
      await fetch(`${origin}/api/payment-status-vercel`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, status: 'processing' })
      });
      console.log('Notified payment-status for', sessionId);
    } catch (err) {
      console.warn('Failed to notify payment-status (non-fatal)', err);
    }

    return NextResponse.json({ ok: true, sessionId, created });
  } catch (err) {
    console.error('create-session error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
