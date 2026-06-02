import Image from 'next/image';
import type { RatingDistribution } from '@app-types/coach';
import type { Review } from '@app-types/review';

type Props = {
  reviews: Review[];
  distribution: RatingDistribution;
};

function timeAgo(iso: string): string {
  const ms = Date.now() - new Date(iso).getTime();
  const day = 86_400_000;
  const days = Math.floor(ms / day);
  if (days < 1) return 'Hôm nay';
  if (days < 7) return `${days} ngày trước`;
  const weeks = Math.floor(days / 7);
  if (weeks < 4) return `${weeks} tuần trước`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months} tháng trước`;
  return `${Math.floor(days / 365)} năm trước`;
}

function fmtPct(p: number): string {
  if (p < 1) return '< 1%';
  return `${Math.round(p)}%`;
}

/** 5-star row, fill theo giá trị (4.5 → 4 sao đầy + 1 sao 50%) */
function Stars({ value = 5, size = 20 }: { value?: number; size?: number }) {
  return (
    <span className="rev__stars" aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((i) => {
        const fillRatio = Math.max(0, Math.min(1, value - (i - 1)));
        return (
          <span key={i} className="rev__star" style={{ width: size, height: size }} aria-hidden>
            {/* Base — sao xám */}
            <svg width={size} height={size} viewBox="0 0 24 24" fill="#E5E7EB">
              <path d="M12 2l2.95 6.71 7.05.94-5.13 4.99 1.32 7.34L12 18.27 5.81 22l1.32-7.34L2 9.65l7.05-.94L12 2z" />
            </svg>
            {/* Fill — sao vàng theo % */}
            <span className="rev__star-fill" style={{ width: `${fillRatio * 100}%`, height: size }}>
              <svg width={size} height={size} viewBox="0 0 24 24" fill="#F59E0B">
                <path d="M12 2l2.95 6.71 7.05.94-5.13 4.99 1.32 7.34L12 18.27 5.81 22l1.32-7.34L2 9.65l7.05-.94L12 2z" />
              </svg>
            </span>
          </span>
        );
      })}
    </span>
  );
}

export default function CoachReviewsSection({ reviews, distribution }: Props) {
  const rows = [5, 4, 3, 2, 1] as const;

  return (
    <section id="reviews" className="coach-section coach-reviews">
      <header className="coach-reviews__head">
        <h2 className="coach-section__title">Đánh giá coach</h2>
        <button type="button" className="coach-reviews__sort">
          <span>Nổi bật</span>
          <svg width="11" height="7" viewBox="0 0 11 7" fill="none" aria-hidden>
            <path d="M1 1l4.5 4L10 1" stroke="#4B5563" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </header>

      {/* Big rating card + bars */}
      <div className="coach-reviews__overview">
        <div className="rev-score">
          <div className="rev-score__num">{distribution.average.toFixed(1)}</div>
          <Stars value={distribution.average} size={20} />
          <div className="rev-score__total">{distribution.total} đánh giá</div>
        </div>

        <div className="rev-bars">
          {rows.map((r) => {
            const pct = distribution.breakdown[r] ?? 0;
            return (
              <div className="rev-bar" key={r}>
                <div className="rev-bar__label">
                  <Stars value={r} size={16} />
                  <span>{r} Star</span>
                </div>
                <div className="rev-bar__track">
                  <span className="rev-bar__fill" style={{ width: `${Math.min(pct, 100)}%` }} />
                </div>
                <span className="rev-bar__pct">{fmtPct(pct)}</span>
              </div>
            );
          })}
        </div>
      </div>

      <hr className="coach-reviews__divider" />

      {/* Reviews list */}
      {reviews.length === 0 ? (
        <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>Chưa có đánh giá nào.</p>
      ) : (
        <ul className="coach-reviews__list">
          {reviews.map((r) => (
            <li className="rev-item" key={r.id}>
              <div className="rev-item__avatar">
                {r.userAvatar && (
                  <Image src={r.userAvatar} alt={r.userName} width={40} height={40} style={{ objectFit: 'cover' }} />
                )}
              </div>
              <div className="rev-item__body">
                <div className="rev-item__head">
                  <strong>{r.userName}</strong>
                  <span className="rev-item__sep" aria-hidden>•</span>
                  <time>{timeAgo(r.createdAt)}</time>
                </div>
                <Stars value={r.rating} size={16} />
                <p className="rev-item__comment">{r.comment}</p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {reviews.length > 0 && (
        <div className="coach-reviews__more">
          <button type="button" className="coach-reviews__more-btn">
            <span>Xem thêm</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
}
