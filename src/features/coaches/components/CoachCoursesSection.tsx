import Image from 'next/image';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { formatVND, formatDate } from '@lib/date';
import { ROUTES } from '@config/routes';
import type { Course } from '@app-types/course';

type Props = { courses: Course[] };

const DAY_LABEL = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

/**
 * Khoá học của coach (Cross-sell Flow 3) — spec §3.2.5 (C6/C7/C8).
 * Dùng Course entity thật (không duplicate). CTA trỏ /courses/[id].
 * Hiển thị seats progress, lịch khai giảng, schedule type badge.
 */
export default function CoachCoursesSection({ courses }: Props) {
  if (!courses || courses.length === 0) {
    return (
      <section id="courses" className="coach-section coach-courses">
        <h2 className="coach-section__title">Khoá học</h2>
        <p className="coach-courses__empty">
          Coach chưa mở khoá học. Bạn có thể đặt buổi lẻ ở mục “Lịch dạy mở”.
        </p>
      </section>
    );
  }

  return (
    <section id="courses" className="coach-section coach-courses">
      <h2 className="coach-section__title">Khoá học</h2>

      <div className="coach-courses__grid">
        {courses.map((c) => {
          const isFull = c.availableSeats === 0 || c.status === 'full';
          const isStarted = c.status === 'started';
          const booked = Math.max(0, c.maxParticipants - c.availableSeats);
          const pct = c.maxParticipants > 0 ? Math.round((booked / c.maxParticipants) * 100) : 0;

          return (
            <article className="coach-course-card" key={c.id}>
              <div className="coach-course-card__media">
                <Image
                  src={c.cover}
                  alt={c.title}
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                  style={{ objectFit: 'cover' }}
                />
                <span className="coach-course-card__type">
                  <AppIcon name={c.scheduleType === 'FIXED' ? 'calendar' : 'flash'} size={13} />
                  {c.scheduleType === 'FIXED' ? 'Cố định' : 'Linh hoạt'}
                </span>
                {isFull && <span className="coach-course-card__state">Đã đầy</span>}
                {isStarted && <span className="coach-course-card__state">Đã bắt đầu</span>}
              </div>

              <div className="coach-course-card__body">
                <div className="coach-course-card__title">{c.title}</div>

                <div className="coach-course-card__meta">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                  </svg>
                  {c.totalSessions} buổi, {c.sessionDurationMin} phút
                  {c.scheduleType === 'FIXED' && c.startDate && (
                    <> · Khai giảng {formatDate(c.startDate)}</>
                  )}
                </div>

                {c.recurringDays && c.recurringTime && (
                  <div className="coach-course-card__sub">
                    {c.recurringDays.map((d) => DAY_LABEL[d]).join(' · ')} lúc {c.recurringTime}
                  </div>
                )}

                {/* Seats progress (C8) */}
                <div className="coach-course-card__seats">
                  <div className="coach-course-card__bar">
                    <span style={{ width: `${pct}%` }} />
                  </div>
                  <small>{booked}/{c.maxParticipants} chỗ</small>
                </div>

                <div className="coach-course-card__footer">
                  <div className="coach-course-card__price">
                    <strong>{formatVND(c.price.amount)}</strong>
                    <small>~ {formatVND(c.pricePerSession.amount)}/buổi</small>
                  </div>
                  {isFull ? (
                    <Button href={ROUTES.courseDetail(c.id)} variant="secondary" size="sm">
                      Danh sách chờ
                    </Button>
                  ) : isStarted ? (
                    <Button variant="secondary" size="sm" disabled>
                      Đã đóng
                    </Button>
                  ) : (
                    <Button href={ROUTES.courseDetail(c.id)} variant="primary" size="sm">
                      Đăng ký
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
