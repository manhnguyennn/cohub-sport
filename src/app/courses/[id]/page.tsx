import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { courseService } from '@services/course.service';
import { coachService } from '@services/coach.service';
import { reviewService } from '@services/review.service';
import { ROUTES } from '@config/routes';
import { formatVND } from '@lib/date';
import { Button, MobileStickyBar } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { TrustStrip } from '@components/shared';
import CourseEnrollCta from '@features/courses/CourseEnrollCta';
import CourseReviews from '@features/courses/CourseReviews';
import CourseFAQ from '@features/courses/CourseFAQ';
import CourseCrossSell from '@features/courses/CourseCrossSell';
import CourseSectionTabs from '@features/courses/CourseSectionTabs';
import CourseIntroVideo from '@features/courses/CourseIntroVideo';
import CourseContentAccordion from '@features/courses/CourseContentAccordion';
import CourseShortVideos from '@features/courses/CourseShortVideos';
import CoachFollowButton from '@features/courses/CoachFollowButton';
import type { CourseSession } from '@app-types/course';
import type { Coach } from '@app-types/coach';
import type { Review } from '@app-types/review';

const DAY_LABEL = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];

type PageProps = { params: { id: string } };

export async function generateMetadata({ params }: PageProps) {
  try {
    const c = await courseService.getById(params.id);
    return { title: c.title };
  } catch {
    return { title: 'Khoá học không tồn tại' };
  }
}

export default async function CourseDetailPage({ params }: PageProps) {
  let course;
  try {
    course = await courseService.getById(params.id);
  } catch {
    notFound();
  }

  const [sessions, coach, reviews] = await Promise.all([
    courseService.sessions(course.id).catch<CourseSession[]>(() => []),
    coachService.getById(course.coachId).catch<Coach | null>(() => null),
    reviewService.listByCoach(course.coachId).catch<Review[]>(() => []),
  ]);

  const isFull = course.availableSeats === 0 || course.status === 'full';
  const isStarted = course.status === 'started';
  const canEnroll = !isFull && !isStarted && course.status === 'published';

  // Slug coach để link đúng (K4) — fallback id nếu chưa fetch được
  const coachSlug = coach?.slug ?? course.coachId;
  const endDate = sessions.length ? sessions[sessions.length - 1].startsAt : undefined;
  const sportLabel = course.sport;

  return (
    <div className="course-detail-page bottom-safe-pad">
      <div className="course-detail-page__container">
        {/* Breadcrumb (K11) */}
        <nav className="course-detail-breadcrumb" aria-label="Breadcrumb">
          <Link href={ROUTES.home}>Trang chủ</Link>
          <span aria-hidden>›</span>
          <Link href={ROUTES.courses}>Khoá học</Link>
          <span aria-hidden>›</span>
          <Link href={`${ROUTES.courses}?sport=${sportLabel}`}>{sportLabel}</Link>
        </nav>

        <div className="course-detail-page__grid">
          <main className="course-detail-main">
            {/* Hero card — ảnh contained, không full-bleed */}
            <div className="course-hero-card">
              <div className="course-hero-card__media">
                <Image src={course.cover} alt="" fill sizes="(max-width: 1024px) 100vw, 720px" priority style={{ objectFit: 'cover' }} />
                <div className="course-hero-card__overlay">
                  <span className="course-hero-card__eyebrow">
                    <AppIcon name={course.scheduleType === 'FIXED' ? 'calendar' : 'flash'} size={13} />
                    {course.scheduleType === 'FIXED' ? 'Lịch cố định' : 'Lịch linh hoạt'}
                  </span>
                  <h1>{course.title}</h1>
                  <div className="course-hero-card__meta">
                    <span><AppIcon name="book" size={14} /> {course.totalSessions} buổi · {course.sessionDurationMin} phút/buổi</span>
                    <span><AppIcon name="people" size={14} /> Coaching 1-1 hoặc nhóm riêng</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coach header (figma) */}
            <div className="course-coach">
              <div className="course-coach__top">
                {course.coachAvatar && (
                  <Image
                    className="course-coach__avatar"
                    src={course.coachAvatar}
                    alt={course.coachName}
                    width={52}
                    height={52}
                    style={{ objectFit: 'cover', borderRadius: '999px' }}
                  />
                )}
                <div className="course-coach__id">
                  <span className="course-coach__name">
                    {course.coachName}
                    {coach?.isVerified && (
                      <span className="course-coach__verified" title="Đã xác minh">
                        <AppIcon name="shield" size={14} color="var(--success)" variant="Bold" />
                      </span>
                    )}
                  </span>
                  <span className="course-coach__sub">{coach?.title ?? 'Coach'}</span>
                </div>

                {coach && (
                  <div className="course-coach__stats">
                    <span className="course-coach__stat">
                      <AppIcon name="star" size={14} color="#F59E0B" variant="Bold" /> {coach.rating.toFixed(1)}
                    </span>
                    <span className="course-coach__stat">
                      <AppIcon name="people" size={14} /> {coach.reviewCount}
                    </span>
                    <span className="course-coach__stat">
                      <AppIcon name="location" size={14} /> {coach.location?.city ?? '—'}
                    </span>
                  </div>
                )}

                <div className="course-coach__actions">
                  <Link href={ROUTES.coachDetail(coachSlug)} className="course-coach__profile">
                    <AppIcon name="user" size={15} /> Hồ sơ coach
                  </Link>
                  <CoachFollowButton coachName={course.coachName} />
                </div>
              </div>
              {coach?.bio && <p className="course-coach__bio">{coach.bio}</p>}
            </div>

            {/* Tab nav (figma) */}
            <CourseSectionTabs />

            {/* Giới thiệu */}
            <section id="gioi-thieu" className="course-section">
              <h2>Giới thiệu</h2>
              <CourseIntroVideo poster={course.cover} title={course.title} />
              <p className="course-detail-main__desc">{course.description}</p>
            </section>

            {/* Lợi ích */}
            <section id="loi-ich" className="course-section">
              <h2>Lợi ích</h2>
              <ul className="course-benefits">
                {course.whatYoullLearn.map((item) => (
                  <li key={item}>
                    <span className="course-benefits__check" aria-hidden>
                      <AppIcon name="check" size={13} color="#fff" variant="Bold" />
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {/* Nội dung khoá học */}
            <section id="noi-dung" className="course-section">
              <h2>Nội dung khoá học</h2>
              {course.scheduleType === 'FIXED' && course.recurringDays && (
                <p className="course-section__hint">
                  Lặp lại {course.recurringDays.map((d) => DAY_LABEL[d]).join(', ')} · {course.recurringTime} · {course.totalSessions} buổi
                </p>
              )}
              {course.scheduleType === 'FLEXIBLE' && (
                <div className="course-detail-main__flex-info">
                  <div>
                    <strong>{course.totalSessions} credit</strong>
                    <span>buổi 1-1 tự đặt lịch</span>
                  </div>
                  <div>
                    <strong>{course.flexibleValidityDays} ngày</strong>
                    <span>thời hạn sử dụng kể từ ngày đăng ký</span>
                  </div>
                  <div>
                    <strong>{course.sessionDurationMin} phút</strong>
                    <span>mỗi buổi 1-1 với coach</span>
                  </div>
                </div>
              )}
              {course.syllabus && course.syllabus.length > 0 && (
                <CourseContentAccordion items={course.syllabus} />
              )}
            </section>

            {/* Kỹ năng */}
            {course.skills && course.skills.length > 0 && (
              <section className="course-section">
                <h2>Kỹ năng</h2>
                <div className="course-skills">
                  {course.skills.map((s) => (
                    <span key={s} className="course-skills__chip">{s}</span>
                  ))}
                </div>
              </section>
            )}

            {/* Videos / Short videos */}
            <section id="videos" className="course-section">
              <h2>Videos</h2>
              <CourseShortVideos
                poster={course.cover}
                captions={(course.skills ?? []).map((s) => `Hướng dẫn ${s}`)}
              />
            </section>

            {course.requirements && (
              <section className="course-section">
                <h2>Yêu cầu</h2>
                <p className="course-detail-main__desc">{course.requirements}</p>
              </section>
            )}

            {/* Cross-sell sang Flow 2 (K5) */}
            <CourseCrossSell
              coachName={course.coachName}
              coachSlug={coachSlug}
              fromPrice={coach?.pricePerHour.amount}
            />

            {/* Reviews (K7) */}
            {coach && (
              <CourseReviews
                reviews={reviews}
                coachName={course.coachName}
                coachSlug={coachSlug}
                rating={coach.rating}
                reviewCount={coach.reviewCount}
              />
            )}

            {/* Course FAQ (K8) */}
            <CourseFAQ />

            {/* Trust strip (K9) */}
            <TrustStrip />
          </main>

          {/* Right sticky CTA — desktop only */}
          <aside className="course-detail-aside hide-mobile">
            <CourseEnrollCta
              course={course}
              coachSlug={coachSlug}
              endDate={endDate}
              coachFromPrice={coach?.pricePerHour.amount}
            />
          </aside>
        </div>
      </div>

      {/* Mobile sticky enroll bar */}
      <MobileStickyBar
        info={
          <>
            <span className="mobile-sticky-bar__label">Trọn gói {course.totalSessions} buổi</span>
            <span className="mobile-sticky-bar__price">{formatVND(course.price.amount)}</span>
          </>
        }
        action={
          canEnroll ? (
            <Button href={ROUTES.courseEnroll(course.id)} variant="primary" size="md">
              Đăng ký
            </Button>
          ) : (
            <Button variant="secondary" size="md" disabled>
              {isFull ? 'Đã đầy' : isStarted ? 'Đã bắt đầu' : 'N/A'}
            </Button>
          )
        }
      />
    </div>
  );
}
