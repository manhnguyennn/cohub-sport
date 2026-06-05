import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@config/routes';
import { formatMoney } from '@lib/format';
import type { Coach } from '@app-types/coach';

type CoachProfileHeroProps = { coach: Coach };

/** "2 giờ" / "24 giờ" — đổi response time phút sang text thân thiện */
function responseLabel(minutes?: number): string | null {
  if (minutes == null) return null;
  if (minutes <= 120) return 'Phản hồi trong vòng 2 giờ';
  if (minutes <= 60 * 24) return 'Phản hồi trong vòng 24 giờ';
  return 'Phản hồi trong 1-2 ngày';
}

export default function CoachProfileHero({ coach }: CoachProfileHeroProps) {
  const sportLabel = coach.sports[0];
  const response = responseLabel(coach.responseRateMinutes);
  const isOnline = coach.responseRateMinutes != null && coach.responseRateMinutes <= 120;

  return (
    <section className="coach-hero-detail">
      <div className="coach-hero-detail__cover">
        <Image
          src={coach.coverImage ?? coach.avatar}
          alt=""
          fill
          sizes="100vw"
          priority
          style={{ objectFit: 'cover' }}
        />
      </div>

      <div className="coach-hero-detail__container">
        {/* Breadcrumb */}
        <nav className="coach-hero-detail__breadcrumb" aria-label="Breadcrumb">
          <Link href={ROUTES.coaches}>Tìm coach</Link>
          {sportLabel && (
            <>
              <span aria-hidden>›</span>
              <Link href={`${ROUTES.coaches}?sport=${sportLabel}`}>{sportLabel}</Link>
            </>
          )}
          <span aria-hidden>›</span>
          <span className="coach-hero-detail__crumb-current">{coach.fullName}</span>
        </nav>

        <div className="coach-hero-detail__bar">
          <div className="coach-hero-detail__avatar">
            <Image src={coach.avatar} alt={coach.fullName} fill sizes="110px" />
            {isOnline && <span className="coach-hero-detail__online" aria-label="Đang hoạt động" />}
          </div>

          <div className="coach-hero-detail__main">
            <div className="coach-hero-detail__name-row">
              <span className="coach-hero-detail__name">{coach.fullName}</span>
              {coach.isVerified && (
                <span className="coach-hero-detail__verified">
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                    <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                  </svg>
                  Đã xác minh
                </span>
              )}
            </div>

            <div className="coach-hero-detail__role">
              {coach.title ?? 'Coach'}
              {coach.location.city ? ` · ${coach.location.city}` : ''}
            </div>

            <div className="coach-hero-detail__meta">
              <span>
                <svg className="coach-hero-detail__star" width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
                </svg>
                <strong>{coach.rating.toFixed(1)}</strong>
                <span>({coach.reviewCount} đánh giá)</span>
              </span>
              {coach.studentCount != null && (
                <span>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z" />
                  </svg>
                  <strong>{coach.studentCount}</strong>
                  <span>học viên</span>
                </span>
              )}
              {coach.tags?.includes('Top Rated') && (
                <span className="coach-hero-detail__top-rated">★ Top Rated</span>
              )}
              <span>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M12 2a8 8 0 0 0-8 8c0 5.4 7 12 7.3 12.3a1 1 0 0 0 1.4 0C13 22 20 15.4 20 10a8 8 0 0 0-8-8zm0 11a3 3 0 1 1 0-6 3 3 0 0 1 0 6z" />
                </svg>
                {coach.location.city}
              </span>
            </div>

            {response && (
              <div className="coach-hero-detail__response">
                <span className="coach-hero-detail__response-dot" aria-hidden />
                {response}
              </div>
            )}

            {/* Mobile-only price chip (C13) */}
            <span className="coach-hero-detail__price-chip">
              Từ {formatMoney(coach.pricePerHour)}/giờ
            </span>
          </div>

          <div className="coach-hero-detail__actions">
            <button type="button" className="coach-hero-detail__icon-btn" aria-label="Lưu coach">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="m12 21-1.45-1.32C5.4 15 2 11.9 2 8.1 2 5.4 4.4 3 7.1 3 8.6 3 10.1 3.6 11 4.6c1-1 2.5-1.6 4-1.6 2.7 0 5.1 2.4 5.1 5.1 0 3.8-3.4 6.9-8.55 11.58z" />
              </svg>
            </button>
            <button type="button" className="coach-hero-detail__icon-btn" aria-label="Chia sẻ">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
