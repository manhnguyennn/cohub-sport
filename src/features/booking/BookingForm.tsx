'use client';

/**
 * Booking form theo PRD Booking §A2.
 * - Location radio (3 options) + address conditional
 * - Note, health note, participants
 * - Promo code apply realtime
 * - Right panel: order summary realtime
 * - Submit → save draft → /checkout
 *
 * RequireLogin: nếu chưa login → đẩy /auth/login?next=<currentUrl>
 */
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatNextSlot } from '@lib/date';
import { formatMoney } from '@lib/format';
import { saveBookingDraft } from '@lib/booking-draft';
import { promoService } from '@services/promo.service';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import type { Coach } from '@app-types/coach';
import type { BookingLocation } from '@app-types/booking';

type BookingFormProps = {
  coach: Coach;
  startsAt: string;
  durationMinutes: number;
};

type LocationKind = BookingLocation['kind'];

const LOCATION_OPTIONS: { kind: LocationKind; label: string; hint: string }[] = [
  { kind: 'coach_place',   label: 'Địa điểm coach',  hint: 'Sân/phòng tập của coach' },
  { kind: 'learner_place', label: 'Địa điểm của tôi', hint: 'Nhập địa chỉ chi tiết' },
  { kind: 'third_party',   label: 'Sân/phòng khác',    hint: 'Cả 2 cùng đến địa điểm thứ 3' },
];

export default function BookingForm({ coach, startsAt, durationMinutes }: BookingFormProps) {
  const router = useRouter();
  const { isLoggedIn, isReady, requireLogin } = useAuth();
  const toast = useToast();

  // Guard login — chờ hydrate xong
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({
        redirectTo: `${ROUTES.bookingNew}?coachId=${coach.id}&startsAt=${encodeURIComponent(startsAt)}&durationMinutes=${durationMinutes}`,
      });
    }
  }, [isReady, isLoggedIn, requireLogin, coach.id, startsAt, durationMinutes]);

  // Form state
  const [locationKind, setLocationKind] = useState<LocationKind>('coach_place');
  const [address, setAddress] = useState('');
  const [note, setNote] = useState('');
  const [healthNote, setHealthNote] = useState('');
  const [participants, setParticipants] = useState(1);

  // Promo
  const [promoInput, setPromoInput] = useState('');
  const [promoApplied, setPromoApplied] = useState<{ code: string; discount: number } | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);
  const [promoLoading, setPromoLoading] = useState(false);

  // Order summary
  const subtotal = coach.pricePerHour.amount;
  const discount = promoApplied?.discount ?? 0;
  const total = Math.max(0, subtotal - discount);

  const slotLabel = useMemo(() => {
    const endMs = new Date(startsAt).getTime() + durationMinutes * 60_000;
    return formatNextSlot(startsAt, new Date(endMs).toISOString());
  }, [startsAt, durationMinutes]);

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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    // Validate
    if ((locationKind === 'learner_place' || locationKind === 'third_party') && !address.trim()) {
      toast.error('Vui lòng nhập địa chỉ chi tiết.');
      return;
    }

    saveBookingDraft({
      coachId: coach.id,
      sportSlug: coach.sports[0] ?? 'gym-fitness',
      startsAt,
      durationMinutes,
      location: { kind: locationKind, address: address.trim() || undefined },
      note: note.trim() || undefined,
      healthNote: healthNote.trim() || undefined,
      participants,
      promoCode: promoApplied?.code,
      subtotal,
      discount,
      total,
    });

    router.push(ROUTES.checkout);
  }

  // Tránh flash khi chưa hydrate persona
  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="booking-form-page">
      <div className="booking-form-page__container">
        {/* Breadcrumb */}
        <nav className="booking-form-page__breadcrumb" aria-label="Breadcrumb">
          <Link href={ROUTES.coachDetail(coach.slug)}>← Quay lại profile coach</Link>
        </nav>

        <div className="booking-form-page__grid">
          {/* Form */}
          <form className="booking-form" onSubmit={handleSubmit}>
            <header className="booking-form__header">
              <h1>Đặt buổi tập 1-1</h1>
              <p>Hoàn tất thông tin để xác nhận buổi tập với coach.</p>
            </header>

            {/* Slot summary readonly */}
            <section className="booking-form__section">
              <h2>Buổi tập đã chọn</h2>
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
                </div>
              </div>
            </section>

            {/* Location */}
            <section className="booking-form__section">
              <h2>Địa điểm tập</h2>
              <div className="booking-form__radios">
                {LOCATION_OPTIONS.map((opt) => (
                  <label
                    key={opt.kind}
                    className={`booking-form__radio ${locationKind === opt.kind ? 'is-active' : ''}`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={opt.kind}
                      checked={locationKind === opt.kind}
                      onChange={() => setLocationKind(opt.kind)}
                    />
                    <div>
                      <strong>{opt.label}</strong>
                      <span>{opt.hint}</span>
                    </div>
                  </label>
                ))}
              </div>
              {(locationKind === 'learner_place' || locationKind === 'third_party') && (
                <input
                  type="text"
                  className="booking-form__input"
                  placeholder="VD: 123 Nguyễn Trãi, Q1, TP.HCM"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  required
                />
              )}
            </section>

            {/* Note + health */}
            <section className="booking-form__section">
              <h2>Mục tiêu buổi tập (tuỳ chọn)</h2>
              <textarea
                className="booking-form__textarea"
                placeholder="VD: Mục tiêu giảm 3kg trong tháng, kỹ thuật forehand..."
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
                placeholder="VD: Có chấn thương đầu gối, hen suyễn nhẹ..."
                rows={2}
                value={healthNote}
                maxLength={300}
                onChange={(e) => setHealthNote(e.target.value)}
              />
            </section>

            {/* Participants */}
            <section className="booking-form__section">
              <h2>Số người tham gia</h2>
              <div className="booking-form__stepper">
                <button
                  type="button"
                  onClick={() => setParticipants((n) => Math.max(1, n - 1))}
                  disabled={participants <= 1}
                  aria-label="Giảm"
                >−</button>
                <strong>{participants}</strong>
                <button
                  type="button"
                  onClick={() => setParticipants((n) => Math.min(5, n + 1))}
                  disabled={participants >= 5}
                  aria-label="Tăng"
                >+</button>
              </div>
            </section>
          </form>

          {/* Order summary panel */}
          <aside className="booking-form__summary">
            <h3>Tóm tắt đơn</h3>

            <div className="booking-form__summary-row">
              <span>{coach.fullName} · 60 phút</span>
              <strong>{formatMoney(coach.pricePerHour)}</strong>
            </div>

            {/* Promo */}
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
              <span>{formatMoney({ amount: subtotal, currency: 'VND' })}</span>
            </div>
            {discount > 0 && (
              <div className="booking-form__summary-row booking-form__summary-row--discount">
                <span>Giảm giá</span>
                <span>− {formatMoney({ amount: discount, currency: 'VND' })}</span>
              </div>
            )}
            <div className="booking-form__summary-row booking-form__summary-row--total">
              <span>Tổng cộng</span>
              <strong>{formatMoney({ amount: total, currency: 'VND' })}</strong>
            </div>

            <Button variant="primary" size="lg" block onClick={handleSubmit}>
              Tiếp tục thanh toán
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
