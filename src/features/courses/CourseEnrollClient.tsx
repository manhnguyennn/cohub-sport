'use client';

/**
 * /courses/[id]/enroll — Enrollment 1-page flow.
 *
 * Layout:
 *  - LEFT: Health/goal form + policy checkbox
 *  - RIGHT (sticky): Order summary + payment method + hold seat countdown
 *
 * Logic:
 *  1. requireLogin → đẩy /auth/login nếu chưa login
 *  2. Hold seat 15min — countdown visible (FSD §4.9)
 *  3. Submit → courseService.enroll → paymentService.charge → redirect /my/courses/[id]
 */
import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatVND, formatDate } from '@lib/date';
import { cn } from '@lib/cn';
import { courseService } from '@services/course.service';
import { paymentService } from '@services/payment.service';
import { useAuth } from '@hooks/useAuth';
import { useDemoMode } from '@contexts/DemoModeContext';
import { useToast } from '@contexts/ToastContext';
import FakePaymentModal from '../booking/FakePaymentModal';
import type { Course } from '@app-types/course';
import type { PaymentMethod } from '@app-types/payment';

const HOLD_SECONDS = 15 * 60; // 15 phút

const METHODS: { id: PaymentMethod; label: string; emoji: string }[] = [
  { id: 'vnpay',   label: 'VNPay',   emoji: '🏦' },
  { id: 'momo',    label: 'MoMo',    emoji: '🌸' },
  { id: 'zalopay', label: 'ZaloPay', emoji: '⚡' },
];

export default function CourseEnrollClient({ course }: { course: Course }) {
  const router = useRouter();
  const { isReady, isLoggedIn, user, requireLogin } = useAuth();
  const { toggles } = useDemoMode();
  const toast = useToast();

  // Auth guard
  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.courseEnroll(course.id) });
    }
  }, [isReady, isLoggedIn, requireLogin, course.id]);

  // Form state
  const [goal, setGoal] = useState('');
  const [healthNote, setHealthNote] = useState('');
  const [policy, setPolicy] = useState(false);
  const [method, setMethod] = useState<PaymentMethod>('vnpay');

  // Hold seat countdown
  const [remaining, setRemaining] = useState(HOLD_SECONDS);
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    if (expired) return;
    const t = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(t);
          setExpired(true);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [expired]);

  const [modalOpen, setModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const remainingLabel = useMemo(() => {
    const m = Math.floor(remaining / 60);
    const s = remaining % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  }, [remaining]);

  if (!isReady || !isLoggedIn) return null;

  function canSubmit() {
    return policy && !expired && !submitting;
  }

  function handleSubmit() {
    if (!policy) {
      toast.error('Vui lòng đồng ý điều khoản trước khi tiếp tục.');
      return;
    }
    if (expired) {
      toast.error('Chỗ giữ đã hết hạn — vui lòng quay lại trang khoá học.');
      return;
    }
    setModalOpen(true);
  }

  async function handlePaymentComplete(success: boolean) {
    setModalOpen(false);
    if (!success) {
      toast.error('Thanh toán thất bại. Vui lòng thử lại.');
      return;
    }

    setSubmitting(true);
    try {
      const enrollment = await courseService.enroll(course.id, {
        courseId: course.id,
        userId: user?.id,
        goal: goal.trim() || undefined,
        healthNote: healthNote.trim() || undefined,
        policyAccepted: true,
      });

      await paymentService.charge({
        method,
        amount: course.price,
        reference: { kind: 'enrollment', id: enrollment.id },
        forceFail: toggles.forcePaymentFail,
      });

      toast.success(`Đăng ký thành công — ${course.title}`);
      router.push(ROUTES.myCourseDetail(enrollment.id));
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Đã có lỗi xảy ra';
      toast.error(msg);
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="booking-form-page">
        <div className="booking-form-page__container">
          <nav className="booking-form-page__breadcrumb">
            <Link href={ROUTES.courseDetail(course.id)}>← Quay lại khoá học</Link>
          </nav>

          {/* Hold seat banner */}
          <div className={cn('enroll-hold', expired && 'enroll-hold--expired')}>
            <span>🪑 {expired ? 'Chỗ giữ đã hết hạn' : `Chỗ của bạn đang được giữ trong`}</span>
            <strong>{expired ? 'Vui lòng đăng ký lại' : remainingLabel}</strong>
          </div>

          <div className="booking-form-page__grid">
            <form className="booking-form" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
              <header className="booking-form__header">
                <h1>Đăng ký khoá học</h1>
                <p>Cho coach biết về bạn để chuẩn bị nội dung phù hợp.</p>
              </header>

              <section className="booking-form__section">
                <h2>Mục tiêu của bạn (tuỳ chọn)</h2>
                <textarea
                  className="booking-form__textarea"
                  placeholder="VD: Muốn giảm 5kg trong 6 tuần, cải thiện kỹ thuật forehand..."
                  rows={3}
                  value={goal}
                  maxLength={500}
                  onChange={(e) => setGoal(e.target.value)}
                />
              </section>

              <section className="booking-form__section">
                <h2>Tình trạng sức khoẻ (tuỳ chọn)</h2>
                <textarea
                  className="booking-form__textarea"
                  placeholder="VD: Có tiền sử đau đầu gối, hen suyễn nhẹ..."
                  rows={2}
                  value={healthNote}
                  maxLength={300}
                  onChange={(e) => setHealthNote(e.target.value)}
                />
              </section>

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
                      </div>
                    </label>
                  ))}
                </div>
              </section>

              <section className="booking-form__section">
                <label className="enroll-policy">
                  <input
                    type="checkbox"
                    checked={policy}
                    onChange={(e) => setPolicy(e.target.checked)}
                  />
                  <span>
                    Tôi đồng ý <Link href="/terms" target="_blank">Điều khoản dịch vụ</Link>{' '}
                    và hiểu rõ <strong>chính sách huỷ khoá học</strong>:
                    ≥7 ngày hoàn 100%, 48h-7 ngày hoàn 70%, &lt;48h hoàn 30%.
                  </span>
                </label>
              </section>
            </form>

            <aside className="booking-form__summary">
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', marginBottom: 12 }}>
                <div style={{ position: 'relative', width: 72, height: 72, flexShrink: 0, borderRadius: 8, overflow: 'hidden' }}>
                  <Image src={course.cover} alt="" fill sizes="72px" style={{ objectFit: 'cover' }} />
                </div>
                <div style={{ minWidth: 0 }}>
                  <strong style={{ display: 'block', fontSize: 14, color: 'var(--text-primary)', lineHeight: 1.35 }}>
                    {course.title}
                  </strong>
                  <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                    {course.totalSessions} buổi · {course.sessionDurationMin} phút
                  </span>
                  {course.scheduleType === 'FIXED' && course.startDate && (
                    <span style={{ display: 'block', fontSize: 12, color: 'var(--text-muted)' }}>
                      Khai giảng {formatDate(course.startDate)}
                    </span>
                  )}
                </div>
              </div>

              <hr />

              <div className="booking-form__summary-row">
                <span>Đơn giá</span>
                <span>{formatVND(course.pricePerSession.amount)} / buổi</span>
              </div>
              <div className="booking-form__summary-row">
                <span>Số buổi</span>
                <span>{course.totalSessions}</span>
              </div>
              <div className="booking-form__summary-row booking-form__summary-row--total">
                <span>Tổng cộng</span>
                <strong>{formatVND(course.price.amount)}</strong>
              </div>

              <Button
                variant="primary"
                size="lg"
                block
                onClick={handleSubmit}
                disabled={!canSubmit()}
              >
                {submitting ? 'Đang xử lý…' : `Thanh toán ${formatVND(course.price.amount)}`}
              </Button>

              {toggles.forcePaymentFail && (
                <p style={{ fontSize: 11, color: 'var(--danger)', textAlign: 'center', marginTop: 6 }}>
                  ⚠ Demo: Force payment fail đang bật
                </p>
              )}

              <p className="booking-form__policy">
                Thanh toán an toàn qua cổng VNPay/MoMo/ZaloPay.
              </p>
            </aside>
          </div>
        </div>
      </div>

      <FakePaymentModal
        open={modalOpen}
        method={method}
        amount={course.price.amount}
        onComplete={handlePaymentComplete}
        onCancel={() => setModalOpen(false)}
      />
    </>
  );
}
