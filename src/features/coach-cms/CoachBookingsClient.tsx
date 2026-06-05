'use client';

/**
 * /coach/bookings — Inbox booking coach NHẬN từ học viên (H5).
 * Tab: Chờ xác nhận (badge) / Sắp tới / Đã hoàn thành.
 * Confirm = optimistic (no dialog). Decline = dialog + lý do + cảnh báo uy tín.
 */
import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import { EmptyState, SkeletonList } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatDateTime, formatVND } from '@lib/date';
import { bookingService } from '@services/booking.service';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import { cn } from '@lib/cn';
import type { Booking } from '@app-types/booking';

const COACH_ID = 'c1'; // persona Khoa = coach c1

type Tab = 'pending' | 'upcoming' | 'done';
const TABS: { key: Tab; label: string }[] = [
  { key: 'pending', label: 'Chờ xác nhận' },
  { key: 'upcoming', label: 'Sắp tới' },
  { key: 'done', label: 'Đã hoàn thành' },
];

const DECLINE_REASONS = [
  'Trùng lịch, không sắp xếp được',
  'Khung giờ này đã kín',
  'Học viên chưa phù hợp trình độ',
  'Lý do cá nhân',
];

export default function CoachBookingsClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const toast = useToast();

  const [all, setAll] = useState<Booking[] | null>(null);
  const [tab, setTab] = useState<Tab>('pending');
  const [declineFor, setDeclineFor] = useState<Booking | null>(null);
  const [reason, setReason] = useState(DECLINE_REASONS[0]);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.coachBookings }); return; }
    if (role !== 'coach' && role !== 'admin') { router.replace('/'); return; }
    bookingService.list({ coachId: COACH_ID }).then(setAll).catch(() => setAll([]));
  }, [isReady, isLoggedIn, role, requireLogin, router]);

  const now = Date.now();
  const groups = useMemo(() => {
    const list = all ?? [];
    return {
      pending: list.filter((b) => b.status === 'pending'),
      upcoming: list.filter((b) => b.status === 'confirmed' && new Date(b.startsAt).getTime() >= now),
      done: list.filter((b) => b.status === 'completed' || (b.status === 'confirmed' && new Date(b.startsAt).getTime() < now)),
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [all]);

  async function setStatus(b: Booking, status: 'confirmed' | 'cancelled', successMsg: string) {
    setBusy(b.id);
    // optimistic
    setAll((prev) => (prev ? prev.map((x) => (x.id === b.id ? { ...x, status } : x)) : prev));
    try {
      await bookingService.setStatus(b.id, status);
      toast.success(successMsg);
    } catch {
      toast.error('Có lỗi, vui lòng thử lại.');
      bookingService.list({ coachId: COACH_ID }).then(setAll).catch(() => {});
    } finally {
      setBusy(null);
    }
  }

  function confirm(b: Booking) {
    setStatus(b, 'confirmed', `Đã xác nhận buổi tập với ${b.userName ?? 'học viên'}.`);
  }
  function doDecline() {
    if (!declineFor) return;
    const b = declineFor;
    setDeclineFor(null);
    setStatus(b, 'cancelled', `Đã từ chối buổi tập với ${b.userName ?? 'học viên'}. Học viên được hoàn 100%.`);
  }

  const visible = groups[tab];

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        <header className="cms-page-head">
          <div>
            <h1 className="cms-page-head__title">Booking của bạn</h1>
            <p className="cms-page-head__sub">Xác nhận hoặc từ chối yêu cầu đặt buổi từ học viên.</p>
          </div>
        </header>

        <nav className="cms-tabs" aria-label="Trạng thái booking">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              className={cn('cms-tabs__tab', tab === t.key && 'is-active')}
              onClick={() => setTab(t.key)}
            >
              {t.label}
              {t.key === 'pending' && groups.pending.length > 0 && (
                <span className="cms-tabs__badge">{groups.pending.length}</span>
              )}
            </button>
          ))}
        </nav>

        {all === null ? (
          <SkeletonList rows={3} />
        ) : visible.length === 0 ? (
          <EmptyState
            title={tab === 'pending' ? 'Không có yêu cầu chờ xác nhận' : tab === 'upcoming' ? 'Chưa có buổi sắp tới' : 'Chưa có buổi hoàn thành'}
            description={tab === 'pending' ? 'Khi học viên đặt lịch, yêu cầu sẽ hiện ở đây để bạn duyệt.' : 'Các buổi đã xác nhận / hoàn thành sẽ hiển thị tại đây.'}
          />
        ) : (
          <div className="cms-booking-list">
            {visible.map((b) => (
              <article key={b.id} className="cms-booking">
                <div className="cms-booking__avatar" aria-hidden>
                  {(b.userName ?? 'H').charAt(0).toUpperCase()}
                </div>
                <div className="cms-booking__body">
                  <div className="cms-booking__top">
                    <strong className="cms-booking__name">{b.userName ?? 'Học viên'}</strong>
                    {b.note?.includes('Đặt lịch riêng') && <span className="cms-booking__tag">Đặt lịch riêng</span>}
                  </div>
                  <div className="cms-booking__meta">
                    <span><AppIcon name="clock" size={14} /> {formatDateTime(b.startsAt)} · {b.durationMinutes} phút</span>
                    <span><AppIcon name="wallet" size={14} /> {formatVND(b.price.amount)}</span>
                  </div>
                  {b.note && <p className="cms-booking__note">{b.note}</p>}
                </div>

                <div className="cms-booking__actions">
                  {b.status === 'pending' ? (
                    <>
                      <button type="button" className="cms-booking__confirm" disabled={busy === b.id} onClick={() => confirm(b)}>
                        <AppIcon name="check" size={16} color="#fff" /> Xác nhận
                      </button>
                      <button type="button" className="cms-booking__decline" disabled={busy === b.id} onClick={() => { setDeclineFor(b); setReason(DECLINE_REASONS[0]); }}>
                        Từ chối
                      </button>
                    </>
                  ) : (
                    <span className={cn('cms-booking__status', b.status === 'completed' && 'is-done')}>
                      {b.status === 'completed' ? 'Đã hoàn thành' : 'Đã xác nhận'}
                    </span>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Decline dialog */}
      {declineFor && (
        <div className="cms-dialog" role="dialog" aria-modal="true">
          <div className="cms-dialog__backdrop" onClick={() => setDeclineFor(null)} />
          <div className="cms-dialog__box">
            <h3>Từ chối buổi tập?</h3>
            <p className="cms-dialog__warn">
              <AppIcon name="warning" size={16} /> Bạn sẽ bị giảm 1 điểm uy tín. Học viên được hoàn 100%.
            </p>
            <label className="cms-dialog__label">Lý do từ chối</label>
            <select className="cms-dialog__select" value={reason} onChange={(e) => setReason(e.target.value)}>
              {DECLINE_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
            </select>
            <div className="cms-dialog__actions">
              <button type="button" className="cms-dialog__cancel" onClick={() => setDeclineFor(null)}>Huỷ</button>
              <button type="button" className="cms-dialog__danger" onClick={doDecline}>Từ chối</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
