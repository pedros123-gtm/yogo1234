// app/SupportWidget/SupportWidget.tsx
'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';

type Status = 'sending' | 'sent' | 'error';
type ChatMsg = {
  id: string;
  from: 'agent' | 'lead';
  text: string;
  time: number;
  status?: Status;
};
type NormalizedMsg = { id: string; time: number; from: 'agent' | 'lead'; text: string };

export type SupportWidgetProps = {
  /** Если передать sessionId, виджет будет его использовать; иначе берёт из localStorage или создаёт новую через /api/support/create-session */
  sessionId?: string | null;
  userName?: string | null;
  pollIntervalMs?: number;
  welcomeMessage?: string | null;
  lang?: string;
};

export default function SupportWidget({
  sessionId: sessionIdProp = null,
  userName: userNameProp = null,
  pollIntervalMs = 1500,
  welcomeMessage = 'Hola, me llamo Sara y soy asesora. ¿Puedo ayudarte con tu compra?',
  lang = 'es'
}: SupportWidgetProps) {
  /* -------------------- internal hook useSupport -------------------- */
  function useSupport(options?: {
    sessionId?: string | null;
    userName?: string | null;
    pollIntervalMs?: number;
    welcomeMessage?: string | null;
    lang?: string;
  }) {
    const {
      sessionId: initialSessionId = null,
      userName: initialUserName = null,
      pollIntervalMs: pMs = 1500,
      welcomeMessage: welcome = null,
      lang: _lang = 'es'
    } = options ?? {};

    const [sessionId, setSessionId] = useState<string | null>(initialSessionId ?? null);
    const [userName, setUserName] = useState<string | null>(initialUserName ?? null);
    const [messages, setMessages] = useState<ChatMsg[]>([]);
    const [typing, setTyping] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [unread, setUnread] = useState<number>(0);
    const [open, setOpen] = useState<boolean>(false);

    const lastPullRef = useRef<number>(0);
    const knownIdsRef = useRef<Set<string>>(new Set());
    const pollRef = useRef<number | null>(null);

    // audio
    const audioCtxRef = useRef<AudioContext | null>(null);
    const audioUnlockedRef = useRef<boolean>(false);

    // helpers
    const toId = useCallback((id: unknown) => String(id ?? `unknown-${Math.random().toString(36).slice(2, 9)}`), []);
    const parseTime = useCallback((t: unknown) => {
      if (!t && t !== 0) return Date.now();
      const n = Number(t as any);
      if (!Number.isNaN(n)) return n < 1e12 ? n * 1000 : n;
      const parsed = Date.parse(String(t));
      return Number.isNaN(parsed) ? Date.now() : parsed;
    }, []);
    const isAgentFrom = useCallback((f: string | undefined | null) => {
      if (!f) return false;
      const low = String(f).toLowerCase();
      return ['agent', 'admin', 'operator', 'support', 'bot'].includes(low);
    }, []);
    const formatTime = useCallback((ms: number) => {
      try {
        return new Date(ms).toLocaleTimeString();
      } catch {
        return '';
      }
    }, []);

    const makeChatMsg = useCallback((n: NormalizedMsg, status: Status = 'sent'): ChatMsg => {
      return { id: n.id, from: n.from, text: n.text, time: n.time, status };
    }, []);

    // audio unlock on first interaction
    useEffect(() => {
      const unlock = async () => {
        try {
          if (!audioCtxRef.current) {
            audioCtxRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
          }
          await audioCtxRef.current.resume();
          audioUnlockedRef.current = true;
        } catch {}
      };
      const onFirst = () => {
        unlock().catch(() => {});
        document.removeEventListener('pointerdown', onFirst);
        document.removeEventListener('keydown', onFirst);
      };
      document.addEventListener('pointerdown', onFirst, { once: true });
      document.addEventListener('keydown', onFirst, { once: true });
      return () => {
        document.removeEventListener('pointerdown', onFirst);
        document.removeEventListener('keydown', onFirst);
      };
    }, []);

    const playMelody = useCallback(async (volume = 0.12) => {
      try {
        let ctx = audioCtxRef.current;
        if (!ctx) {
          ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
          audioCtxRef.current = ctx;
        }
        if (ctx.state === 'suspended') {
          try {
            await ctx.resume();
            audioUnlockedRef.current = true;
          } catch {}
        }
        const now = ctx.currentTime;
        const seq = [
          { freq: 880, dur: 0.12, delay: 0 },
          { freq: 1050, dur: 0.12, delay: 0.12 },
          { freq: 1320, dur: 0.16, delay: 0.24 }
        ];
        seq.forEach((note) => {
          const o = ctx!.createOscillator();
          const g = ctx!.createGain();
          o.type = 'triangle';
          o.frequency.value = note.freq;
          g.gain.value = 0.0001;
          o.connect(g);
          g.connect(ctx!.destination);
          const s = now + note.delay;
          g.gain.setValueAtTime(0.0001, s);
          g.gain.exponentialRampToValueAtTime(Math.max(0.0001, volume), s + 0.01);
          o.start(s);
          g.gain.exponentialRampToValueAtTime(0.0001, s + note.dur);
          o.stop(s + note.dur + 0.02);
        });
      } catch {}
    }, []);

    // welcome message once
    useEffect(() => {
      const id = 'welcome-sara-v1';
      if (!knownIdsRef.current.has(id)) {
        knownIdsRef.current.add(id);
        const welcomeMsg: ChatMsg = { id, from: 'agent', text: welcome ?? '', time: Date.now(), status: 'sent' };
        setMessages((cur) => [welcomeMsg, ...cur]);
        try {
          const isMuted = typeof window !== 'undefined' && localStorage.getItem('supportMute') === '1';
          if (!isMuted) playMelody(0.12).catch(() => {});
        } catch {}
        setOpen((prev) => {
          if (!prev) { setUnread(0); return true; }
          return prev;
        });
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // load history when sessionId set
    useEffect(() => {
      if (!sessionId) return;
      let cancelled = false;
      const loadHistory = async () => {
        try {
          const res = await fetch(`/api/support/history?sessionId=${encodeURIComponent(sessionId)}&t=${Date.now()}`);
          if (!res.ok) {
            lastPullRef.current = 0;
            return;
          }
          const data = await res.json().catch(() => null);
          if (!data || !Array.isArray(data.messages)) return;

          const normalized: NormalizedMsg[] = (data.messages as any[])
            .map((m: any) => {
              const id = toId(m.id ?? m.storedId ?? m.messageId ?? m.msgId);
              const time = parseTime(m.time ?? m.ts ?? m.timestamp ?? m.created_at ?? m.date);
              const from: 'agent' | 'lead' = isAgentFrom(m.from ?? m.sender ?? m.role ?? m.type) ? 'agent' : 'lead';
              const text = m.text ?? m.body ?? m.message ?? '';
              return { id, time, from, text };
            })
            .filter((msg) => {
              if (knownIdsRef.current.has(msg.id)) return false;
              knownIdsRef.current.add(msg.id);
              return true;
            })
            .sort((a, b) => a.time - b.time);

          if (cancelled) return;

          if (normalized.length > 0) {
            setMessages((cur) => {
              const byId = new Map<string, ChatMsg>();
              normalized.forEach((n) => byId.set(n.id, makeChatMsg(n, 'sent')));
              cur.forEach((c) => {
                const existing = byId.get(c.id);
                if (!existing) byId.set(c.id, c);
                else {
                  if (c.status === 'sending') byId.set(c.id, c);
                }
              });
              const arr = Array.from(byId.values());
              arr.sort((a, b) => a.time - b.time);
              return arr as ChatMsg[];
            });
            const times = normalized.map((m) => m.time);
            if (times.length) lastPullRef.current = Math.max(...times);
          }
        } catch (err) {
          console.debug('loadHistory error', err);
        }
      };
      loadHistory();
      return () => { cancelled = true; };
    }, [sessionId, toId, parseTime, isAgentFrom, makeChatMsg]);

    return {
      sessionId,
      setSessionId,
      userName,
      setUserName,
      messages,
      setMessages,
      typing,
      setTyping,
      sending,
      setSending,
      unread,
      setUnread,
      isOpen: open,
      setOpen,
      lastPullRef,
      knownIdsRef,
      pollRef,
      pMs,
      makeChatMsg,
      toId,
      parseTime,
      isAgentFrom,
      playMelody,
      formatTime
    };
  } // end useSupport

  /* ---------------- useSupport usage ---------------- */

  // initial session: prop -> localStorage
  const initialSession = (() => {
    if (sessionIdProp) return sessionIdProp;
    try {
      if (typeof window !== 'undefined') return localStorage.getItem('paymentSession');
    } catch {}
    return null;
  })();

  const initialUser = (() => {
    if (userNameProp) return userNameProp;
    try {
      if (typeof window !== 'undefined') return localStorage.getItem('userName') ?? 'Tú';
    } catch {}
    return 'Tú';
  })();

  const support = useSupport({
    sessionId: initialSession ?? null,
    userName: initialUser ?? 'Tú',
    pollIntervalMs,
    welcomeMessage,
    lang
  });

  const {
    sessionId,
    setSessionId,
    userName,
    messages,
    setMessages,
    typing,
    setTyping,
    sending,
    setSending,
    unread,
    setUnread,
    isOpen,
    setOpen,
    pollRef,
    lastPullRef,
    knownIdsRef,
    pMs,
    makeChatMsg,
    toId,
    parseTime,
    isAgentFrom,
    playMelody,
    formatTime
  } = support;

  // local UI
  const [input, setInput] = useState<string>('');
  const [imgError, setImgError] = useState<boolean>(false);
  const [muted, setMuted] = useState<boolean>(() => {
    try { return localStorage.getItem('supportMute') === '1'; } catch { return false; }
  });
  const [notifyBlink, setNotifyBlink] = useState<boolean>(false);

  // persist mute setting
  useEffect(() => {
    try { localStorage.setItem('supportMute', muted ? '1' : '0'); } catch {}
  }, [muted]);

  // ensure session creation (calls server endpoint to create a session if needed)
  const ensureSession = useCallback(async () => {
    if (sessionId) return;
    // try localStorage again just in case
    try {
      const fromStorage = localStorage.getItem('paymentSession');
      if (fromStorage) { setSessionId(fromStorage); return; }
    } catch {}

    // call server to create session
    try {
      const res = await fetch('/api/support/create-session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}) // server should create & return { sessionId }
      });
      const json = await res.json().catch(() => null);
      const sid = (json && (json.sessionId ?? json.session_id)) ?? null;
      const final = sid ?? `s-${Date.now()}`;
      setSessionId(final);
      try { localStorage.setItem('paymentSession', final); } catch {}
    } catch (err) {
      // fallback client-side id if server fails (keeps UX working)
      const fallback = `s-${Date.now()}`;
      setSessionId(fallback);
      try { localStorage.setItem('paymentSession', fallback); } catch {}
    }
  }, [sessionId, setSessionId]);

  // open/close handlers
  const openWidget = useCallback(() => { ensureSession(); setOpen(true); setUnread(0); }, [ensureSession, setOpen, setUnread]);
  const closeWidget = useCallback(() => setOpen(false), [setOpen]);
  const toggleWidget = useCallback(() => setOpen((v) => { const n = !v; if (n) setUnread(0); return n; }), [setOpen, setUnread]);

  // polling loop + notifications + auto-open on agent message
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;

    const poll = async () => {
      try {
        const res = await fetch(`/api/support/poll?sessionId=${encodeURIComponent(sessionId)}&since=${lastPullRef.current}&t=${Date.now()}`);
        if (!res.ok) return;
        const data = await res.json().catch(() => null);
        if (!data) return;

        if (Array.isArray(data.messages) && data.messages.length > 0) {
          const incoming: NormalizedMsg[] = (data.messages as any[])
            .map((m: any) => {
              const id = toId(m.id ?? m.storedId ?? m.messageId ?? m.msgId);
              const time = parseTime(m.time ?? m.ts ?? m.timestamp ?? m.created_at ?? m.date);
              const from: 'agent' | 'lead' = isAgentFrom(m.from ?? m.sender ?? m.role ?? m.type) ? 'agent' : 'lead';
              const text = m.text ?? m.body ?? m.message ?? '';
              return { id, time, from, text };
            })
            .filter((msg) => {
              if (knownIdsRef.current.has(msg.id)) return false;
              knownIdsRef.current.add(msg.id);
              return true;
            })
            .sort((a, b) => a.time - b.time);

          if (!cancelled && incoming.length > 0) {
            // merge with existing, keeping local sending messages
            setMessages((cur) => {
              const byId = new Map<string, ChatMsg>();
              incoming.forEach((n) => byId.set(n.id, makeChatMsg(n, 'sent')));
              cur.forEach((c) => {
                const existing = byId.get(c.id);
                if (!existing) byId.set(c.id, c);
                else {
                  if (c.status === 'sending') byId.set(c.id, c);
                }
              });
              const arr = Array.from(byId.values());
              arr.sort((a, b) => a.time - b.time);
              return arr as ChatMsg[];
            });

            // if agent messages arrived — notify
            const agentMsgs = incoming.filter((m) => m.from === 'agent');
            if (agentMsgs.length > 0) {
              // auto-open panel on agent message and reset unread
              setOpen(true);
              setUnread(0);

              // blink + sound
              setNotifyBlink(true);
              window.setTimeout(() => setNotifyBlink(false), 2500);
              try {
                const isMuted = typeof window !== 'undefined' && localStorage.getItem('supportMute') === '1';
                if (!isMuted) playMelody(0.12).catch(() => {});
              } catch {}
            }
          }
        }

        if (data.lastEventTs) {
          lastPullRef.current = parseTime((data as any).lastEventTs);
        } else if (Array.isArray(data.messages) && data.messages.length > 0) {
          const times = (data.messages as any[]).map((m: any) => parseTime(m.time ?? m.ts ?? m.timestamp ?? m.created_at ?? m.date));
          lastPullRef.current = Math.max(lastPullRef.current, ...times);
        }

        if (data.typing) {
          setTyping(true);
          setTimeout(() => setTyping(false), 1400);
        }
      } catch (err) {
        console.debug('support poll error', err);
      }
    };

    // initial poll + interval
    poll();
    if (!pollRef.current) pollRef.current = window.setInterval(poll, pMs ?? pollIntervalMs);

    return () => {
      cancelled = true;
      if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null; }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sessionId, muted, playMelody, toId, parseTime, isAgentFrom, makeChatMsg]);

  // optimistic send
  const sendMessage = useCallback(async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    if (!sessionId) { alert('Session no encontrada. Recarga la página.'); return; }

    const tempId = toId(`local-${Date.now()}`);
    const tempMsg: ChatMsg = { id: tempId, from: 'lead', text: trimmed, time: Date.now(), status: 'sending' };
    knownIdsRef.current.add(tempId);
    setMessages((m) => [...m, tempMsg]);
    setSending(true);

    try {
      const res = await fetch('/api/support/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, text: trimmed, lang, tempId })
      });
      const json = await res.json().catch(() => null);

      if (res.ok && json && json.ok) {
        const newServerId: string | null = (json.storedId ?? json.messageId) ?? null;
        const newTime: unknown = json.time ?? null;
        const echoedTempId: string | null = json.tempId ?? null;

        setMessages((cur) => {
          if (echoedTempId) {
            return cur.map((m) =>
              m.id === echoedTempId
                ? ({ ...m, id: toId(newServerId ?? echoedTempId), time: parseTime(newTime ?? m.time), status: 'sent' as Status })
                : m
            );
          }

          let replaced = false;
          const mapped = cur.map((m) => {
            if (!replaced && m.id === tempId) {
              replaced = true;
              return { ...m, id: toId(newServerId ?? tempId), time: parseTime(newTime ?? m.time), status: 'sent' as Status };
            }
            return m;
          });
          if (replaced) return mapped;

          replaced = false;
          const fallback = cur.map((m) => {
            if (!replaced && m.status === 'sending' && m.text === trimmed) {
              replaced = true;
              return { ...m, id: toId(newServerId ?? m.id), time: parseTime(newTime ?? m.time), status: 'sent' as Status };
            }
            return m;
          });
          if (replaced) return fallback;

          return cur.map((m) => (m.id === tempId ? { ...m, status: 'sent' as Status } : m));
        });

        if (newServerId) {
          knownIdsRef.current.add(toId(newServerId));
          knownIdsRef.current.delete(tempId);
        }
        if (newTime) lastPullRef.current = Math.max(lastPullRef.current, parseTime(newTime));
      } else {
        setMessages((cur) => cur.map((m) => (m.id === tempId ? { ...m, text: `${m.text} (no enviado)`, status: 'error' as Status } : m)));
      }
    } catch (e) {
      console.error('send error', e);
      setMessages((cur) => cur.map((m) => (m.id === tempId ? { ...m, text: `${m.text} (error)`, status: 'error' as Status } : m)));
    } finally {
      setSending(false);
    }
  }, [sessionId, toId, parseTime, lang]);

  // UI handlers
  const handleOpen = () => { ensureSession(); openWidget(); };
  const handleToggle = () => toggleWidget();
  const handleClose = () => closeWidget();

  const handleSendClick = async () => {
    if (!input.trim()) return;
    await sendMessage(input.trim());
    setInput('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (input.trim()) handleSendClick();
    }
  };

  const toggleMute = () => setMuted((m) => !m);

  /* -------------------- UI & styles -------------------- */
  return (
    <>
      <style>{`
        @keyframes chat-open {
          0% { transform: translateY(8px) scale(0.98); opacity: 0; }
          60% { transform: translateY(-4px) scale(1.02); opacity: 1; }
          100% { transform: translateY(0) scale(1); opacity: 1; }
        }
        .chat-open-anim { animation: chat-open 280ms cubic-bezier(.2,.9,.3,1); }
      `}</style>

      <div className="fixed right-6 bottom-6 z-50 flex items-end">
        {!isOpen && (
          <button
            onClick={handleOpen}
            aria-label="Abrir soporte"
            className={`relative w-14 h-14 rounded-full bg-white border border-gray-200 shadow-md flex items-center justify-center hover:shadow-lg focus:outline-none ${notifyBlink ? 'ring-2 ring-blue-400 animate-pulse' : ''}`}
          >
            {!imgError ? (
              <img src="/images/avatar-sara-128.png" alt="Sara" className="w-10 h-10 rounded-full object-cover" onError={() => setImgError(true)} />
            ) : (
              <svg className="w-6 h-6 text-[#E52E8A]" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 1C8.134 1 5 4.134 5 8v3h2V8c0-2.761 2.239-5 5-5s5 2.239 5 5v3h2V8c0-3.866-3.134-7-7-7z" fill="currentColor" />
                <path d="M4 22v-2a4 4 0 014-4h8a4 4 0 014 4v2H4z" fill="currentColor" />
              </svg>
            )}

            {unread > 0 && <span className="absolute -top-1 -right-1 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unread > 99 ? '99+' : unread}</span>}
          </button>
        )}

        {isOpen && (
          <div className={`w-80 md:w-96 bg-white rounded-xl shadow-2xl ring-1 ring-black/5 overflow-hidden mr-4 chat-open-anim`}>
            <div className="px-4 py-3 flex items-center justify-between border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                {!imgError ? (
                  <img src="/images/avatar-sara-128.png" alt="Sara" className="w-10 h-10 rounded-full object-cover" onError={() => setImgError(true)} />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <svg className="w-5 h-5 text-[#E52E8A]" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path d="M3 18v-2a4 4 0 014-4h8a4 4 0 014 4v2" fill="currentColor" />
                      <path d="M12 2a5 5 0 00-5 5v4h10V7a5 5 0 00-5-5z" fill="currentColor" />
                    </svg>
                  </div>
                )} 

                <div className="text-sm">
                  <div className="flex items-center gap-2">
                    <div className="font-semibold text-gray-800">Sara</div>
                    <div className="text-xs text-gray-500">— Soporte</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="relative inline-flex">
                      <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-green-400 opacity-75" />
                      <span className="relative inline-flex h-2 w-2 rounded-full bg-green-500" />
                    </span>
                    <div className="text-xs text-green-600 font-medium">En línea</div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {unread > 0 && <div className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-red-600 rounded-full">{unread > 99 ? '99+' : unread}</div>}

                <button title={muted ? 'Sonido apagado' : 'Sonido включен'} onClick={toggleMute} className="text-gray-500 hover:text-gray-700 p-1 rounded" aria-pressed={muted}>
                  {muted ? (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M3 9v6h4l5 4V5L7 9H3z" /><path d="M19 6l-3 3 3 3V6z" /></svg>
                  ) : (
                    <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor" aria-hidden><path d="M3 9v6h4l5 4V5L7 9H3z" /><path d="M16.5 12a4.5 4.5 0 00-4.5-4.5v1.5a3 3 0 013 3 3 3 0 01-3 3v1.5a4.5 4.5 0 004.5-4.5z" /></svg>
                  )}
                </button>

                <button aria-label="Minимizar" onClick={handleToggle} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M4 10h16v4H4z" fill="currentColor" /></svg>
                </button>
                <button aria-label="Cerrar" onClick={handleClose} className="text-gray-400 hover:text-gray-600 p-1 rounded">
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" aria-hidden><path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                </button>
              </div>
            </div>

            <div className="p-3 max-h-64 overflow-y-auto bg-gray-50" style={{ scrollbarGutter: 'stable' }}>
              {messages.map((m) => {
                const isAgent = m.from === 'agent';
                return (
                  <div key={m.id} className={`mb-3 flex items-end ${isAgent ? 'justify-start' : 'justify-end'}`}>
                    {isAgent && (
                      <img src="/images/avatar-sara-48.png" alt="Sara" className="w-8 h-8 rounded-full mr-2 object-cover" onError={(e) => {
                        const el = e.currentTarget as HTMLImageElement;
                        if (el.src.indexOf('avatar-sara-48.png') !== -1) el.src = '/images/avatar-sara-128.png';
                      }} />
                    )}

                    <div className={`max-w-[75%] py-2 px-3 rounded-lg text-sm break-words bg-white border border-gray-200 text-gray-800`} style={{ boxShadow: isAgent ? undefined : '0 1px 0 rgba(0,0,0,0.02)' }}>
                      <div className={`text-[11px] text-gray-500 mb-1 ${isAgent ? '' : 'text-right'}`}>
                        {isAgent ? 'Sara — Soporte' : `${userName ?? 'Tú'} — Cliente`}
                      </div>

                      <div>{m.text}</div>

                      <div className="flex items-center justify-end gap-2">
                        <div className="text-xs opacity-60 mt-1">{formatTime(m.time)}</div>
                        {m.status === 'sending' && <div className="text-xs opacity-60 mt-1"> • Enviando…</div>}
                        {m.status === 'error' && <div className="text-xs text-red-500 mt-1"> • Error</div>}
                      </div>
                    </div>

                    {!isAgent && <div className="ml-2 w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 text-xs">{(userName ?? 'Tú').slice(0, 1).toUpperCase()}</div>}
                  </div>
                );
              })}
            </div>

            <div className="px-3 py-2 border-t border-gray-100 bg-white">
              <div className="flex gap-2 items-center">
                <textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={handleKeyDown} placeholder="Escribe tu mensaje..." className="flex-1 px-3 py-2 text-sm rounded-md border border-gray-200 focus:outline-none focus:ring-1 focus:ring-[#E52E8A] resize-none h-10" rows={1} />

                <button onClick={handleSendClick} disabled={sending || !input.trim()} aria-label={sending ? 'Enviando' : 'Enviar mensaje'} title={sending ? 'Enviando...' : 'Enviar mensaje (Enter)'} className="w-10 h-10 flex items-center justify-center rounded-md bg-[#E52E8A] text-white text-sm disabled:opacity-60 disabled:cursor-not-allowed">
                  {sending ? (
                    <svg className="w-4 h-4 text-blue-600 animate-spin" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden><circle cx="25" cy="25" r="20" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeDasharray="31.4 31.4" /></svg>
                  ) : (
                    <svg className="w-4 h-4 text-blue-600" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg" aria-hidden><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z" /></svg>
                  )}
                </button>
              </div>
              {sessionId && <div className="text-xs text-gray-400 mt-2">ID: {sessionId}</div>}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
