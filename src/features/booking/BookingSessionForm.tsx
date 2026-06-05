'use client';

/**
 * BookingSessionForm — đặt 1 buổi từ "Lịch dạy mở" có sẵn.
 *
 * Khác với BookingForm cũ (custom slot):
 *  - Thời gian + địa điểm + giá đã được coach SET sẵn (read-only)
 *  - Học viên CHỈ cần điền: ghi chú mục tiêu, sức khoẻ, áp promo (tuỳ chọn)
 *  - Submit → saveBookingDraft → /checkout
 *
 * UX writing key: "Bạn đang đặt 1 buổi đã được coach mở" — nhấn mạnh
 * học viên đang chọn từ pool có sẵn, không tự đề xuất giờ.
 */
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatNextSlot, formatVND } from '@lib/date';
import { formatMoney } from '@lib/format';
import { saveBookingDraft } from '@lib/booking-draft';
import { promoService } from '@services/promo.service';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import type { Coach } from '@app-types/coach';
import type { OpenSession } from '@app-types/openSession';

type Props = {
  coach: Coach;
  session: OpenSession;
};

const LOCATION_LABEL = {
  coach_place:   'Tại sân/phòng của coach',
  learner_place: 'Coach đến chỗ học viên',
  third_party:   'Tại sân/phòng thứ 3',
} as const;

export default function BookingSessionForm({ coach, session }: Props) {
  const router = useRouter();
  const { isLoggedIn, isReady, requireLogin } = useAuth();
  const toast = useToast();

  // Guard login
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.bookingSession(session.id) });
    }
  }, [isReady, isLoggedIn, requireLogin, session.id]);

  const [note, setNote] = useState('');
  const [healthNote, setHealthNote] = useState('');

  // Promo
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotal = session.price.amount;
  const discount = promoApplied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const slotLabel = useMemo(() => {
    const endMs = new Date(session.startsAt).getTime() + session.durationMinutes * 60_000;
    return formatNextSlot(session.startsAt, new Date(endMs).toISOString());
  }, [session.startsAt, session.durationMinutes]);

  const remaining = session.capacity - session.bookedCount;
  const isFull = session.status === 'full' || remaining <= 0;
  const isCancelled = session.status === 'cancelled' || session.status === 'completed';

  async function handleApplyPromo() {
    if (!promoInput.trim()) return;
    setPromoLoading(true);
    setPromoError(null);
    try {
      const res = await promoService.validate(promoInput, subtotal);
      if (res.valid && res.discount) {
        setPromoApplied({ code: res.code, discount: res.discount.amount });
        toast.success(res.message);
      } else {
        setPromoApplied(null);
        setPromoError(res.message);
      }
    } finally {
      setPromoLoading(false);
    }
  }

  function handleClearPromo() {
    setPromoApplied(null);
    setPromoInput('');
    setPromoError(null);
  }

  function handleSubmit(e?: React.FormEvent) {
    e?.preventDefault();
    if (isFull || isCancelled) return;

    saveBookingDraft({
      coachId: coach.id,
      openSessionId: session.id,
      sportSlug: session.sportSlug,
      startsAt: session.startsAt,
      durationMinutes: session.durationMinutes,
      location: session.location,
      note: note.trim() || undefined,
      healthNote: healthNote.trim() || undefined,
      participants: 1,
      promoCode: promoApplied?.code,
      subtotal,
      discount,
      total,
    });

    router.push(ROUTES.checkout);
  }

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="booking-form-page">
      <div className="booking-form-page__container">
        <nav className="booking-form-page__breadcrumb" aria-label="Breadcrumb">
          <Link href={ROUTES.coachDetail(coach.slug)}>← Quay lại profile coach</Link>
        </nav>

        <div className="booking-form-page__grid">
          <form className="booking-form" onSubmit={handleSubmit}>
            <header className="booking-form__header">
              <h1>Xác nhận đặt buổi</h1>
              <p>Bạn đang đặt 1 buổi từ <em>lịch dạy mở</em> mà coach đã sắp xếp sẵn.</p>
            </header>

            {/* Session readonly summary */}
            <section className="booking-form__section">
              <h2>{session.title ?? 'Buổi tập với coach'}</h2>
              <div className="booking-form__slot">
                <Image
                  src={coach.avatar}
                  alt={coach.fullName}
                  width={48}
                  height={48}
                  className="booking-form__slot-avatar"
                />
                <div>
                  <strong>{coach.fullName}</strong>
                  <span>{coach.title} · {coach.location.city}</span>
                  <span className="booking-form__slot-time"><AppIcon name="clock" size={14} /> {slotLabel}</span>
                  <span className="booking-form__slot-time">
                    <AppIcon name="location" size={14} /> {LOCATION_LABEL[session.location.kind]}
                    {session.location.address && ` — ${session.location.address}`}
                  </span>
                  <span className="booking-form__slot-time">
                    <AppIcon name="people" size={14} /> {session.capacity === 1
                      ? 'Buổi 1-1 (cá nhân)'
                      : `Lớp nhóm — còn ${remaining}/${session.capacity} chỗ`}
                  </span>
                </div>
              </div>

              {session.note && (
                <div className="booking-form__coach-note">
                  <AppIcon name="note" size={14} /> <strong>Coach lưu ý:</strong> {session.note}
                </div>
              )}

              {(isFull || isCancelled) && (
                <div className="booking-form__warn">
                  <AppIcon name="warning" size={14} />{' '}
                  {isFull
                    ? 'Buổi này đã đầy. Hãy chọn buổi khác.'
                    : 'Buổi này đã bị huỷ hoặc đã kết thúc.'}
                </div>
              )}
            </section>

            {/* Note */}
            <section className="booking-form__section">
              <h2>Mục tiêu buổi tập (tuỳ chọn)</h2>
              <textarea
                className="booking-form__textarea"
                placeholder="VD: Tôi muốn cải thiện cú forehand, mới chơi 3 tháng..."
                rows={3}
                value={note}
                maxLength={500}
                onChange={(e) => setNote(e.target.value)}
              />
            </section>

            <section className="booking-form__section">
              <h2>Tình trạng sức khoẻ (tuỳ chọn)</h2>
              <textarea
                className="booking-form__textarea"
                placeholder="VD: Có chấn thương đầu gối nhẹ, hen suyễn..."
                rows={2}
                value={healthNote}
                maxLength={300}
                onChange={(e) => setHealthNote(e.target.value)}
              />
            </section>
          </form>

          {/* Summary panel */}
          <aside className="booking-form__summary">
            <h3>Tóm tắt đơn</h3>

            <div className="booking-form__summary-row">
              <span>{coach.fullName} · {session.durationMinutes} phút</span>
              <strong>{formatVND(subtotal)}</strong>
            </div>

            <div className="booking-form__promo">
              {promoApplied ? (
                <div className="booking-form__promo-applied">
                  <div>
                    <strong>Mã: {promoApplied.code}</strong>
                    <span>− {formatMoney({ amount: promoApplied.discount, currency: 'VND' })}</span>
                  </div>
                  <button type="button" onClick={handleClearPromo} aria-label="Bỏ mã">×</button>
                </div>
              ) : (
                <>
                  <div className="booking-form__promo-input">
                    <input
                      type="text"
                      placeholder="Mã giảm giá (thử: DEMO50)"
                      value={promoInput}
                      onChange={(e) => { setPromoInput(e.target.value); setPromoError(null); }}
                    />
                    <button
                      type="button"
                      onClick={handleApplyPromo}
                      disabled={!promoInput.trim() || promoLoading}
                    >
                      {promoLoading ? '...' : 'Áp dụng'}
                    </button>
                  </div>
                  {promoError && <span className="booking-form__promo-error">{promoError}</span>}
                </>
              )}
            </div>

            <hr />

            <div className="booking-form__summary-row">
              <span>Tạm tính</span>
              <span>{formatVND(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="booking-form__summary-row booking-form__summary-row--discount">
                <span>Giảm giá</span>
                <span>− {formatVND(discount)}</span>
              </div>
            )}
            <div className="booking-form__summary-row booking-form__summary-row--total">
              <span>Tổng cộng</span>
              <strong>{formatVND(total)}</strong>
            </div>

            <Button
              variant="primary"
              size="lg"
              block
              onClick={() => handleSubmit()}
              disabled={isFull || isCancelled}
            >
              {isFull ? 'Đã đầy' : isCancelled ? 'Buổi không khả dụng' : 'Tiếp tục thanh toán'}
            </Button>

            <p className="booking-form__policy">
              Huỷ ≥24h: hoàn 100% · 6-24h: hoàn 50% · &lt;6h: không hoàn.
            </p>
          </aside>
        </div>
      </div>
    </div>
  );
}
