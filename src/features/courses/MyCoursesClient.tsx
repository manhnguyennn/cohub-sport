'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button, EmptyState, SkeletonList } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatDate, formatVND } from '@lib/date';
import { enrollmentService } from '@services/course.service';
import { useAuth } from '@hooks/useAuth';
import type { Enrollment } from '@app-types/course';

export default function MyCoursesClient() {
  const { isReady, isLoggedIn, user, requireLogin } = useAuth();
  const [items, setItems] = useState<Enrollment[] | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) {
      requireLogin({ redirectTo: ROUTES.myCourses });
      return;
    }
    if (!user) return;
    enrollmentService.list(user.id).then(setItems).catch(() => setItems([]));
  }, [isReady, isLoggedIn, user, requireLogin]);

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="my-bookings-page">
      <div className="my-bookings-page__container">
        <header className="my-bookings-page__head">
          <h1>Khoá học của tôi</h1>
          <p>Theo dõi tiến độ học và lịch sử khoá đã đăng ký.</p>
        </header>

        {items === null ? (
          <SkeletonList rows={3} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Bạn chưa đăng ký khoá học nào"
            description="Tìm khoá học phù hợp và bắt đầu lộ trình của bạn."
            action={<Button href={ROUTES.courses} variant="primary">Khám phá khoá học</Button>}
          />
        ) : (
          <div className="my-courses-grid">
            {items.map((e) => <EnrollmentCard key={e.id} enrollment={e} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function EnrollmentCard({ enrollment }: { enrollment: Enrollment }) {
  const progress = Math.round((enrollment.sessionsCompleted / enrollment.totalSessions) * 100);
  const statusBadge =
    enrollment.status === 'in_progress' ? { label: 'Đang học',     tone: 'info' } :
    enrollment.status === 'completed'   ? { label: 'Đã hoàn thành', tone: 'success' } :
    enrollment.status === 'cancelled'   ? { label: 'Đã huỷ',         tone: 'danger' } :
                                          { label: 'Hết hạn',        tone: 'danger' };

  return (
    <Link href={ROUTES.myCourseDetail(enrollment.id)} className="my-course-card">
      <div className="my-course-card__media">
        <Image src={enrollment.courseCover} alt="" fill sizes="200px" style={{ objectFit: 'cover' }} />
      </div>
      <div className="my-course-card__body">
        <span className={`my-booking-row__badge my-booking-row__badge--${statusBadge.tone}`} style={{ alignSelf: 'flex-start' }}>
          {statusBadge.label}
        </span>
        <h3>{enrollment.courseTitle}</h3>
        <span className="my-course-card__coach">HLV {enrollment.coachName}</span>

        <div className="my-course-card__progress">
          <div className="my-course-card__progress-bar">
            <span style={{ width: `${progress}%` }} />
          </div>
          <small>{enrollment.sessionsCompleted}/{enrollment.totalSessions} buổi · {progress}%</small>
        </div>

        <div className="my-course-card__meta">
          <span>Đăng ký: {formatDate(enrollment.enrolledAt)}</span>
          <strong>{formatVND(enrollment.pricePaid.amount)}</strong>
        </div>
      </div>
    </Link>
  );
}
