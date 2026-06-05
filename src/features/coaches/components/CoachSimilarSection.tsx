import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@config/routes';
import type { Coach } from '@app-types/coach';

type Props = { coaches: Coach[] };

export default function CoachSimilarSection({ coaches }: Props) {
  if (!coaches || coaches.length === 0) return null;

  return (
    <section id="classes" className="coach-similar">
      <div className="coach-similar__container">
        <div className="coach-similar__head">
          <h2 className="coach-similar__title">Huấn luyện viên tương tự</h2>
          <Link href={ROUTES.coaches} className="coach-similar__see-all">
            Xem tất cả
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
              <path d="M5 12h14M13 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        <div className="coach-similar__grid">
          {coaches.map((c) => (
            <Link className="coach-similar-card" href={ROUTES.coachDetail(c.slug)} key={c.id}>
              <Image
                src={c.coverImage ?? c.avatar}
                alt={c.fullName}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 33vw, 280px"
                style={{ objectFit: 'cover', objectPosition: 'center top' }}
              />
              {c.isVerified && (
                <span className="coach-similar-card__top">
                  <span className="coach-similar-card__verified" aria-label="Đã xác thực">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                  </span>
                </span>
              )}
              <div className="coach-similar-card__body">
                <div className="coach-similar-card__name">{c.fullName}</div>
                <div className="coach-similar-card__role">{c.title}</div>
                <div className="coach-similar-card__meta">
                  <span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
                    </svg>
                    {c.rating.toFixed(2)} ({c.reviewCount})
                  </span>
                  {c.studentCount != null && (
                    <span>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                      </svg>
                      {c.studentCount}
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
