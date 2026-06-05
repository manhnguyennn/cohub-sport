import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatMoney } from '@lib/format';
import type { Coach } from '@app-types/coach';

type CoachListItemProps = { coach: Coach };

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

export default function CoachListItem({ coach }: CoachListItemProps) {
  const detailHref = ROUTES.coachDetail(coach.slug);

  return (
    <article className="coach-item">
      {/* Thumbnail clickable */}
      <Link
        href={detailHref}
        className="coach-item__media"
        aria-label={`Xem chi tiết ${coach.fullName}`}
      >
        {coach.tags?.includes('Top Rated') && (
          <span className="coach-item__top-badge">
            <span className="coach-item__top-rated">★ Top Rated</span>
          </span>
        )}
        <Image
          src={coach.coverImage ?? coach.avatar}
          alt={coach.fullName}
          fill
          sizes="(max-width: 768px) 100vw, 240px"
          style={{ objectFit: 'cover' }}
        />
      </Link>

      <div className="coach-item__body">
        <div className="coach-item__top">
          <div className="coach-item__name-row">
            {/* Name clickable */}
            <Link href={detailHref} className="coach-item__name">
              {coach.fullName}
            </Link>
            {coach.isVerified && (
              <span className="coach-item__verified-tag">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                  <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                </svg>
                Professional Coach
              </span>
            )}
          </div>
        </div>

        <div className="coach-item__meta">
          <span className="coach-item__meta-item">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="#F4B43F" aria-hidden>
              <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
            </svg>
            <strong>{coach.rating.toFixed(2)}</strong>
            <span style={{ color: 'var(--text-muted)' }}>({coach.reviewCount})</span>
          </span>
          {coach.studentCount && (
            <span className="coach-item__meta-item">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {coach.studentCount.toLocaleString('vi-VN')}
            </span>
          )}
          <span className="coach-item__meta-item">
            <AppIcon name="location" size={14} /> {coach.location.city}
          </span>
          {coach.title && (
            <span className="coach-item__meta-item" style={{ color: 'var(--text-muted)' }}>
              · {coach.title}
            </span>
          )}
        </div>

        <p className="coach-item__bio">{coach.bio}</p>

        <div className="coach-item__footer">
          <div className="coach-item__price">
            <span>Chỉ từ</span>
            <strong>
              {formatMoney(coach.pricePerHour)}<small> /giờ</small>
            </strong>
          </div>
          <div className="coach-item__actions">
            <Button href={ROUTES.coachDetail(coach.slug)} variant="secondary" size="sm">
              Giới thiệu
            </Button>
            <Button href={buildDefaultBookingHref(coach.id)} variant="primary" size="sm">
              Đặt lịch
            </Button>
          </div>
        </div>
      </div>
    </article>
  );
}
