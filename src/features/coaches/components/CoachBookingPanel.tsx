import Image from 'next/image';
import AppIcon from '@components/ui/AppIcon';
import CoachBookingLauncher from './CoachBookingLauncher';
import { formatMoney } from '@lib/format';
import { formatDate, formatTime } from '@lib/date';
import type { Coach } from '@app-types/coach';
import type { OpenSession } from '@app-types/openSession';

type Props = {
  coach: Coach;
  /** Toàn bộ lịch dạy mở (cho calendar trong modal đặt lịch) */
  openSessions: OpenSession[];
  /** Buổi gần nhất — chỉ dùng làm badge nhận biết nhanh */
  nextSession?: OpenSession;
  /** Số khoá học coach đang mở (Flow 3) */
  courseCount?: number;
};

/**
 * Sidebar booking panel — tối giản để user quét nhanh info + đặt lịch.
 * Bỏ "Sẵn sàng nhận học viên" & chính sách huỷ (chuyển sang checkout).
 * Lịch gần nhất chỉ còn 1 badge; CTA chính "Đặt lịch" mở calendar 30 ngày.
 */
export default function CoachBookingPanel({
  coach,
  openSessions,
  nextSession,
  courseCount = coach.courseCount ?? 0,
}: Props) {
  return (
    <aside className="coach-booking-panel" aria-label="Đặt lịch huấn luyện viên">
      <div className="coach-booking-panel__header">
        <div className="coach-booking-panel__avatar">
          <Image src={coach.avatar} alt={coach.fullName} width={44} height={44} style={{ objectFit: 'cover' }} />
        </div>
        <div>
          <div className="coach-booking-panel__name">
            {coach.fullName}
            {coach.isVerified && (
              <AppIcon name="check" size={14} className="coach-booking-panel__verified" />
            )}
          </div>
          <div className="coach-booking-panel__role">{coach.title ?? 'Coach'}</div>
        </div>
      </div>

      <div className="coach-booking-panel__price-block">
        <small>Học phí từ</small>
        <div>
          <strong>{formatMoney(coach.pricePerHour)}</strong>
          <span>/giờ</span>
        </div>
      </div>

      {/* Metrics — quét nhanh */}
      <div className="coach-booking-panel__stats">
        <div>
          <div className="coach-booking-panel__stat-num">{coach.experienceYears}</div>
          <div className="coach-booking-panel__stat-label">năm KN</div>
        </div>
        <div>
          <div className="coach-booking-panel__stat-num">{coach.rating.toFixed(1)}</div>
          <div className="coach-booking-panel__stat-label">{coach.reviewCount} đánh giá</div>
        </div>
        <div>
          <div className="coach-booking-panel__stat-num">{openSessions.length}</div>
          <div className="coach-booking-panel__stat-label">lịch dạy mở</div>
        </div>
      </div>

      <div className="coach-booking-panel__info-row">
        <span><AppIcon name="location" size={14} /> Khu vực</span>
        <strong>{coach.location.city}</strong>
      </div>

      {/* Badge lịch gần nhất — nhận biết nhanh */}
      {nextSession && (
        <div className="coach-booking-panel__next-badge">
          <AppIcon name="clock" size={14} />
          Lịch gần nhất: <strong>{formatDate(nextSession.startsAt)} · {formatTime(nextSession.startsAt)}</strong>
        </div>
      )}

      {/* CTA chính — mở calendar đặt lịch */}
      <CoachBookingLauncher coach={coach} openSessions={openSessions} />

      {/* Cross-sell Flow 3 */}
      {courseCount > 0 && (
        <a href="#courses" className="coach-booking-panel__courses-link">
          Xem {courseCount} khoá học của coach →
        </a>
      )}
    </aside>
  );
}
