import Link from 'next/link';
import Image from 'next/image';
import { ROUTES } from '@config/routes';
import type { Sport } from '@app-types/sport';

type SportCardProps = { sport: Sport };

export default function SportCard({ sport }: SportCardProps) {
  return (
    <Link
      href={`${ROUTES.coaches}?sport=${sport.slug}`}
      className="sport-card"
      aria-label={sport.name}
    >
      <Image
        src={sport.image}
        alt={sport.name}
        fill
        sizes="(max-width: 768px) 50vw, 25vw"
        style={{ objectFit: 'cover' }}
      />
      <div className="sport-card__overlay">
        <div className="sport-card__chip">
          <strong>{sport.name}</strong>
          {sport.coachCount !== undefined && <small>{sport.coachCount} HLV →</small>}
        </div>
      </div>
    </Link>
  );
}
