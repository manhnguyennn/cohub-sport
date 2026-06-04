'use client';

/**
 * /coach/courses — Coach's own course list.
 * Hiển thị courses do coach hiện tại tạo + enrollment count.
 *
 * Persona Khoa = c1; map qua coachId 'c1'.
 */
import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button, EmptyState, SkeletonList } from '@components/ui';
import { ROUTES } from '@config/routes';
import { formatVND, formatDate } from '@lib/date';
import { courseService } from '@services/course.service';
import { useAuth } from '@hooks/useAuth';
import { usePersona } from '@contexts/PersonaContext';
import { cn } from '@lib/cn';
import type { Course } from '@app-types/course';

export default function CoachCoursesClient() {
  const router = useRouter();
  const { isReady, isLoggedIn, role, requireLogin } = useAuth();
  const { persona } = usePersona();
  const [items, setItems] = useState<Course[] | null>(null);

  useEffect(() => {
    if (!isReady) return;
    if (!isLoggedIn) { requireLogin({ redirectTo: ROUTES.coachCourses }); return; }
    if (role !== 'coach' && role !== 'admin') { router.replace('/'); return; }

    const coachId = persona.coachSlug ? 'c1' : 'c1'; // mock map: Khoa = c1
    courseService.publishedByCoach(coachId).then(setItems).catch(() => setItems([]));
  }, [isReady, isLoggedIn, role, requireLogin, router, persona]);

  if (!isReady || !isLoggedIn) return null;

  return (
    <div className="coach-cms">
      <div className="coach-cms__container">
        <header className="cms-banner">
          <div>
            <strong>Khoá học của tôi</strong>
            <p>Quản lý các khoá học bạn đang mở và theo dõi số đăng ký.</p>
          </div>
          <Button href={ROUTES.coachCourseNew} variant="primary" size="md">
            + Tạo khoá học mới
          </Button>
        </header>

        {items === null ? (
          <SkeletonList rows={3} />
        ) : items.length === 0 ? (
          <EmptyState
            title="Bạn chưa có khoá học nào"
            description="Tạo khoá học đầu tiên để thu hút học viên đăng ký theo gói."
            action={<Button href={ROUTES.coachCourseNew} variant="primary">Tạo khoá học</Button>}
          />
        ) : (
          <div className="cms-course-list">
            {items.map((c) => <CoachCourseCard key={c.id} course={c} />)}
          </div>
        )}
      </div>
    </div>
  );
}

function CoachCourseCard({ course }: { course: Course }) {
  const enrolled = course.maxParticipants - course.availableSeats;
  return (
    <Link href={ROUTES.courseDetail(course.id)} className="cms-course-card" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="cms-course-card__media">
        <Image src={course.cover} alt={course.title} fill sizes="320px" style={{ objectFit: 'cover' }} />
        <span className={cn('cms-course-card__status', `cms-course-card__status--${course.status}`)}>
          {course.status === 'published' ? 'Đang tuyển'
            : course.status === 'started' ? 'Đã bắt đầu'
            : course.status === 'full'    ? 'Đã đầy'
            : 'Đã đóng'}
        </span>
      </div>
      <div className="cms-course-card__body">
        <div className="cms-course-card__title">{course.title}</div>
        <div className="cms-course-card__meta">
          <span>{course.totalSessions} buổi</span>
          <span>· {course.sessionDurationMin} phút</span>
          {course.scheduleType === 'FIXED' && course.startDate && (
            <span>· KG {formatDate(course.startDate)}</span>
          )}
        </div>
        <div className="cms-course-card__footer">
          <span className="cms-course-card__enrollment">
            <strong>{enrolled}/{course.maxParticipants}</strong> đã đăng ký
          </span>
          <strong style={{ color: 'var(--brand)' }}>{formatVND(course.price.amount)}</strong>
        </div>
      </div>
    </Link>
  );
}
