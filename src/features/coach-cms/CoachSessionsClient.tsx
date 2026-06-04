'use client';

/**
 * /coach/sessions — Lịch dạy mở của coach.
 *
 * UX writing distinction:
 *   - "Khoá học" (Course)  → gói nhiều buổi, 1 giá, học viên đăng ký 1 lần
 *   - "Lịch dạy mở" (OpenSession) → từng buổi cụ thể, giá riêng,
 *     học viên chọn theo lịch & book trực tiếp
 *
 * Layout:
 *   - Banner + CTA "+ Mở lịch dạy mới"
 *   - Tab Sắp tới / Đã xong / Tất cả
 *   - List card mỗi session: title, time, capacity progress, price, status badge
 */
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Button, EmptyState, SkeletonList } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatVND, formatNextSlot } from '@lib/date';
import { openSessionService } from '@services/openSession.service';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { cn } from '@lib/cn';
import type { OpenSession } from '@app-types/openSession';

type Tab = 'upcoming' | 'past' | 'all';

const TAB_LABELS: Record<Tab, string> = {
  upcoming: 'Sắp tới',
  past: 'Đã xong',
  all: 'Tất cả',
};

export default function CoachSessionsClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const toast = useToast();

  const [tab, setTab] = useState<Tab>('upcoming');
  const [items, setItems] = useState<OpenSession[] | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.coachSessions }); return; }
    if (role !== 'coach' && role !== 'admin') { router.replace('/'); return; }
    // Mock map: persona Khoa = coach 'c1'
    openSessionService
      .list({ coachId: 'c1', scope: 'all' })
      .then(setItems)
      .catch(() => setItems([]));
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  const filtered = useMemo(() => {
    if (!items) return [];
    const now = Date.now();
    if (tab === 'upcoming') {
      return items.filter(
        (s) =>
          new Date(s.startsAt).getTime() >= now &&
          (s.status === 'open' || s.status === 'full'),
      );
    }
    if (tab === 'past') {
      return items.filter(
        (s) =>
          s.status === 'completed' || new Date(s.startsAt).getTime() < now,
      );
    }
    return items;
  }, [items, tab]);

  async function handleCancel(s: OpenSession) {
    if (!confirm(`Huỷ "${s.title ?? 'lịch dạy'}" lúc ${formatNextSlot(s.startsAt)}?`)) return;
    try {
      const updated = await openSessionService.cancel(s.id);
      setItems((prev) => prev?.map((x) => (x.id === s.id ? updated : x)) ?? null);
      toast.success('Đã huỷ lịch dạy. Học viên đã đặt sẽ được hoàn tiền theo chính sách.');
    } catch (e) {
      toast.error(e instanceof Error ? e.message : 'Có lỗi xảy ra');
    }
  }

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        <header className="cms-banner">
          <div>
            <strong>Lịch dạy mở</strong>
            <p>
              Mỗi <em>lịch dạy mở</em> là một buổi tập cụ thể (ngày-giờ + giá riêng) bạn đăng trước.
              Học viên xem trên trang HLV và đặt trực tiếp — khác với <em>khoá học</em> (gói nhiều buổi).
            </p>
          </div>
          <Button href={ROUTES.coachSessionNew} variant="primary" size="md">
            + Mở lịch dạy mới
          </Button>
        </header>

        {/* Tabs */}
        <nav className="cms-tabs" role="tablist" aria-label="Lọc lịch dạy">
          {(Object.keys(TAB_LABELS) as Tab[]).map((t) => (
            <button
              key={t}
              type="button"
              role="tab"
              aria-selected={tab === t}
              className={cn('cms-tabs__tab', tab === t && 'is-active')}
              onClick={() => setTab(t)}
            >
              {TAB_LABELS[t]}
            </button>
          ))}
        </nav>

        {items === null ? (
          <SkeletonList rows={3} />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={tab === 'past' ? 'Chưa có lịch dạy nào đã xong' : 'Chưa có lịch dạy mở'}
            description={
              tab === 'past'
                ? 'Sau khi tổ chức xong các buổi, chúng sẽ xuất hiện ở đây.'
                : 'Mở lịch dạy đầu tiên để học viên có thể đặt trực tiếp.'
            }
            action={
              tab !== 'past' && (
                <Button href={ROUTES.coachSessionNew} variant="primary">
                  + Mở lịch dạy mới
                </Button>
              )
            }
          />
        ) : (
          <div className="cms-session-list">
            {filtered.map((s) => (
              <SessionRow key={s.id} session={s} onCancel={() => handleCancel(s)} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function SessionRow({ session, onCancel }: { session: OpenSession; onCancel: () => void }) {
  const pct = Math.round((session.bookedCount / session.capacity) * 100);
  const canCancel = session.status === 'open' || session.status === 'full';

  return (
    <article className={cn('cms-session-card', `cms-session-card--${session.status}`)}>
      <div className="cms-session-card__head">
        <div className="cms-session-card__title-block">
          <strong className="cms-session-card__title">
            {session.title ?? 'Lịch dạy mở'}
          </strong>
          <span className="cms-session-card__time">
            ⏱ {formatNextSlot(session.startsAt)} · {session.durationMinutes} phút
          </span>
        </div>
        <span className={cn('cms-badge', `cms-badge--${badgeKind(session)}`)}>
          {statusLabel(session)}
        </span>
      </div>

      <div className="cms-session-card__meta">
        <span>
          {session.capacity === 1 ? '1-1 (cá nhân)' : `Nhóm tối đa ${session.capacity} người`}
        </span>
        <span>·</span>
        <span>
          {session.location.kind === 'coach_place'
            ? 'Tại sân/phòng coach'
            : session.location.kind === 'learner_place'
              ? 'Đến chỗ học viên'
              : session.location.address ?? 'Sân/phòng thứ 3'}
        </span>
      </div>

      <div className="cms-session-card__foot">
        <div className="cms-session-card__capacity">
          <div className="cms-session-card__capacity-bar">
            <span style={{ width: `${pct}%` }} />
          </div>
          <small>
            <strong>{session.bookedCount}/{session.capacity}</strong> đã đặt
          </small>
        </div>

        <div className="cms-session-card__price">
          <strong>{formatVND(session.price.amount)}</strong>
          <small>/người</small>
        </div>
      </div>

      {canCancel && (
        <div className="cms-session-card__actions">
          <button type="button" className="cms-session-card__action-link" onClick={onCancel}>
            Huỷ lịch
          </button>
        </div>
      )}
    </article>
  );
}

function badgeKind(s: OpenSession): 'pending' | 'confirmed' | 'completed' | 'cancelled' {
  if (s.status === 'completed') return 'completed';
  if (s.status === 'cancelled') return 'cancelled';
  if (s.status === 'full') return 'confirmed';
  return 'pending';
}

function statusLabel(s: OpenSession): string {
  switch (s.status) {
    case 'open':      return s.bookedCount > 0 ? `${s.bookedCount} người đã đặt` : 'Đang mở';
    case 'full':      return 'Đã đầy';
    case 'cancelled': return 'Đã huỷ';
    case 'completed': return 'Đã xong';
  }
}
