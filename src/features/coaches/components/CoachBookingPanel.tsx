import Image from 'next/image';
import { Button } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatMoney } from '@lib/format';
import type { Coach } from '@app-types/coach';

type Props = { coach: Coach };

/**
 * Tạm thời — pick slot mặc định = ngày mai 18:00 (default 60 phút).
 * Khi slot-picker UI built (week 5 calendar), thay bằng selected slot.
 */
function buildDefaultBookingHref(coachId: string): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  d.setHours(18, 0, 0, 0);
  const params = new URLSearchParams({
    coachId,
    startsAt: d.toISOString(),
    durationMinutes: '60',
  });
  return `${ROUTES.bookingNew}?${params.toString()}`;
}

export default function CoachBookingPanel({ coach }: Props) {
  return (
    <aside className="coach-booking-panel" aria-label="Đặt lịch huấn luyện viên">
      <div className="coach-booking-panel__header">
        <div className="coach-booking-panel__avatar">
          <Image src={coach.avatar} alt={coach.fullName} width={44} height={44} style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <div className="coach-booking-panel__name">{coach.fullName}</div>
          <div className="coach-booking-panel__role">{coach.title}</div>
        </div>
      </div>

      <div className="coach-booking-panel__stats">
        <div>
          <div className="coach-booking-panel__stat-num">{coach.courseCount ?? 0}</div>
          <div className="coach-booking-panel__stat-label">Khoá học</div>
        </div>
        <div>
          <div className="coach-booking-panel__stat-num">{coach.classCount ?? 0}</div>
          <div className="coach-booking-panel__stat-label">Lớp học</div>
        </div>
        <div>
          <div className="coach-booking-panel__stat-num">{coach.studentCount ?? 0}</div>
          <div className="coach-booking-panel__stat-label">Học viên</div>
        </div>
      </div>

      <div className="coach-booking-panel__info-row">
        <span>Khu vực</span>
        <strong>{coach.location.city}</strong>
      </div>

      <div className="coach-booking-panel__info-row">
        <span>Đánh giá</span>
        <span className="coach-booking-panel__rating">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
          </svg>
          <strong>{coach.rating.toFixed(1)}</strong>
        </span>
      </div>

      <div className="coach-booking-panel__price-block">
        <small>Học phí từ</small>
        <div>
          <strong>{formatMoney(coach.pricePerHour)}</strong>
          <span>/giờ</span>
        </div>
      </div>

      <Button
        href={buildDefaultBookingHref(coach.id)}
        variant="primary"
        size="lg"
        block
        className="coach-booking-panel__cta"
      >
        Đặt lịch
      </Button>

      {coach.nextAvailableSlot && (
        <div className="coach-booking-panel__next">
          <span>Lịch trống tiếp theo</span>
          <strong>{coach.nextAvailableSlot}</strong>
        </div>
      )}
    </aside>
  );
}
