import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { courseService } from '@services/course.service';
import { coachService } from '@services/coach.service';
import { reviewService } from '@services/review.service';
import { ROUTES } from '@config/routes';
import { formatDate, formatTime, formatVND } from '@lib/date';
import { Button, MobileStickyBar } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { TrustStrip } from '@components/shared';
import CourseEnrollCta from '@features/courses/CourseEnrollCta';
import CourseReviews from '@features/courses/CourseReviews';
import CourseFAQ from '@features/courses/CourseFAQ';
import CourseCrossSell from '@features/courses/CourseCrossSell';
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
      {/* Hero */}
      <section className="course-detail-hero">
        <div className="course-detail-hero__cover">
          <Image src={course.cover} alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
        </div>
        <div className="course-detail-hero__container">
          {/* Breadcrumb (K11) */}
          <nav className="course-detail-hero__breadcrumb" aria-label="Breadcrumb">
            <Link href={ROUTES.home}>Trang chủ</Link>
            <span aria-hidden>›</span>
            <Link href={ROUTES.courses}>Khoá học</Link>
            <span aria-hidden>›</span>
            <Link href={`${ROUTES.courses}?sport=${sportLabel}`}>{sportLabel}</Link>
          </nav>

          <span className="course-detail-hero__type">
            <AppIcon name={course.scheduleType === 'FIXED' ? 'calendar' : 'flash'} size={14} />
            {course.scheduleType === 'FIXED' ? 'Lịch cố định' : 'Linh hoạt'}
          </span>
          <h1>{course.title}</h1>

          {/* Coach card lớn (K2) */}
          <div className="course-coach-card">
            {course.coachAvatar && (
              <Image
                className="course-coach-card__avatar"
                src={course.coachAvatar}
                alt={course.coachName}
                width={64}
                height={64}
                style={{ objectFit: 'cover', borderRadius: '999px' }}
              />
            )}
            <div className="course-coach-card__body">
              <div className="course-coach-card__name">
                {course.coachName}
                {coach?.isVerified && (
                  <span className="course-coach-card__verified">
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M9 16.17 4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
                    </svg>
                    Đã xác minh
                  </span>
                )}
              </div>
              <div className="course-coach-card__meta">
                {coach?.title ?? 'Coach'}
                {coach?.experienceYears != null && <> · {coach.experienceYears} năm KN</>}
              </div>
              {coach && (
                <div className="course-coach-card__rating">
                  <svg width="13" height="13" viewBox="0 0 24 24" fill="#F59E0B" aria-hidden>
                    <path d="M12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21 12 17.27 18.18 21l-1.64-7.03L22 9.24l-7.19-.61z" />
                  </svg>
                  <strong>{coach.rating.toFixed(1)}</strong>
                  <span>({coach.reviewCount} đánh giá)</span>
                </div>
              )}
              <Link href={ROUTES.coachDetail(coachSlug)} className="course-coach-card__link">
                Xem hồ sơ Coach {course.coachName} →
              </Link>
            </div>
          </div>
        </div>
      </section>

      <div className="course-detail-page__container">
        <div className="course-detail-page__grid">
          <main className="course-detail-main">
            <section>
              <h2>Giới thiệu khoá học</h2>
              <p className="course-detail-main__desc">{course.description}</p>
            </section>

            <section>
              <h2>Bạn sẽ học được</h2>
              <ul className="course-detail-main__learn-list">
                {course.whatYoullLearn.map((item) => (
                  <li key={item}>
                    <span aria-hidden>✓</span>
                    {item}
                  </li>
                ))}
              </ul>
            </section>

            {course.requirements && (
              <section>
                <h2>Yêu cầu</h2>
                <p className="course-detail-main__desc">{course.requirements}</p>
              </section>
            )}

            {/* Sessions table — FIXED only */}
            {course.scheduleType === 'FIXED' && sessions.length > 0 && (
              <section>
                <h2>Lịch {course.totalSessions} buổi</h2>
                <div className="course-detail-main__schedule">
                  <div className="course-detail-main__schedule-hint">
                    Lặp lại {course.recurringDays?.map((d) => DAY_LABEL[d]).join(', ')} · {course.recurringTime}
                  </div>
                  <ol className="course-detail-main__sessions">
                    {sessions.map((s) => (
                      <li key={s.id}>
                        <span className="course-detail-main__sess-num">Buổi {s.sequence}</span>
                        <span className="course-detail-main__sess-date">
                          {formatDate(s.startsAt)} · {formatTime(s.startsAt)}
                        </span>
                        <span className="course-detail-main__sess-dur">
                          {s.durationMinutes} phút
                        </span>
                      </li>
                    ))}
                  </ol>
                </div>
              </section>
            )}

            {/* Flexible info */}
            {course.scheduleType === 'FLEXIBLE' && (
              <section>
                <h2>Cách thức linh hoạt</h2>
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
