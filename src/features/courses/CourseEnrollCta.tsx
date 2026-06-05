'use client';

import Link from 'next/link';
import { Button } from '@components/ui';
import AppIcon from '@components/ui/AppIcon';
import { CancellationPolicy } from '@components/shared';
import { useToast } from '@contexts/ToastContext';
import { formatVND, formatDate } from '@lib/date';
import { ROUTES } from '@config/routes';
import type { Course } from '@app-types/course';

type Props = {
  course: Course;
  /** Slug coach để cross-sell sang lịch dạy mở */
  coachSlug?: string;
  /** Ngày kết thúc (buổi cuối) — FIXED */
  endDate?: string;
  /** Học phí buổi lẻ thấp nhất của coach (VND) cho cross-sell */
  coachFromPrice?: number;
};

const LEVEL_LABEL: Record<Course['level'], string> = {
  beginner: 'Người mới',
  intermediate: 'Trung cấp',
  advanced: 'Nâng cao',
};

export default function CourseEnrollCta({ course, coachSlug, endDate, coachFromPrice }: Props) {
  const toast = useToast();
  const isFull = course.availableSeats === 0 || course.status === 'full';
  const isStarted = course.status === 'started';
  const canEnroll = !isFull && !isStarted && course.status === 'published';

  const booked = Math.max(0, course.maxParticipants - course.availableSeats);
  const pct = course.maxParticipants > 0 ? Math.round((booked / course.maxParticipants) * 100) : 0;
  const lowSeats = course.availableSeats > 0 && course.availableSeats <= Math.ceil(course.maxParticipants / 2);

  return (
    <div className="course-detail-aside__card">
      <div className="course-detail-aside__price">
        <small>Trọn gói {course.totalSessions} buổi</small>
        <strong>{formatVND(course.price.amount)}</strong>
        <small>~ {formatVND(course.pricePerSession.amount)}/buổi</small>
      </div>

      {/* Seats progress (K3) */}
      <div className="course-detail-aside__seats">
        <div className="course-detail-aside__bar">
          <span style={{ width: `${pct}%` }} />
        </div>
        <small>{booked}/{course.maxParticipants} chỗ</small>
      </div>

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

      {canEnroll ? (
        <Button href={ROUTES.courseEnroll(course.id)} variant="primary" size="lg" block>
          Đăng ký ngay
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

      <ul className="course-detail-aside__stats">
        <li>
          <span><AppIcon name="teacher" size={15} /> Cấp độ</span>
          <strong>{LEVEL_LABEL[course.level]}</strong>
        </li>
        <li>
          <span><AppIcon name="people" size={15} /> Sĩ số tối đa</span>
          <strong>{course.maxParticipants} người</strong>
        </li>
        <li>
          <span><AppIcon name="location" size={15} /> Địa điểm</span>
          <strong>{course.location?.city ?? '—'}</strong>
        </li>
        {course.scheduleType === 'FIXED' && course.startDate && (
          <li>
            <span><AppIcon name="calendar" size={15} /> Khai giảng</span>
            <strong>{formatDate(course.startDate)}</strong>
          </li>
        )}
        {course.scheduleType === 'FIXED' && endDate && (
          <li>
            <span><AppIcon name="flag" size={15} /> Kết thúc</span>
            <strong>{formatDate(endDate)}</strong>
          </li>
        )}
      </ul>

      {/* Cancellation policy inline (K6) */}
      <CancellationPolicy variant="course" className="course-detail-aside__policy" />

      {/* Cross-sell Flow 2 (K5) */}
      {coachSlug && (
        <div className="course-detail-aside__crosssell">
          <span>Hoặc đặt buổi lẻ với coach</span>
          {coachFromPrice != null && <strong>Từ {formatVND(coachFromPrice)}/buổi</strong>}
          <Link href={`${ROUTES.coachDetail(coachSlug)}#open-sessions`} className="course-detail-aside__ghost">
            Xem lịch dạy mở →
          </Link>
        </div>
      )}
    </div>
  );
}
