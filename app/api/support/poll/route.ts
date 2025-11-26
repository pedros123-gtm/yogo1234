// app/api/support/poll/route.ts
import { NextResponse } from 'next/server';
import { listMessagesSince } from '../../../lib/supportStore';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const sessionId = String(url.searchParams.get('sessionId') || '');
    const sinceParam = url.searchParams.get('since');

    if (!sessionId) {
      return NextResponse.json({ ok: false, error: 'missing sessionId' }, { status: 400 });
    }

    // parse since correctly and convert to milliseconds if it looks like seconds
    let since: number | undefined = undefined;
    if (sinceParam !== null) {
      const n = Number(sinceParam);
      if (!Number.isNaN(n)) {
        // If value looks like seconds (much smaller than current ms timestamp), convert to ms
        // Threshold: 1e12 is ~Sat Sep 09 2001 in ms, so current ms timestamps are >1e12.
        since = n < 1e12 ? n * 1000 : n;
      }
    }

    // listMessagesSince expects since in ms; if since === undefined -> returns all
    const msgs = listMessagesSince(sessionId, since);

    // compute lastEventTs in ms (safe fallback to Date.now())
    const times = msgs.map(m => {
      const t = new Date(m.time).getTime();
      return Number.isNaN(t) ? Date.now() : t;
    });
    const lastEventTs = times.length ? Math.max(...times) : (since ?? Date.now());

    return NextResponse.json({ ok: true, messages: msgs, lastEventTs });
  } catch (err) {
    console.error('support/poll error', err);
    return NextResponse.json({ ok: false, error: String(err) }, { status: 500 });
  }
}
