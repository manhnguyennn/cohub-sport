'use client';

import { Button } from '@components/ui';
import { useToast } from '@contexts/ToastContext';
import { formatVND, formatDate } from '@lib/date';
import { ROUTES } from '@config/routes';
import type { Course } from '@app-types/course';

type Props = { course: Course };

export default function CourseEnrollCta({ course }: Props) {
  const toast = useToast();
  const isFull = course.availableSeats === 0 || course.status === 'full';
  const isStarted = course.status === 'started';
  const canEnroll = !isFull && !isStarted && course.status === 'published';

  return (
    <div className="course-detail-aside__card">
      <div className="course-detail-aside__price">
        <small>Trọn gói {course.totalSessions} buổi</small>
        <strong>{formatVND(course.price.amount)}</strong>
        <small>~ {formatVND(course.pricePerSession.amount)}/buổi</small>
      </div>

      {course.availableSeats > 0 && course.availableSeats <= 3 && (
        <div className="course-detail-aside__urgency">
          ⚠ Chỉ còn {course.availableSeats} chỗ
        </div>
      )}

      {isFull && (
        <div className="course-detail-aside__notice course-detail-aside__notice--danger">
          Khoá học đã đầy. Bạn có thể vào waitlist.
        </div>
      )}

      {isStarted && (
        <div className="course-detail-aside__notice course-detail-aside__notice--warn">
          Khoá học đã bắt đầu — không nhận thêm học viên.
        </div>
      )}

      {canEnroll ? (
        <Button href={ROUTES.courseEnroll(course.id)} variant="primary" size="lg" block>
          Đăng ký ngay
        </Button>
      ) : isFull ? (
        <Button
          variant="secondary"
          size="lg"
          block
          onClick={() => toast.info('Demo: tính năng waitlist đang phát triển — sẽ có ở v2.')}
        >
          Vào waitlist
        </Button>
      ) : (
        <Button variant="secondary" size="lg" block disabled>
          Đã bắt đầu
        </Button>
      )}

      <ul className="course-detail-aside__stats">
        <li>
          <span>🎓 Cấp độ</span>
          <strong>
            {course.level === 'beginner' ? 'Người mới'
              : course.level === 'intermediate' ? 'Trung cấp'
              : 'Nâng cao'}
          </strong>
        </li>
        <li>
          <span>👥 Sĩ số tối đa</span>
          <strong>{course.maxParticipants} người</strong>
        </li>
        <li>
          <span>📍 Địa điểm</span>
          <strong>{course.location?.city ?? '—'}</strong>
        </li>
        {course.scheduleType === 'FIXED' && course.startDate && (
          <li>
            <span>🗓 Khai giảng</span>
            <strong>{formatDate(course.startDate)}</strong>
          </li>
        )}
      </ul>
    </div>
  );
}
