'use client';

/**
 * /checkout — đọc booking draft từ sessionStorage,
 * cho user chọn method, fake gateway → tạo booking + charge → redirect /booking/[id].
 */
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatNextSlot } from '@lib/date';
import { formatMoney } from '@lib/format';
import { clearBookingDraft, readBookingDraft, type BookingDraft } from '@lib/booking-draft';
import { bookingService } from '@services/booking.service';
import { openSessionService } from '@services/openSession.service';
import { paymentService } from '@services/payment.service';
import { useAuth } from '@hooks/useAuth';
import { useDemoMode } from '@contexts/DemoModeContext';
import { useToast } from '@contexts/ToastContext';
import FakePaymentModal from './FakePaymentModal';
import { cn } from '@lib/cn';
import type { PaymentMethod } from '@app-types/payment';

const METHODS: { id: PaymentMethod; label: string; description: string; emoji: string }[] = [
  { id: 'vnpay',   label: 'VNPay',   description: 'Thẻ ATM nội địa + Visa/Master',        emoji: '🏦' },
  { id: 'momo',    label: 'MoMo',    description: 'Ví điện tử MoMo — quét QR',              emoji: '🌸' },
  { id: 'zalopay', label: 'ZaloPay', description: 'Ví điện tử ZaloPay — thanh toán nhanh',  emoji: '⚡' },
];

export default function CheckoutClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, user, requireLogin } = useAuth();
  const { toggles } = useDemoMode();
  const toast = useToast();

  const [draft, setDraft] = useState<BookingDraft | null>(null);
  const [method, setMethod] = useState<PaymentMethod>('vnpay');
  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Hydrate draft
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.checkout });
      return;
    }
    const d = readBookingDraft();
    if (!d) {
      toast.error('Không tìm thấy thông tin đặt buổi. Vui lòng chọn lại.');
      router.replace(ROUTES.coaches);
      return;
    }
    setDraft(d);
  }, [isReady, isLoggedIn, requireLogin, router, toast]);

  if (!draft) return null;

  const handlePayClick = () => {
    setModalOpen(true);
  };

  const handlePaymentComplete = async (success: boolean) => {
    setModalOpen(false);
    if (!success) {
      toast.error('Thanh toán thất bại. Vui lòng thử lại hoặc chọn phương thức khác.');
      return;
    }

    setSubmitting(true);
    try {
      // 1. Tạo booking (status=pending)
      const booking = await bookingService.create({
        coachId: draft.coachId,
        sportSlug: draft.sportSlug,
        startsAt: draft.startsAt,
        durationMinutes: draft.durationMinutes,
        location: draft.location,
        note: draft.note,
        healthNote: draft.healthNote,
        participants: draft.participants,
        promoCode: draft.promoCode,
        userId: user?.id,
      });

      // 1b. Nếu booking đến từ "Lịch dạy mở" → tăng bookedCount của session
      if (draft.openSessionId) {
        await openSessionService.book(draft.openSessionId).catch(() => {
          // Booking đã tạo thành công, không rollback ở mock — log warning tới console.
          // eslint-disable-next-line no-console
          console.warn('[checkout] Không thể đồng bộ bookedCount cho session', draft.openSessionId);
        });
      }

      // 2. Charge payment (mock)
      await paymentService.charge({
        method,
        amount: { amount: draft.total, currency: 'VND' },
        reference: { kind: 'booking', id: booking.id },
        forceFail: toggles.forcePaymentFail,
      });

      clearBookingDraft();
      router.push(`${ROUTES.bookingDetail(booking.id)}?status=success`);
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      toast.error(msg);
      setSubmitting(false);
    }
  };

  const slotLabel = formatNextSlot(
    draft.startsAt,
    new Date(new Date(draft.startsAt).getTime() + draft.durationMinutes * 60_000).toISOString(),
  );

  return (
    <>
      <div className="booking-form-page">
        <div className="booking-form-page__container">
          <nav className="booking-form-page__breadcrumb" aria-label="Breadcrumb">
            <button type="button" onClick={() => router.back()} style={{ background: 'none', border: 0, padding: 0, cursor: 'pointer', font: 'inherit' }}>
              ← Quay lại
            </button>
          </nav>

          <div className="booking-form-page__grid">
            <div className="booking-form">
              <header className="booking-form__header">
                <h1>Thanh toán</h1>
                <p>Chọn phương thức thanh toán an toàn qua cổng thanh toán Việt Nam.</p>
              </header>

              <section className="booking-form__section">
                <h2>Phương thức thanh toán</h2>
                <div className="booking-form__radios">
                  {METHODS.map((m) => (
                    <label key={m.id} className={cn('booking-form__radio', method === m.id && 'is-active')}>
                      <input
                        type="radio"
                        name="method"
                        value={m.id}
                        checked={method === m.id}
                        onChange={() => setMethod(m.id)}
                      />
                      <div>
                        <strong>{m.emoji} {m.label}</strong>
                        <span>{m.description}</span>
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              {toggles.forcePaymentFail && (
                <div style={{
                  padding: 12, background: 'var(--danger-light)', color: 'var(--danger)',
                  borderRadius: 8, fontSize: 13,
                }}>
                  ⚠ Demo Mode: <strong>Force payment fail</strong> đang bật — thanh toán sẽ thất bại.
                </div>
              )}
            </div>

            <aside className="booking-form__summary">
              <h3>Đơn của bạn</h3>
              <div className="booking-form__summary-row">
                <span>{draft.coachId} · {slotLabel}</span>
              </div>
              <div className="booking-form__summary-row">
                <span>Số người tham gia</span>
                <span>{draft.participants}</span>
              </div>

              <hr />

              <div className="booking-form__summary-row">
                <span>Tạm tính</span>
                <span>{formatMoney({ amount: draft.subtotal, currency: 'VND' })}</span>
              </div>
              {draft.discount > 0 && (
                <div className="booking-form__summary-row booking-form__summary-row--discount">
                  <span>Giảm ({draft.promoCode})</span>
                  <span>− {formatMoney({ amount: draft.discount, currency: 'VND' })}</span>
                </div>
              )}
              <div className="booking-form__summary-row booking-form__summary-row--total">
                <span>Tổng cộng</span>
                <strong>{formatMoney({ amount: draft.total, currency: 'VND' })}</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                block
                onClick={handlePayClick}
                disabled={submitting}
              >
                {submitting ? 'Đang xử lý đơn…' : `Thanh toán ${formatMoney({ amount: draft.total, currency: 'VND' })}`}
              </Button>

              <p className="booking-form__policy">
                Tiền được CoHub giữ escrow đến khi buổi tập hoàn thành.
              </p>
            </aside>
          </div>
        </div>
      </div>

      <FakePaymentModal
        open={modalOpen}
        method={method}
        amount={draft.total}
        onComplete={handlePaymentComplete}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
