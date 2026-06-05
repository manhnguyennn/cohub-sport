import Link from 'next/link';
import { ROUTES } from '@config/routes';

export default function CoachFinalCta() {
  return (
    <section className="coach-final-cta">
      <div className="coach-final-cta__container">
        <div className="coach-final-cta__grid">
          <div className="coach-final-cta__card coach-final-cta__card--coach">
            <div>
              <div className="coach-final-cta__card-title">Tìm coach phù hợp với bạn</div>
              <p className="coach-final-cta__card-text">
                Dù bạn là người mới bắt đầu hay đang luyện tập để thi đấu, bạn không đơn độc trên hành trình này.
                Tìm một coach sẽ đồng hành và dẫn dắt bạn tới mục tiêu.
              </p>
            </div>
            <Link href={ROUTES.coaches} className="coach-final-cta__card-btn">
              Tìm coach
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>

          <div className="coach-final-cta__card coach-final-cta__card--sport">
            <div>
              <div className="coach-final-cta__card-title">Quan tâm môn thể thao khác?</div>
              <p className="coach-final-cta__card-text">
                Tầm nhìn của CoHub là xây dựng nền tảng giúp mọi học viên Việt Nam tiếp cận những
                coach giỏi nhất, ở bất kỳ bộ môn nào.
              </p>
            </div>
            <Link href={ROUTES.coaches} className="coach-final-cta__card-btn">
              Xem các môn khác
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
                <path d="M5 12h14M13 5l7 7-7 7" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
