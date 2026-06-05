import Image from 'next/image';
import Link from 'next/link';
import { cn } from '@lib/cn';

type CoachMiniBadgeProps = {
  name: string;
  avatar?: string;
  rating?: number;
  reviewCount?: number;
  isVerified?: boolean;
  /** Nếu có → cả badge thành link tới hồ sơ coach */
  href?: string;
  size?: 'sm' | 'md';
  className?: string;
};

/**
 * Coach mini badge dùng chung (spec §5.3) — course card, review reply,
 * chat header, booking detail. Avatar + tên + ✓ verified + rating.
 */
export default function CoachMiniBadge({
  name,
  avatar,
  rating,
  reviewCount,
  isVerified,
  href,
  size = 'sm',
  className,
}: CoachMiniBadgeProps) {
  const px = size === 'md' ? 40 : 32;

  const inner = (
    <>
      {avatar && (
        <span className="coach-mini__avatar" style={{ width: px, height: px }}>
          <Image src={avatar} alt={name} width={px} height={px} style={{ objectFit: 'cover' }} />
        </span>
      )}
      <span className="coach-mini__body">
        <span className="coach-mini__name">
          {name}
          {isVerified && (
            <svg className="coach-mini__verified" width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-label="Đã xác minh">
              <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
            </svg>
          )}
        </span>
        {rating != null && (
          <span className="coach-mini__rating">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
              <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
            </svg>
            {rating.toFixed(1)}
            {reviewCount != null && <small>({reviewCount})</small>}
          </span>
        )}
      </span>
    </>
  );

  if (href) {
    return (
      <Link href={href} className={cn('coach-mini', `coach-mini--${size}`, className)}>
        {inner}
      </Link>
    );
  }
  return <div className={cn('coach-mini', `coach-mini--${size}`, className)}>{inner}</div>;
}
