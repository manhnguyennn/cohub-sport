'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, SkeletonDetail } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatDate, formatTime, formatVND } from '@lib/date';
import { cn } from '@lib/cn';
import { courseService, enrollmentService } from '@services/course.service';
import { useAuth } from '@hooks/useAuth';
import { useToast } from '@contexts/ToastContext';
import type { Course, CourseSession, Enrollment } from '@app-types/course';
import CancelEnrollmentModal from './CancelEnrollmentModal';

type State = {
  enrollment: Enrollment;
  course: Course;
  sessions: CourseSession[];
};

export default function MyCourseDetailClient({ enrollmentId }: { enrollmentId: string }) {
  const router = useRouter();
  const { isReady, isLoggedIn, requireLogin } = useAuth();
  const toast = useToast();

  const [state, setState] = useState<State | null>(null);
  const [cancelOpen, setCancelOpen] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.myCourseDetail(enrollmentId) });
      return;
    }
    (async () => {
      try {
        const enrollment = await enrollmentService.getById(enrollmentId);
        const [course, sessions] = await Promise.all([
          courseService.getById(enrollment.courseId),
          courseService.sessions(enrollment.courseId),
        ]);
        setState({ enrollment, course, sessions });
      } catch {
        toast.error('Không tìm thấy khoá học.');
        router.replace(ROUTES.myCourses);
      }
    })();
  }, [enrollmentId, isReady, isLoggedIn, requireLogin, router, toast]);

  if (!isReady || !isLoggedIn) return null;
  if (!state) {
    return (
      <div className="course-detail-page__container">
        <SkeletonDetail />
      </div>
    );
  }

  const { enrollment, course, sessions } = state;
  const progress = Math.round((enrollment.sessionsCompleted / enrollment.totalSessions) * 100);
  const canCancel = enrollment.status === 'in_progress';

  return (
    <>
      <div className="course-detail-page">
        <div className="course-detail-page__container">
          <nav className="booking-form-page__breadcrumb" style={{ marginBottom: 16 }}>
            <Link href={ROUTES.myCourses}>← Khoá học của tôi</Link>
          </nav>

          <header className="my-course-detail-hero">
            <div className="my-course-detail-hero__media">
              <Image src={course.cover} alt="" fill sizes="220px" style={{ objectFit: 'cover' }} />
            </div>
            <div className="my-course-detail-hero__body">
              <h1>{course.title}</h1>
              <p>HLV {course.coachName} · {course.totalSessions} buổi · {course.sessionDurationMin} phút/buổi</p>

              <div className="my-course-card__progress">
                <div className="my-course-card__progress-bar">
                  <span style={{ width: `${progress}%` }} />
                </div>
                <small>{enrollment.sessionsCompleted}/{enrollment.totalSessions} buổi · {progress}%</small>
              </div>
            </div>
          </header>

          <div className="course-detail-page__grid">
            <main className="course-detail-main">
              {course.scheduleType === 'FIXED' && (
                <section>
                  <h2>Lịch buổi học</h2>
                  <div className="course-detail-main__schedule">
                    <ol className="course-detail-main__sessions">
                      {sessions.map((s, i) => {
                        const isCompleted = i < enrollment.sessionsCompleted;
                        const isNext = i === enrollment.sessionsCompleted;
                        return (
                          <li key={s.id}>
                            <span className={cn(
                              'course-detail-main__sess-num',
                              isCompleted && 'is-done',
                              isNext && 'is-next',
                            )}>
                              {isCompleted ? '✓' : `Buổi ${s.sequence}`}
                            </span>
                            <span className="course-detail-main__sess-date">
                              {formatDate(s.startsAt)} · {formatTime(s.startsAt)}
                            </span>
                            <span className="course-detail-main__sess-dur">
                              {isCompleted ? 'Hoàn thành'
                                : isNext      ? '⏭ Buổi tiếp theo'
                                : 'Sắp tới'}
                            </span>
                          </li>
                        );
                      })}
                    </ol>
                  </div>
                </section>
              )}

              {course.scheduleType === 'FLEXIBLE' && (
                <section>
                  <h2>Credit còn lại</h2>
                  <div className="course-detail-main__flex-info">
                    <div>
                      <strong>{(enrollment.creditsRemaining ?? 0)}/{enrollment.totalSessions}</strong>
                      <span>credit còn lại</span>
                    </div>
                    <div>
                      <strong>{enrollment.expiresAt ? formatDate(enrollment.expiresAt) : '—'}</strong>
                      <span>hết hạn sử dụng</span>
                    </div>
                  </div>
                  <Button
                    variant="primary"
                    onClick={() => toast.info('Demo: tính năng đặt buổi flexible sẽ có ở tuần 5 cùng calendar coach.')}
                    style={{ marginTop: 16 }}
                  >
                    + Đặt buổi mới (consume credit)
                  </Button>
                </section>
              )}
            </main>

            <aside className="course-detail-aside">
              <div className="course-detail-aside__card">
                <div className="course-detail-aside__price">
                  <small>Tổng đã trả</small>
                  <strong>{formatVND(enrollment.pricePaid.amount)}</strong>
                </div>

                <Button
                  variant="secondary"
                  block
                  onClick={() => toast.info('Demo: chat với coach sẽ có ở tuần 7.')}
                >
                  💬 Nhắn tin coach
                </Button>

                {canCancel && (
                  <Button variant="ghost" block onClick={() => setCancelOpen(true)}>
                    Huỷ khoá học
                  </Button>
                )}

                {enrollment.refundAmount && (
                  <div className="course-detail-aside__notice course-detail-aside__notice--warn" style={{ marginTop: 12 }}>
                    Đã hoàn: <strong>{formatVND(enrollment.refundAmount.amount)}</strong>
                  </div>
                )}
              </div>
            </aside>
          </div>
        </div>
      </div>

      {canCancel && (
        <CancelEnrollmentModal
          open={cancelOpen}
          enrollment={enrollment}
          course={course}
          onClose={() => setCancelOpen(false)}
          onCancelled={(updated) => {
            setState((s) => s ? { ...s, enrollment: updated } : s);
            setCancelOpen(false);
          }}
        />
      )}
    </>
  );
}
