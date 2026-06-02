import { notFound } from 'next/navigation';
import { coachService } from '@services/coach.service';
import { reviewService } from '@services/review.service';
import { Button, MobileStickyBar } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatVND } from '@lib/date';
import type { Coach, RatingDistribution } from '@app-types/coach';

import CoachProfileHero from '@features/coaches/components/CoachProfileHero';
import CoachProfileTabs from '@features/coaches/components/CoachProfileTabs';
import CoachAbout from '@features/coaches/components/CoachAbout';
import CoachExperienceSection from '@features/coaches/components/CoachExperienceSection';
import CoachShortVideos from '@features/coaches/components/CoachShortVideos';
import CoachReviewsSection from '@features/coaches/components/CoachReviewsSection';
import CoachCoursesSection from '@features/coaches/components/CoachCoursesSection';
import CoachBookingPanel from '@features/coaches/components/CoachBookingPanel';
import CoachSimilarSection from '@features/coaches/components/CoachSimilarSection';
import CoachWhyCohub from '@features/coaches/components/CoachWhyCohub';
import CoachFaq from '@features/coaches/components/CoachFaq';
import CoachFinalCta from '@features/coaches/components/CoachFinalCta';

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

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps) {
  try {
    const coach = await coachService.getById(params.id);
    return {
      title: `${coach.fullName} — ${coach.title ?? 'Coach'} | CoHub`,
      description: coach.bio,
    };
  } catch {
    return { title: 'Coach không tồn tại' };
  }
}

export default async function CoachDetailPage({ params }: PageProps) {
  // Fetch coach trước — nếu fail thì 404 sớm
  let coach: Coach;
  try {
    coach = await coachService.getById(params.id);
  } catch {
    notFound();
  }

  // Parallel: data phụ trợ — đều có fallback an toàn
  const [reviews, courses, similar, distribution] = await Promise.all([
    reviewService.listByCoach(coach.id).catch(() => []),
    coachService.courses(coach.id).catch(() => []),
    coachService.similar(coach.id).catch(() => []),
    coachService.ratingDistribution(coach.id).catch<RatingDistribution>(() => ({
      average: coach.rating,
      total: coach.reviewCount,
      breakdown: { 5: 75, 4: 21, 3: 3, 2: 1, 1: 0.5 },
    })),
  ]);

  return (
    <>
      <CoachProfileHero coach={coach} />
      <CoachProfileTabs />

      <div className="coach-detail bottom-safe-pad">
        <div className="coach-detail__container">
          <div className="coach-detail__grid">
            <main className="coach-detail__main">
              <CoachAbout coach={coach} />
              <CoachExperienceSection coach={coach} />
              <CoachShortVideos videos={coach.shortVideos ?? []} />
              <CoachReviewsSection reviews={reviews} distribution={distribution} />
            </main>

            {/* Desktop sidebar — ẩn trên mobile */}
            <div className="coach-detail__sidebar hide-mobile">
              <CoachBookingPanel coach={coach} />
            </div>
          </div>

          {/* Khoá học — full-width dưới grid (không bị sidebar chiếm chỗ) */}
          <CoachCoursesSection courses={courses} />
        </div>
      </div>

      {/* Mobile sticky CTA bar — chỉ hiện < 768px */}
      <MobileStickyBar
        info={
          <>
            <span className="mobile-sticky-bar__label">Học phí từ</span>
            <span className="mobile-sticky-bar__price">
              {formatVND(coach.pricePerHour.amount)}<small>/giờ</small>
            </span>
          </>
        }
        action={
          <Button href={buildDefaultBookingHref(coach.id)} variant="primary" size="md">
            Đặt lịch
          </Button>
        }
      />

      <CoachSimilarSection coaches={similar} />
      <CoachWhyCohub />
      <CoachFaq />
      <CoachFinalCta />
    </>
  );
}
