'use client';

import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { useToast } from '@contexts/ToastContext';
import { formatVND } from '@lib/date';
import { ROUTES } from '@config/routes';
import type { Course } from '@app-types/course';

type Props = {
  course: Course;
  /** Slug coach để cross-sell sang lịch dạy mở (giữ tham số để tương thích) */
  coachSlug?: string;
  /** Ngày kết thúc (buổi cuối) — FIXED */
  endDate?: string;
  /** Học phí buổi lẻ thấp nhất của coach (VND) cho cross-sell */
  coachFromPrice?: number;
};

export default function CourseEnrollCta({ course }: Props) {
  const toast = useToast();
  const isFull = course.availableSeats === 0 || course.status === 'full';
  const isStarted = course.status === 'started';
  const canEnroll = !isFull && !isStarted && course.status === 'published';
  const lowSeats = course.availableSeats > 0 && course.availableSeats <= Math.ceil(course.maxParticipants / 2);

  return (
    <div className="course-detail-aside__card">
      <h3 className="course-detail-aside__title">{course.title}</h3>

      {/* Feature ngắn gọn (ref) */}
      <ul className="course-detail-aside__features">
        <li>
          <AppIcon name="book" size={15} />
          {course.totalSessions} buổi · {course.sessionDurationMin} phút/buổi
        </li>
        <li>
          <AppIcon name={course.scheduleType === 'FIXED' ? 'calendar' : 'flash'} size={15} />
          {course.scheduleType === 'FIXED' ? 'Lịch cố định' : 'Lịch tự chọn'}
        </li>
        <li>
          <AppIcon name="people" size={15} />
          Coaching 1-1 hoặc theo nhóm riêng
        </li>
      </ul>

      {lowSeats && !isFull && (
        <div className="course-detail-aside__urgency">
          Chỉ còn {course.availableSeats} chỗ — đăng ký sớm
        </div>
      )}
      {isFull && (
        <div className="course-detail-aside__notice course-detail-aside__notice--danger">
          Khoá học đã đầy. Bạn có thể vào danh sách chờ.
        </div>
      )}
      {isStarted && (
        <div className="course-detail-aside__notice course-detail-aside__notice--warn">
          Khoá học đã bắt đầu — không nhận thêm học viên.
        </div>
      )}

      <div className="course-detail-aside__price">
        <small>Giá trọn gói {course.totalSessions} buổi</small>
        <strong>{formatVND(course.price.amount)}</strong>
        <small>~ {formatVND(course.pricePerSession.amount)}/buổi</small>
      </div>

      {canEnroll ? (
        <Button href={ROUTES.courseEnroll(course.id)} variant="primary" size="lg" block>
          Đăng ký
        </Button>
      ) : isFull ? (
        <Button
          variant="secondary"
          size="lg"
          block
          onClick={() => toast.info('Demo: tính năng danh sách chờ đang phát triển — sẽ có ở v2.')}
        >
          Vào danh sách chờ
        </Button>
      ) : (
        <Button variant="secondary" size="lg" block disabled>
          Khoá đã bắt đầu
        </Button>
      )}

      <p className="course-detail-aside__note">
        <AppIcon name="shield" size={13} /> Đảm bảo hoàn tiền theo chính sách huỷ.
      </p>
    </div>
  );
}
