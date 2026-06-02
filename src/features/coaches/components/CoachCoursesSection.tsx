import Image from 'next/image';
import { Button } from '@components/ui';
import { formatMoney } from '@lib/format';
import { ROUTES } from '@config/routes';
import type { CoachCourse } from '@app-types/coach';

type Props = { courses: CoachCourse[] };

export default function CoachCoursesSection({ courses }: Props) {
  if (!courses || courses.length === 0) return null;

  return (
    <section id="courses" className="coach-section coach-courses">
      <h2 className="coach-section__title">Khoá học</h2>

      <div className="coach-courses__grid">
        {courses.map((c) => (
          <article className="coach-course-card" key={c.id}>
            <div className="coach-course-card__media">
              <Image
                src={c.thumbnail}
                alt={c.title}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 320px"
                style={{ objectFit: 'cover' }}
              />
              {c.isHotDeal && <span className="coach-course-card__badge">Giá tốt</span>}
            </div>

            <div className="coach-course-card__body">
              <div>
                <div className="coach-course-card__title">{c.title}</div>
                {c.subtitle && <div className="coach-course-card__subtitle">{c.subtitle}</div>}
              </div>

              <p className="coach-course-card__desc">{c.description}</p>

              <div className="coach-course-card__meta">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                  <rect x="3" y="4" width="18" height="18" rx="2" />
                  <line x1="16" y1="2" x2="16" y2="6" />
                  <line x1="8" y1="2" x2="8" y2="6" />
                  <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                {c.sessions} buổi, lịch tự chọn
              </div>

              <ul className="coach-course-card__bullets">
                {c.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>

              <div className="coach-course-card__footer">
                <div className="coach-course-card__price">
                  <small>Giá chỉ còn</small>
                  <span>
                    <strong>{formatMoney(c.newPrice)}</strong>
                    {c.oldPrice && <s>{formatMoney(c.oldPrice)}</s>}
                  </span>
                </div>
                <Button href={ROUTES.booking} variant="primary" size="sm">
                  Đăng ký
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
