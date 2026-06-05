'use client';

/**
 * /my/bookings — tabs Sắp tới / Đã hoàn thành / Đã huỷ.
 * Data per-persona qua bookingService.list({ userId, scope }).
 */
import { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { EmptyState, Button, SkeletonList } from '@components/ui';
import AppIcon, { type AppIconName } from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatDateTime, formatVND } from '@lib/date';
import { bookingService } from '@services/booking.service';
import { useAuth } from '@hooks/useAuth';
import { cn } from '@lib/cn';
import CancelBookingModal from './CancelBookingModal';
import ReviewModal from './ReviewModal';
import type { Booking, BookingStatus } from '@app-types/booking';

type Tab = 'upcoming' | 'past' | 'cancelled';

const TABS: { id: Tab; label: string }[] = [
  { id: 'upcoming',  label: 'Sắp tới' },
  { id: 'past',      label: 'Đã hoàn thành' },
  { id: 'cancelled', label: 'Đã huỷ' },
];

export default function MyBookingsClient() {
  const { isReady, isLoggedIn, user, requireLogin } = useAuth();
  const [tab, setTab] = useState<Tab>('upcoming');
  const [items, setItems] = useState<Booking[] | null>(null);
  const [cancelTarget, setCancelTarget] = useState<Booking | null>(null);
  const [reviewTarget, setReviewTarget] = useState<Booking | null>(null);
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const fetchList = useCallback(async (currentTab: Tab) => {
    if (!user) return;
    setItems(null);
    const list = await bookingService.list({ userId: user.id, scope: currentTab });
    setItems(list);
  }, [user]);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.myBookings });
      return;
    }
    fetchList(tab);
  }, [isReady, isLoggedIn, tab, fetchList, requireLogin]);

  function handleCancelled(_status: BookingStatus) {
    setCancelTarget(null);
    fetchList(tab);
  }

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-page__container">
        <header className="my-bookings-page__head">
          <h1>Buổi tập của tôi</h1>
          <p>Quản lý lịch tập 1-1 với HLV của bạn.</p>
        </header>

        <div className="my-bookings-tabs" role="tablist">
          {TABS.map((t) => (
            <button
              key={t.id}
              role="tab"
              aria-selected={tab === t.id}
              className={cn('my-bookings-tabs__btn', tab === t.id && 'my-bookings-tabs__btn--active')}
              onClick={() => setTab(t.id)}
              type="button"
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="my-bookings-list">
          {items === null ? (
            <SkeletonList rows={3} />
          ) : items.length === 0 ? (
            <EmptyState
              title={
                tab === 'upcoming'  ? 'Chưa có buổi tập sắp tới' :
                tab === 'past'      ? 'Chưa có buổi tập hoàn thành' :
                                      'Bạn chưa huỷ booking nào'
              }
              description="Tìm HLV phù hợp và đặt buổi đầu tiên của bạn."
              action={tab === 'upcoming' ? (
                <Button href={ROUTES.coaches} variant="primary">Tìm HLV</Button>
              ) : undefined}
            />
          ) : (
            items.map((b) => (
              <BookingRow
                key={b.id}
                booking={b}
                reviewed={reviewedIds.has(b.id)}
                onCancel={() => setCancelTarget(b)}
                onReview={() => setReviewTarget(b)}
              />
            ))
          )}
        </div>
      </div>

      {cancelTarget && (
        <CancelBookingModal
          open
          booking={cancelTarget}
          onClose={() => setCancelTarget(null)}
          onCancelled={handleCancelled}
        />
      )}

      {reviewTarget && (
        <ReviewModal
          booking={reviewTarget}
          onClose={() => setReviewTarget(null)}
          onSubmitted={(id) => {
            setReviewedIds((prev) => new Set(prev).add(id));
            setReviewTarget(null);
          }}
        />
      )}
    </div>
  );
}

function BookingRow({ booking, reviewed, onCancel, onReview }: { booking: Booking; reviewed: boolean; onCancel: () => void; onReview: () => void }) {
  const canCancel = booking.status === 'pending' || booking.status === 'confirmed';
  const canReview = booking.status === 'completed';
  const statusBadge: { icon: AppIconName; label: string; tone: string } =
    booking.status === 'pending'   ? { icon: 'clock', label: 'Chờ xác nhận', tone: 'warn' } :
    booking.status === 'confirmed' ? { icon: 'check', label: 'Đã xác nhận',  tone: 'info' } :
    booking.status === 'completed' ? { icon: 'check', label: 'Hoàn thành',   tone: 'success' } :
    booking.status === 'cancelled' ? { icon: 'close', label: 'Đã huỷ',       tone: 'danger' } :
                                     { icon: 'warning', label: 'Vắng mặt',    tone: 'danger' };

  return (
    <article className="my-booking-row">
      <div className="my-booking-row__avatar">
        {booking.coachAvatar && (
          <Image src={booking.coachAvatar} alt={booking.coachName} width={56} height={56} />
        )}
      </div>

      <div className="my-booking-row__body">
        <div className="my-booking-row__head">
          <Link href={ROUTES.bookingDetail(booking.id)} className="my-booking-row__title">
            {booking.coachName}
          </Link>
          <span className={`my-booking-row__badge my-booking-row__badge--${statusBadge.tone}`}>
            <AppIcon name={statusBadge.icon} size={13} /> {statusBadge.label}
          </span>
        </div>

        <div className="my-booking-row__meta">
          <AppIcon name="clock" size={14} /> {formatDateTime(booking.startsAt)} · {booking.durationMinutes} phút
        </div>
        {booking.note && (
          <div className="my-booking-row__note"><AppIcon name="note" size={14} /> {booking.note}</div>
        )}
      </div>

      <div className="my-booking-row__side">
        <strong>{formatVND(booking.price.amount)}</strong>
        <div className="my-booking-row__actions">
          <Button href={ROUTES.bookingDetail(booking.id)} variant="secondary" size="sm">
            Chi tiết
          </Button>
          {canCancel && (
            <Button variant="ghost" size="sm" onClick={onCancel}>
              Huỷ
            </Button>
          )}
          {canReview && (
            reviewed ? (
              <span className="my-booking-row__reviewed"><AppIcon name="check" size={14} /> Đã đánh giá</span>
            ) : (
              <Button variant="primary" size="sm" onClick={onReview}>
                <AppIcon name="star" size={14} color="#fff" /> Đánh giá
              </Button>
            )
          )}
        </div>
      </div>
    </article>
  );
}
