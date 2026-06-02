import { formatRating } from '@lib/format';

type RatingProps = {
  value: number;
  count?: number;
  size?: 'sm' | 'md';
};

export default function Rating({ value, count, size = 'sm' }: RatingProps) {
  return (
    <span className="coach-card__rating">
      <svg
        width={size === 'sm' ? 14 : 16}
        height={size === 'sm' ? 14 : 16}
        viewBox="0 0 24 24"
        fill="#F59E0B"
        aria-hidden
      >
        <path d="M12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
      </svg>
      {formatRating(value)}
      {count !== undefined && <small>({count})</small>}
    </span>
  );
}
