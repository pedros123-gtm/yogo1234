// app/lib/supportStore.ts
export type Msg = { id: string; from: 'agent'|'lead'; text: string; time: string };

declare global {
  // keep store across HMR in dev
  // @ts-ignore
  var __SUPPORT_STORE__: Record<string, Msg[]>;
}
global.__SUPPORT_STORE__ = global.__SUPPORT_STORE__ || {};

/**
 * pushMessage - добавляет сообщение в хранилище и возвращает сохранённый объект.
 * msg.time может отсутствовать — тогда используется current ISO time.
 * Ограничивает длину истории, чтобы память не разрослась (maxMessages).
 */
export function pushMessage(
  sessionId: string,
  msg: { id: string; from: 'agent'|'lead'; text: string; time?: string },
  maxMessages = 1000
): Msg {
  if (!global.__SUPPORT_STORE__[sessionId]) global.__SUPPORT_STORE__[sessionId] = [];

  const entry: Msg = {
    id: String(msg.id),
    from: msg.from,
    text: String(msg.text ?? ''),
    time: msg.time ?? new Date().toISOString()
  };

  global.__SUPPORT_STORE__[sessionId].push(entry);

  // trim if too long
  const arr = global.__SUPPORT_STORE__[sessionId];
  if (arr.length > maxMessages) {
    // keep the most recent `maxMessages`
    global.__SUPPORT_STORE__[sessionId] = arr.slice(arr.length - maxMessages);
  }

  return entry;
}

/**
 * listMessages - возвращает копию истории (sorted asc by time)
 */
export function listMessages(sessionId: string): Msg[] {
  const arr = global.__SUPPORT_STORE__[sessionId] ?? [];
  // return copy sorted by time (oldest first)
  return arr.slice().sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());
}

/**
 * listMessagesSince - возвращает сообщения с time > since (since в ms).
 * Если since не передан (undefined) — возвращает всю историю.
 */
export function listMessagesSince(sessionId: string, since?: number): Msg[] {
  const all = listMessages(sessionId);
  if (typeof since !== 'number' || Number.isNaN(since)) return all;
  return all.filter(m => new Date(m.time).getTime() > since);
}

/**
 * getLastEventTs - возвращает timestamp в ms последнего сообщения (или текущее время).
 */
export function getLastEventTs(sessionId: string): number {
  const msgs = listMessages(sessionId);
  if (!msgs.length) return Date.now();
  return Math.max(...msgs.map(m => new Date(m.time).getTime()));
}
