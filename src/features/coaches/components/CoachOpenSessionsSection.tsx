/**
 * CoachOpenSessionsSection — hiển thị "Lịch dạy mở" coach đã đăng.
 *
 * UX:
 *   - Mỗi card = 1 buổi cụ thể với ngày-giờ + giá riêng
 *   - Học viên click "Đặt buổi này" → /booking/session/[id]
 *   - "Đã đầy" → disable, không cho book
 *
 * Phân biệt với CoachCoursesSection (gói trọn vẹn).
 */
import { Button } from '@components/ui';
import { formatVND, formatNextSlot } from '@lib/date';
import { ROUTES } from '@config/routes';
import { cn } from '@lib/cn';
import type { OpenSession } from '@app-types/openSession';

type Props = { sessions: OpenSession[] };

const LEVEL_LABELS: Record<NonNullable<OpenSession['level']>, string> = {
  all:          'Mọi cấp độ',
  beginner:     'Người mới',
  intermediate: 'Trung cấp',
  advanced:     'Nâng cao',
};

export default function CoachOpenSessionsSection({ sessions }: Props) {
  // Chỉ hiện những lịch sắp tới + còn open hoặc đã full
  const upcoming = (sessions ?? []).filter((s) => {
    const isFuture = new Date(s.startsAt).getTime() >= Date.now();
    return isFuture && (s.status === 'open' || s.status === 'full');
  });

  if (upcoming.length === 0) return null;

  return (
    <section id="open-sessions" className="coach-section coach-open-sessions">
      <header className="coach-section__head">
        <h2 className="coach-section__title">Lịch dạy mở</h2>
        <p className="coach-section__sub">
          Các buổi tập cụ thể coach đã sắp xếp. Chọn buổi phù hợp và đặt trực tiếp.
        </p>
      </header>

      <div className="coach-open-sessions__grid">
        {upcoming.map((s) => {
          const remaining = s.capacity - s.bookedCount;
          const isFull = s.status === 'full' || remaining <= 0;
          return (
            <article
              key={s.id}
              className={cn('open-session-card', isFull && 'open-session-card--full')}
            >
              <div className="open-session-card__time-block">
                <strong className="open-session-card__time">{formatNextSlot(s.startsAt)}</strong>
                <span className="open-session-card__duration">⏱ {s.durationMinutes} phút</span>
              </div>

              <div className="open-session-card__body">
                <h3 className="open-session-card__title">
                  {s.title ?? 'Buổi tập 1-1'}
                </h3>

                <div className="open-session-card__chips">
                  <span className="open-session-card__chip">
                    {s.capacity === 1 ? '1-1' : `Nhóm ${s.capacity}`}
                  </span>
                  {s.level && (
                    <span className="open-session-card__chip open-session-card__chip--muted">
                      {LEVEL_LABELS[s.level]}
                    </span>
                  )}
                  <span className="open-session-card__chip open-session-card__chip--muted">
                    {s.location.kind === 'coach_place'
                      ? 'Tại sân coach'
                      : s.location.kind === 'learner_place'
                        ? 'Đến nhà bạn'
                        : 'Sân thuê'}
                  </span>
                </div>

                {s.note && <p className="open-session-card__note">📝 {s.note}</p>}
              </div>

              <div className="open-session-card__foot">
                <div className="open-session-card__price-block">
                  <strong className="open-session-card__price">{formatVND(s.price.amount)}</strong>
                  <small>/người</small>
                </div>

                {isFull ? (
                  <span className="open-session-card__full-badge">Đã đầy</span>
                ) : (
                  <Button href={ROUTES.bookingSession(s.id)} variant="primary" size="sm">
                    Đặt buổi này
                  </Button>
                )}
              </div>

              {!isFull && s.capacity > 1 && (
                <div className="open-session-card__remaining">
                  Còn {remaining}/{s.capacity} chỗ
                </div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
