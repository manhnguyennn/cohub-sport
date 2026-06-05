'use client';

/**
 * /booking/[id] — Booking detail.
 * - Nếu mới checkout (?status=success) → hero "🎉 Đặt buổi thành công" + timeline live
 * - Sau 3s tự đổi PENDING → CONFIRMED + toast (trừ khi Demo Mode `coachAutoConfirmOff`)
 * - CTA: Nhắn coach, Huỷ booking
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatDateTime, formatVND } from '@lib/date';
import { bookingService } from '@services/booking.service';
import { useDemoMode } from '@contexts/DemoModeContext';
import { useToast } from '@contexts/ToastContext';
import BookingTimeline from './BookingTimeline';
import CancelBookingModal from './CancelBookingModal';
import type { Booking, BookingStatus } from '@app-types/booking';

type Props = {
  booking: Booking;
  isFresh: boolean;
};

const LOCATION_LABEL: Record<string, string> = {
  coach_place: 'Tại địa điểm của coach',
  learner_place: 'Tại địa điểm của bạn',
  third_party: 'Tại sân/phòng thứ 3',
};

export default function BookingDetailClient({ booking: initialBooking, isFresh }: Props) {
  const router = useRouter();
  const toast = useToast();
  const { toggles, withDelay } = useDemoMode();

  const [booking, setBooking] = useState<Booking>(initialBooking);
  const [cancelOpen, setCancelOpen] = useState(false);

  // Auto-confirm 3s sau khi mới đặt thành công
  useEffect(() => {
    if (!isFresh) return;
    if (booking.status !== 'pending') return;
    if (toggles.coachAutoConfirmOff) return;

    const delay = withDelay(3000);
    const t = setTimeout(async () => {
      try {
        const updated = await bookingService.setStatus(booking.id, 'confirmed');
        setBooking(updated);
        toast.success(`${booking.coachName} đã xác nhận buổi tập của bạn!`, {
          title: 'Đã xác nhận',
          duration: 6000,
        });
      } catch {
        // ignore
      }
    }, delay);

    return () => clearTimeout(t);
  }, [isFresh, booking.id, booking.status, booking.coachName, toggles.coachAutoConfirmOff, withDelay, toast]);

  function handleCancelled(newStatus: BookingStatus) {
    setBooking((b) => ({ ...b, status: newStatus }));
    setCancelOpen(false);
  }

  return (
    <div className="booking-detail-page">
      <div className="booking-detail-page__container">

        {/* Hero */}
        <header className={`booking-detail-hero booking-detail-hero--${booking.status}`}>
          <div className="booking-detail-hero__badge">
            {isFresh && booking.status === 'pending' && <><AppIcon name="check" size={16} /> Đặt buổi thành công</>}
            {booking.status === 'confirmed' && <><AppIcon name="check" size={16} /> Coach đã xác nhận</>}
            {booking.status === 'completed' && <><AppIcon name="check" size={16} /> Buổi tập hoàn thành</>}
            {booking.status === 'cancelled' && <><AppIcon name="close" size={16} /> Đã huỷ</>}
            {booking.status === 'no_show'   && <><AppIcon name="warning" size={16} /> Vắng mặt</>}
            {!isFresh && booking.status === 'pending' && <><AppIcon name="clock" size={16} /> Đang chờ coach xác nhận</>}
          </div>
          <h1>Buổi tập với {booking.coachName}</h1>
          <p>Mã đặt buổi: <strong>{booking.id}</strong></p>
        </header>

        <div className="booking-detail-page__grid">
          <main className="booking-detail-card">
            <section>
              <h2>Thông tin buổi tập</h2>
              <dl className="booking-detail-card__dl">
                <div>
                  <dt>Huấn luyện viên</dt>
                  <dd>
                    <Link href={ROUTES.coachDetail(booking.coachId)} className="booking-detail-card__coach">
                      {booking.coachAvatar && (
                        <Image src={booking.coachAvatar} alt={booking.coachName} width={36} height={36} />
                      )}
                      <span>{booking.coachName}</span>
                    </Link>
                  </dd>
                </div>
                <div>
                  <dt>Thời gian</dt>
                  <dd>{formatDateTime(booking.startsAt)} — {booking.durationMinutes} phút</dd>
                </div>
                <div>
                  <dt>Địa điểm</dt>
                  <dd>
                    {LOCATION_LABEL[booking.location.kind]}
                    {booking.location.address && <><br /><small>{booking.location.address}</small></>}
                  </dd>
                </div>
                <div>
                  <dt>Số người tham gia</dt>
                  <dd>{booking.participants}</dd>
                </div>
                {booking.note && (
                  <div>
                    <dt>Mục tiêu</dt>
                    <dd>{booking.note}</dd>
                  </div>
                )}
                {booking.healthNote && (
                  <div>
                    <dt>Sức khoẻ</dt>
                    <dd>{booking.healthNote}</dd>
                  </div>
                )}
              </dl>
            </section>

            <section>
              <h2>Trạng thái</h2>
              <BookingTimeline status={booking.status} />
            </section>

            <section>
              <h2>Thanh toán</h2>
              <dl className="booking-detail-card__dl">
                <div>
                  <dt>Tạm tính</dt>
                  <dd>{formatVND(booking.subtotal.amount)}</dd>
                </div>
                {booking.discount && (
                  <div>
                    <dt>Giảm ({booking.promoCode})</dt>
                    <dd style={{ color: 'var(--success)' }}>− {formatVND(booking.discount.amount)}</dd>
                  </div>
                )}
                <div>
                  <dt><strong>Tổng cộng</strong></dt>
                  <dd><strong style={{ fontSize: 18, color: 'var(--brand)' }}>{formatVND(booking.price.amount)}</strong></dd>
                </div>
                {booking.refundAmount && (
                  <div>
                    <dt>Đã hoàn</dt>
                    <dd style={{ color: 'var(--success)' }}>{formatVND(booking.refundAmount.amount)}</dd>
                  </div>
                )}
              </dl>
            </section>
          </main>

          <aside className="booking-detail-aside">
            <Button variant="primary" block onClick={() => toast.info('Demo: tính năng chat đang phát triển — sẽ có ở tuần 7.')}>
              <AppIcon name="message" size={16} /> Nhắn tin coach
            </Button>
            <Button variant="secondary" block onClick={() => router.push(ROUTES.myBookings)}>
              <AppIcon name="calendar" size={16} /> Buổi tập của tôi
            </Button>
            {(booking.status === 'pending' || booking.status === 'confirmed') && (
              <Button variant="ghost" block onClick={() => setCancelOpen(true)}>
                Huỷ booking
              </Button>
            )}
          </aside>
        </div>
      </div>

      <CancelBookingModal
        open={cancelOpen}
        booking={booking}
        onClose={() => setCancelOpen(false)}
        onCancelled={handleCancelled}
      />
    </div>
  );
}
