import { notFound } from 'next/navigation';
import { coachService } from '@services/coach.service';
import { courseService } from '@services/course.service';
import { reviewService } from '@services/review.service';
import { openSessionService } from '@services/openSession.service';
import type { Coach, RatingDistribution } from '@app-types/coach';

import CoachProfileHero from '@features/coaches/components/CoachProfileHero';
import CoachBookingLauncher from '@features/coaches/components/CoachBookingLauncher';
import CoachProfileTabs from '@features/coaches/components/CoachProfileTabs';
import CoachAbout from '@features/coaches/components/CoachAbout';
import CoachExperienceSection from '@features/coaches/components/CoachExperienceSection';
import CoachShortVideos from '@features/coaches/components/CoachShortVideos';
import CoachReviewsSection from '@features/coaches/components/CoachReviewsSection';
import CoachCoursesSection from '@features/coaches/components/CoachCoursesSection';
import CoachOpenSessionsSection from '@features/coaches/components/CoachOpenSessionsSection';
import CoachBookingPanel from '@features/coaches/components/CoachBookingPanel';
import CoachSimilarSection from '@features/coaches/components/CoachSimilarSection';
import CoachWhyCohub from '@features/coaches/components/CoachWhyCohub';
import CoachFaq from '@features/coaches/components/CoachFaq';
import CoachFinalCta from '@features/coaches/components/CoachFinalCta';

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
  const [reviews, courses, openSessions, similar, distribution] = await Promise.all([
    reviewService.listByCoach(coach.id).catch(() => []),
    courseService.publishedByCoach(coach.id).catch(() => []),
    openSessionService.list({ coachId: coach.id, scope: 'upcoming' }).catch(() => []),
    coachService.similar(coach.id).catch(() => []),
    coachService.ratingDistribution(coach.id).catch<RatingDistribution>(() => ({
      average: coach.rating,
      total: coach.reviewCount,
      breakdown: { 5: 75, 4: 21, 3: 3, 2: 1, 1: 0.5 },
    })),
  ]);

  // Tìm session sắp tới nhất để mobile sticky bar trỏ tới
  const nextSession = openSessions[0];

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
              <CoachBookingPanel
                coach={coach}
                openSessions={openSessions}
                nextSession={nextSession}
                courseCount={courses.length}
              />
            </div>
          </div>

          {/* Lịch dạy mở — full-width: học viên xem & book trực tiếp từng buổi */}
          <CoachOpenSessionsSection sessions={openSessions} />

          {/* Khoá học — gói nhiều buổi, full-width dưới grid */}
          <CoachCoursesSection courses={courses} />
        </div>
      </div>

      {/* Mobile sticky CTA bar — mở modal đặt lịch */}
      <CoachBookingLauncher coach={coach} openSessions={openSessions} variant="sticky" />

      <CoachSimilarSection coaches={similar} />
      <CoachWhyCohub />
      <CoachFaq />
      <CoachFinalCta />
    </>
  );
}
