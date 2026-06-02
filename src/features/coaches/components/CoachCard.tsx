import Link from 'next/link';
import Image from 'next/image';
import { Badge, Rating } from '@components/ui';
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
          sizes="(max-width: 768px) 50vw, 25vw"
          style={{ objectFit: 'cover' }}
        />
        <div className="coach-card__badge-row">
          {coach.isVerified && <Badge variant="brand">✓ Verified</Badge>}
          {coach.tags?.slice(0, 1).map((t) => (
            <Badge key={t} variant="success">{t}</Badge>
          ))}
        </div>
      </div>

      <div className="coach-card__body">
        <div className="coach-card__name">{coach.fullName}</div>
        <div className="coach-card__bio">{coach.bio}</div>

        <div className="coach-card__meta">
          <Rating value={coach.rating} count={coach.reviewCount} />
          <div className="coach-card__price">
            {formatMoney(coach.pricePerHour)}
            <small>/giờ</small>
          </div>
        </div>
      </div>
    </Link>
  );
}
