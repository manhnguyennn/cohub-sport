import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { courseService } from '@services/course.service';
import { ROUTES } from '@config/routes';
import { formatDate, formatTime } from '@lib/date';
import CourseEnrollCta from '@features/courses/CourseEnrollCta';
import type { CourseSession } from '@app-types/course';

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
  const sessions = await courseService.sessions(course.id).catch<CourseSession[]>(() => []);

  return (
    <div className="course-detail-page">
      {/* Hero */}
      <section className="course-detail-hero">
        <div className="course-detail-hero__cover">
          <Image src={course.cover} alt="" fill sizes="100vw" priority style={{ objectFit: 'cover' }} />
        </div>
        <div className="course-detail-hero__container">
          <span className="course-detail-hero__type">
            {course.scheduleType === 'FIXED' ? '📅 Lịch cố định' : '⚡ Linh hoạt'}
          </span>
          <h1>{course.title}</h1>
          <Link href={ROUTES.coachDetail(course.coachId)} className="course-detail-hero__coach">
            {course.coachAvatar && (
              <Image src={course.coachAvatar} alt={course.coachName} width={32} height={32} />
            )}
            <span>HLV {course.coachName}</span>
          </Link>
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
          </main>

          {/* Right sticky CTA (client component vì có onClick toast) */}
          <aside className="course-detail-aside">
            <CourseEnrollCta course={course} />
          </aside>
        </div>
      </div>
    </div>
  );
}
