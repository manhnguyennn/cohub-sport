'use client';

/**
 * Skeleton primitive + 3 preset (Card / List / Detail).
 * Hiển thị khi loading data — giảm CLS, tăng perceived performance.
 */
import { cn } from '@lib/cn';

type SkeletonProps = {
  width?: string | number;
  height?: string | number;
  radius?: 'sm' | 'md' | 'lg' | 'full';
  className?: string;
  style?: React.CSSProperties;
};

export function Skeleton({ width = '100%', height = 16, radius = 'md', className, style }: SkeletonProps) {
  return (
    <span
      className={cn('skeleton', radius && `skeleton--${radius}`, className)}
      style={{ width, height, ...style }}
      aria-hidden
    />
  );
}

/** Card skeleton — cover ảnh + 2 dòng text + button */
export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton-card', className)} aria-busy="true">
      <Skeleton height={180} radius="md" />
      <Skeleton width="70%" height={18} />
      <Skeleton width="40%" height={14} />
      <Skeleton width="100%" height={36} radius="md" />
    </div>
  );
}

/** List skeleton — N row mỗi row có avatar + 2 dòng */
export function SkeletonList({ rows = 5, className }: { rows?: number; className?: string }) {
  return (
    <div className={cn('skeleton-list', className)} aria-busy="true">
      {Array.from({ length: rows }).map((_, i) => (
        <div className="skeleton-list__row" key={i}>
          <Skeleton width={48} height={48} radius="full" />
          <div className="skeleton-list__col">
            <Skeleton width="60%" height={16} />
            <Skeleton width="40%" height={12} />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Detail skeleton — hero ảnh + title + meta + paragraphs */
export function SkeletonDetail({ className }: { className?: string }) {
  return (
    <div className={cn('skeleton-detail', className)} aria-busy="true">
      <Skeleton height={280} radius="lg" />
      <Skeleton width="60%" height={28} />
      <Skeleton width="40%" height={16} />
      <Skeleton width="100%" height={12} />
      <Skeleton width="95%" height={12} />
      <Skeleton width="80%" height={12} />
    </div>
  );
}
