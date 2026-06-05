'use client';

/**
 * /messages + /messages/[threadId] — Chat 2 chiều learner ↔ coach (Tuần 7).
 * - 2-pane: danh sách thread (trái) + khung chat (phải).
 * - Mobile: chọn thread → ẩn list, hiện khung chat + nút quay lại.
 * - Auto-reply bot 2s. Content filter PII (detectPii) chặn gửi SĐT / link / Zalo…
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { EmptyState, SkeletonList } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatRelative, formatTime } from '@lib/date';
import { detectPii } from '@lib/onboarding-draft';
import { messageService } from '@services/message.service';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/cn';
import type { ChatThread, ChatMessage } from '@app-types/message';

export default function MessagesClient({
  activeThreadId,
  basePath = ROUTES.messages,
}: {
  activeThreadId?: string;
  /** Prefix route — '/messages' (learner) hoặc '/coach/messages' (CRM coach) */
  basePath?: string;
}) {
  const router = useRouter();
  const { user, isReady, isLoggedIn, requireLogin } = useAuth();
  const threadHref = (id: string) => `${basePath}/${id}`;

  const [threads, setThreads] = useState<ChatThread[] | null>(null);
  const [messages, setMessages] = useState<ChatMessage[] | null>(null);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const [replying, setReplying] = useState(false);

  const scrollRef = useRef<HTMLDivElement | null>(null);
  const aliveRef = useRef(true);
  useEffect(() => { aliveRef.current = true; return () => { aliveRef.current = false; }; }, []);

  const userId = user?.id ?? '';
  const pii = useMemo(() => detectPii(draft), [draft]);

  // Auth guard
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) requireLogin({ redirectTo: activeThreadId ? threadHref(activeThreadId) : basePath });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isReady, isLoggedIn, requireLogin, activeThreadId, basePath]);

  // Load thread list
  useEffect(() => {
    if (!isReady || !isLoggedIn || !userId) return;
    messageService.listThreads(userId).then((t) => aliveRef.current && setThreads(t)).catch(() => setThreads([]));
  }, [isReady, isLoggedIn, userId]);

  // Load active thread messages
  useEffect(() => {
    if (!activeThreadId) { setMessages(null); return; }
    if (!isLoggedIn) return;
    setMessages(null);
    messageService.getThread(activeThreadId)
      .then((d) => { if (aliveRef.current) { setMessages(d.messages); markRead(activeThreadId); } })
      .catch(() => aliveRef.current && setMessages([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeThreadId, isLoggedIn]);

  // Auto-scroll khi có message mới
  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, replying]);

  function markRead(id: string) {
    setThreads((prev) => prev ? prev.map((t) => t.id === id ? { ...t, unread: false } : t) : prev);
  }

  const activeThread = threads?.find((t) => t.id === activeThreadId) ?? null;

  function bumpThread(id: string, body: string) {
    setThreads((prev) => {
      if (!prev) return prev;
      const next = prev.map((t) => t.id === id ? { ...t, lastMessage: body, lastAt: new Date().toISOString() } : t);
      return [...next].sort((a, b) => new Date(b.lastAt).getTime() - new Date(a.lastAt).getTime());
    });
  }

  async function handleSend(e: React.FormEvent) {
    e.preventDefault();
    const text = draft.trim();
    if (!text || !activeThreadId || sending) return;
    if (pii.hasIssue) return; // chặn gửi khi có PII

    setSending(true);
    setDraft('');
    // optimistic
    const optimistic: ChatMessage = {
      id: `tmp_${Date.now()}`, threadId: activeThreadId, senderId: userId, body: text, createdAt: new Date().toISOString(),
    };
    setMessages((prev) => [...(prev ?? []), optimistic]);
    bumpThread(activeThreadId, text);

    try {
      const saved = await messageService.send(activeThreadId, { senderId: userId, body: text });
      if (aliveRef.current) setMessages((prev) => prev ? prev.map((m) => m.id === optimistic.id ? saved : m) : prev);
    } catch {
      // giữ optimistic, bỏ qua
    } finally {
      if (aliveRef.current) setSending(false);
    }

    // Auto-reply sau 2s
    setReplying(true);
    setTimeout(async () => {
      try {
        const reply = await messageService.autoReply(activeThreadId);
        if (aliveRef.current) {
          setMessages((prev) => [...(prev ?? []), reply]);
          bumpThread(activeThreadId, reply.body);
        }
      } catch { /* ignore */ } finally {
        if (aliveRef.current) setReplying(false);
      }
    }, 2000);
  }

  return (
    <div className="msg-page">
      <div className="msg-page__container">
        <header className="msg-head">
          <h1 className="msg-head__title">Tin nhắn</h1>
          <p className="msg-head__sub">Trao đổi trực tiếp với huấn luyện viên. Vui lòng giữ giao dịch trong CoHub.</p>
        </header>

        <div className={cn('msg', activeThreadId && 'msg--thread-open')}>
          {/* Thread list */}
          <aside className="msg__list">
            {threads === null ? (
              <div className="msg__list-loading"><SkeletonList rows={4} /></div>
            ) : threads.length === 0 ? (
              <EmptyState title="Chưa có hội thoại" description="Khi bạn đặt buổi hoặc nhắn HLV, hội thoại sẽ hiện ở đây." />
            ) : (
              threads.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  className={cn('msg-thread', t.id === activeThreadId && 'is-active')}
                  onClick={() => router.push(threadHref(t.id))}
                >
                  <Image src={t.partner.avatar ?? '/images/Container.webp'} alt={t.partner.name} width={44} height={44} className="msg-thread__av" />
                  <div className="msg-thread__body">
                    <div className="msg-thread__top">
                      <strong className="msg-thread__name">
                        {t.partner.name}
                        {t.partner.verified && <AppIcon name="shield" size={13} color="var(--brand)" />}
                      </strong>
                      <span className="msg-thread__time">{formatRelative(t.lastAt)}</span>
                    </div>
                    <p className={cn('msg-thread__preview', t.unread && 'is-unread')}>{t.lastMessage}</p>
                  </div>
                  {t.unread && <span className="msg-thread__dot" aria-label="Chưa đọc" />}
                </button>
              ))
            )}
          </aside>

          {/* Chat pane */}
          <section className="msg__pane">
            {!activeThreadId ? (
              <div className="msg__placeholder">
                <AppIcon name="chat" size={40} color="var(--text-tertiary, var(--text-secondary))" />
                <p>Chọn một hội thoại để bắt đầu nhắn tin.</p>
              </div>
            ) : (
              <>
                <header className="msg-conv-head">
                  <button type="button" className="msg-conv-head__back" aria-label="Quay lại" onClick={() => router.push(basePath)}>
                    <AppIcon name="back" size={20} />
                  </button>
                  {activeThread && (
                    <>
                      <Image src={activeThread.partner.avatar ?? '/images/Container.webp'} alt={activeThread.partner.name} width={38} height={38} className="msg-conv-head__av" />
                      <div className="msg-conv-head__info">
                        <strong>
                          {activeThread.partner.name}
                          {activeThread.partner.verified && <AppIcon name="shield" size={13} color="var(--brand)" />}
                        </strong>
                        <small>{activeThread.partner.role === 'coach' ? 'Huấn luyện viên' : activeThread.partner.role === 'learner' ? 'Học viên' : 'CoHub'}</small>
                      </div>
                    </>
                  )}
                </header>

                <div className="msg-conv__scroll" ref={scrollRef}>
                  {messages === null ? (
                    <div className="msg-conv__loading"><SkeletonList rows={3} /></div>
                  ) : (
                    <>
                      {messages.map((m) => {
                        const mine = m.senderId === userId;
                        return (
                          <div key={m.id} className={cn('msg-bubble-row', mine ? 'is-me' : 'is-them')}>
                            <div className="msg-bubble">
                              <p>{m.body}</p>
                              <time>{formatTime(m.createdAt)}</time>
                            </div>
                          </div>
                        );
                      })}
                      {replying && (
                        <div className="msg-bubble-row is-them">
                          <div className="msg-bubble msg-bubble--typing"><span /><span /><span /></div>
                        </div>
                      )}
                    </>
                  )}
                </div>

                <form className="msg-compose" onSubmit={handleSend}>
                  {pii.hasIssue && (
                    <p className="msg-compose__warn">
                      <AppIcon name="warning" size={15} /> Không chia sẻ số điện thoại, link hay Zalo/Telegram. Giao dịch phải qua CoHub.
                    </p>
                  )}
                  <div className="msg-compose__row">
                    <input
                      className="msg-compose__input"
                      placeholder="Nhập tin nhắn…"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      aria-invalid={pii.hasIssue}
                    />
                    <button type="submit" className="msg-compose__send" disabled={!draft.trim() || pii.hasIssue || sending} aria-label="Gửi">
                      <AppIcon name="send" size={18} color="#fff" />
                    </button>
                  </div>
                </form>
              </>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}
