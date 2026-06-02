import { cn } from '@lib/cn';
import type { BookingStatus } from '@app-types/booking';

/**
 * Pill timeline: Paid → Pending → Confirmed → Completed
 * Cancelled / no_show hiển thị riêng (gạch đỏ).
 */
const STEPS = [
  { id: 'paid',      label: 'Đã thanh toán' },
  { id: 'pending',   label: 'Chờ coach xác nhận' },
  { id: 'confirmed', label: 'Đã xác nhận' },
  { id: 'completed', label: 'Hoàn thành' },
] as const;

function indexFor(status: BookingStatus): number {
  switch (status) {
    case 'pending':   return 1;
    case 'confirmed': return 2;
    case 'completed': return 3;
    default:          return 0;
  }
}

export default function BookingTimeline({ status }: { status: BookingStatus }) {
  if (status === 'cancelled' || status === 'no_show') {
    return (
      <div className="booking-timeline booking-timeline--cancelled">
        <div className="booking-timeline__step booking-timeline__step--done">Đã thanh toán</div>
        <div className="booking-timeline__step booking-timeline__step--cancelled">
          {status === 'cancelled' ? '✕ Đã huỷ' : '⚠ Vắng mặt'}
        </div>
      </div>
    );
  }

  const currentIdx = indexFor(status);

  return (
    <div className="booking-timeline">
      {STEPS.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div
            key={step.id}
            className={cn(
              'booking-timeline__step',
              isDone && 'booking-timeline__step--done',
              isActive && 'booking-timeline__step--active',
            )}
          >
            <span className="booking-timeline__step-num">
              {isDone ? '✓' : i + 1}
            </span>
            <span className="booking-timeline__step-label">{step.label}</span>
          </div>
        );
      })}
    </div>
  );
}
