import Link from 'next/link';
import Image from 'next/image';
import AppIcon from '@components/ui/AppIcon';
import { ROUTES } from '@config/routes';
import { formatMoney } from '@lib/format';
import type { Coach } from '@app-types/coach';

type CoachCardProps = { coach: Coach };

export default function CoachCard({ coach }: CoachCardProps) {
  return (
    <Link href={ROUTES.coachDetail(coach.slug)} className="coach-card" aria-label={coach.fullName}>
      <div className="coach-card__media">
        <Image
          src={coach.coverImage ?? coach.avatar}
          alt={coach.fullName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 360px"
          style={{ objectFit: 'cover', objectPosition: 'center top' }}
        />
        <div className="coach-card__badge-row">
          {coach.isVerified && (
            <span className="coach-card__verified">
              <AppIcon name="check" size={12} /> Đã xác minh
            </span>
          )}
          {coach.tags?.includes('Top Rated') && (
            <span className="coach-card__toptag">★ Top Rated</span>
          )}
        </div>
      </div>

      <div className="coach-card__body">
        <div className="coach-card__name">{coach.fullName}</div>
        <div className="coach-card__role">
          {coach.title ?? 'Coach'}
          {coach.experienceYears ? ` · ${coach.experienceYears} năm KN` : ''}
        </div>

        <div className="coach-card__signals">
          <span className="coach-card__rating">
            <AppIcon name="star" size={14} variant="Bold" color="#F5A623" />
            <strong>{coach.rating.toFixed(1)}</strong>
            <small>({coach.reviewCount})</small>
          </span>
          <span className="coach-card__loc">
            <AppIcon name="location" size={14} />
            {coach.location.city}
          </span>
        </div>

        <p className="coach-card__bio">{coach.bio}</p>

        <div className="coach-card__meta">
          <div className="coach-card__price">
            <small>Học phí từ</small>
            <span>{formatMoney(coach.pricePerHour)}<small>/giờ</small></span>
          </div>
          <span className="coach-card__cta">
            Xem chi tiết
            <AppIcon name="next" size={15} />
          </span>
        </div>
      </div>
    </Link>
  );
}
