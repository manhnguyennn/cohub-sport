import Image from 'next/image';
import Link from 'next/link';
import { ROUTES } from '@config/routes';
import type { Review } from '@app-types/review';

type Props = {
  reviews: Review[];
  coachName: string;
  coachSlug: string;
  rating: number;
  reviewCount: number;
};

function Stars({ value = 5 }: { value?: number }) {
  return (
    <span className="course-reviews__stars" aria-label={`${value} sao`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill={i <= Math.round(value) ? '#F59E0B' : '#E5E7EB'} aria-hidden>
          <path d="M12 2l2.95 6.71 7.05.94-5.13 4.99 1.32 7.34L12 18.27 5.81 22l1.32-7.34L2 9.65l7.05-.94L12 2z" />
        </svg>
      ))}
    </span>
  );
}

/**
 * Course reviews — reuse đánh giá của coach (spec §4.3.5 K7).
 * Hiển thị 3 review tiêu biểu + link xem tất cả ở trang coach.
 */
export default function CourseReviews({ reviews, coachName, coachSlug, rating, reviewCount }: Props) {
  if (!reviews.length) return null;
  const top = reviews.slice(0, 3);

  return (
    <section className="course-reviews">
      <header className="course-reviews__head">
        <h2>Đánh giá học viên về Coach {coachName}</h2>
        <div className="course-reviews__score">
          <Stars value={rating} />
          <strong>{rating.toFixed(1)}</strong>
          <span>· {reviewCount} đánh giá</span>
        </div>
      </header>

      <div className="course-reviews__grid">
        {top.map((r) => (
          <article className="course-reviews__card" key={r.id}>
            <div className="course-reviews__card-head">
              {r.userAvatar && (
                <Image src={r.userAvatar} alt={r.userName} width={36} height={36} style={{ objectFit: 'cover', borderRadius: '999px' }} />
              )}
              <div>
                <div className="course-reviews__card-name">{r.userName}</div>
                <Stars value={r.rating} />
              </div>
            </div>
            <p className="course-reviews__card-text">{r.comment}</p>
          </article>
        ))}
      </div>

      <Link href={`${ROUTES.coachDetail(coachSlug)}#reviews`} className="course-reviews__all">
        Xem tất cả {reviewCount} đánh giá →
      </Link>
    </section>
  );
}
